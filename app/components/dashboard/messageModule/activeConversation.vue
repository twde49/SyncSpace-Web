<template>
    <div class="header flex items-center justify-between border-b p-4 pb-2 mb-4 z-20">
        <h2 class="textColorWhite miniFont font-bold">{{ getConversationName() }}</h2>
        <Icon name="ph:phone-call" size="24px" />
        <Icon name="ph:video-camera" size="24px" />
    </div>

    <div ref="chatContainer" class="chatArea p-4 flex-grow overflow-y-auto flex flex-col-reverse">
        <div @contextmenu.prevent="isOwnMessage(message) && showContextMenu(message)" v-for="message in messages"
            :key="message.id" :class="[
                'message-container',
                isOwnMessage(message) ? 'flex-row-reverse outgoing' : 'incoming',
            ]" :data-message-id="message.id">
            <div class="profile-name" :style="{
                backgroundColor:
                    message.sender?.email === userStore.email
                        ? 'var(--color-primary)'
                        : 'var(--color-white)',
                color:
                    message.sender?.email === userStore.email
                        ? 'var(--color-white)'
                        : 'var(--color-black)',
            }">
                {{ message.sender?.firstName?.charAt(0) || '' }}.{{
                    message.sender?.lastName?.charAt(0) || ''
                }}
            </div>
            <div class="message-bubble bgColorWhite">
                <!-- Image Message -->
                <div v-if="isImageMessage(message.content)" class="image-message">
                    <img :src="message.content?.includes('.gif') ? message.content : baseUrlWithoutApi + message.content" 
                         alt="Shared image" 
                         class="message-image" 
                         @click="openImageModal(message.content?.includes('.gif') ? message.content : baseUrlWithoutApi + message.content)" />
                </div>
                <!-- Audio Player pour les fichiers audio -->
                <div v-else-if="isAudioMessage(message.content)" class="audio-message">
                    <div class="custom-audio-player">
                        <button v-if="message.content"
                            @click="toggleAudioPlayback(String(message.id), baseUrlWithoutApi + message.content)"
                            class="play-pause-btn" :class="{ 'playing': audioStates[message.id]?.isPlaying }">
                            <Icon :name="audioStates[message.id]?.isPlaying ? 'ph:pause-fill' : 'ph:play-fill'" size="20px" />
                        </button>

                        <div class="audio-progress-container">
                            <div class="audio-waveform">
                                <div v-for="i in 20" :key="i" class="wave-bar-static"
                                    :class="{ 'active': audioStates[message.id]?.isPlaying && (i <= Math.floor((audioStates[message.id]?.progress || 0) * 20)) }"
                                    :style="{ height: `${Math.random() * 100 + 20}%` }"></div>
                            </div>
                            <div class="audio-time">
                                {{ formatTime(audioStates[message.id]?.currentTime || 0) }} /
                                {{ formatTime(audioStates[message.id]?.duration || 0) }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Message texte normal -->
                <span v-else class="textColorBlack">{{ message.content }}</span>
            </div>

            <div class="relative flex">
                <div v-if="activeMenu === String(message.id) && isOwnMessage(message)"
                    class="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50" :style="{
                        top: '0',
                        right: '30px',
                    }">
                    <div class="py-1">
                        <button class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            @click="deleteMessage(message)">
                            <Icon name="ph:trash" class="mr-2" size="16" />
                            Supprimer
                        </button>

                        <button class="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                            @click="showEditMessageModal(message)">
                            <Icon name="ph:pencil-simple-line" class="mr-2" size="16" />
                            Modifier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal d'édition -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Modifier le message</h3>
                <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
                    <Icon name="ph:x-square" size="24" />
                </button>
            </div>
            <div class="mb-4">
                <textarea v-model="editedMessageContent"
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    rows="4"></textarea>
            </div>
            <div class="flex justify-end gap-2">
                <button @click="closeEditModal"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Annuler
                </button>
                <button @keyup.enter="submitEditMessage" @click="submitEditMessage"
                    class="px-4 py-2 bg-blue-600 textColorWhite rounded-md hover:bg-blue-700">
                    Sauvegarder
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de confirmation audio -->
    <div v-if="showAudioConfirmModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Aperçu de l'enregistrement</h3>
                <button @click="cancelAudioPreview" class="text-gray-500 hover:text-gray-700">
                    <Icon name="ph:x-square" size="24" />
                </button>
            </div>

            <div class="mb-6">
                <div class="custom-audio-player preview-player">
                    <button @click="togglePreviewPlayback" class="play-pause-btn"
                        :class="{ 'playing': previewAudioState.isPlaying }">
                        <Icon :name="previewAudioState.isPlaying ? 'ph:pause-fill' : 'ph:play-fill'" size="20px" />
                    </button>

                    <div class="audio-progress-container">
                        <div class="audio-waveform">
                            <div v-for="i in 20" :key="i" class="wave-bar-static"
                                :class="{ 'active': previewAudioState.isPlaying && (i <= Math.floor(previewAudioState.progress * 20)) }"
                                :style="{ height: `${Math.random() * 100 + 20}%` }"></div>
                        </div>
                        <div class="audio-time">
                            {{ formatTime(previewAudioState.currentTime) }} /
                            {{ formatTime(previewAudioState.duration) }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <button @click="cancelAudioPreview"
                    class="px-4 py-2 bgColorBlack textColorWhite globalRadius">
                    Annuler
                </button>
                <button @click="retryRecording"
                    class="px-4 py-2 bgColorTritary textColorWhite globalRadius">
                    Réenregistrer
                </button>
                <button @click="confirmSendAudio"
                    class="px-4 py-2 bgColorCategoryTritary textColorWhite globalRadius">
                    Envoyer
                </button>
            </div>
        </div>
    </div>

    <!-- Modal pour afficher les images en plein écran -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" @click="closeImageModal">
        <div class="relative w-auto h-auto max-w-[90vw] max-h-[90vh] p-4">
            <button @click="closeImageModal" class="absolute top-2 right-2 text-white hover:text-gray-300 z-10">
                <Icon name="ph:x-square" size="32" />
            </button>
            <img :src="selectedImage" alt="Image en plein écran" class="max-w-full max-h-[75vh] object-contain" />
        </div>
    </div>

    <!-- Modal Giphy -->
    <div v-if="showGiphyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-11/12 max-w-4xl h-5/6 max-h-[600px] flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-lg font-semibold text-gray-900">Choisir un GIF</h3>
                <button @click="closeGiphyModal" class="text-gray-500 hover:text-gray-700">
                    <Icon name="ph:x-square" size="24" />
                </button>
            </div>

            <!-- Barre de recherche -->
            <div class="p-4 border-b">
                <div class="relative">
                    <input 
                        v-model="giphySearchQuery"
                        @input="debouncedSearch(giphySearchQuery)"
                        type="text" 
                        placeholder="Rechercher des GIFs..." 
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <Icon name="ph:magnifying-glass" size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <!-- Grille des GIFs -->
            <div class="flex-1 overflow-y-auto p-4">
                <div v-if="isLoadingGiphy && giphyGifs.length === 0" class="flex items-center justify-center h-32">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span class="ml-2 text-gray-600">Chargement des GIFs...</span>
                </div>

                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div 
                        v-for="gif in giphyGifs" 
                        :key="gif.id"
                        class="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100 aspect-square"
                        @click="selectGiphyGif(gif)"
                    >
                        <img 
                            :src="gif.images.fixed_width.url" 
                            :alt="gif.title"
                            class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2">
                                <Icon name="ph:plus-circle" size="20" class="text-gray-700" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bouton Charger plus -->
                <div v-if="hasMoreGiphy && giphyGifs.length > 0" class="flex justify-center mt-6">
                    <button 
                        @click="loadMoreGifs"
                        :disabled="isLoadingGiphy"
                        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <div v-if="isLoadingGiphy" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {{ isLoadingGiphy ? 'Chargement...' : 'Charger plus' }}
                    </button>
                </div>

                <!-- Message si aucun résultat -->
                <div v-if="!isLoadingGiphy && giphyGifs.length === 0" class="text-center text-gray-500 py-8">
                    <Icon name="ph:smiley-nervous" size="48" class="mx-auto mb-2 text-gray-300" />
                    <p>Aucun GIF trouvé</p>
                    <p class="text-sm">Essayez avec d'autres mots-clés</p>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t bg-gray-50 text-center">
                <p class="text-xs text-gray-500">Propulsé par Giphy</p>
            </div>
        </div>
    </div>

    <div class="messageInput bgColorWhite flex items-center">
        <div class="flex utilsZone items-center justify-between relative">
            <!-- Menu média animé -->
            <div class="media-menu-container relative flex">
                <Icon name="ph:plus-fill" 
                      size="21px" 
                      class="media textColorBlack cursor-pointer transition-transform duration-300 hover:scale-110" 
                      :class="{ 'rotate-45': showMediaMenu }"
                      @click="toggleMediaMenu" />

                <!-- Menu déroulant -->
                <div v-if="showMediaMenu" 
                     class="media-menu absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border overflow-hidden grid grid-cols-2 gap-x-4 gap-y-2"
                     :class="{ 'menu-enter-active': showMediaMenu }">

                    <!-- Option Photo -->
                    <div class="menu-item photo-item" @click="selectMediaType('photo')">
                        <div class="menu-icon bgColorSecondary">
                            <Icon name="ph:camera" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">Photo</span>
                            <span class="menu-subtitle text-gray-500">Partager une image</span>
                        </div>
                    </div>

                    <!-- Option GIF -->
                    <div class="menu-item gif-item" @click="selectMediaType('gif')">
                        <div class="menu-icon bgColorCategoryPrimary">
                            <Icon name="ph:gif" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">GIF</span>
                            <span class="menu-subtitle text-gray-500">Partager un GIF animé</span>
                        </div>
                    </div>

                    <!-- Option Mot de passe -->
                    <div class="menu-item password-item" @click="selectMediaType('password')">
                        <div class="menu-icon bg-red-500">
                            <Icon name="ph:key" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">Mot de passe</span>
                            <span class="menu-subtitle text-gray-500">Partager de façon sécurisée</span>
                        </div>
                    </div>

                    <!-- Option Note -->
                    <div class="menu-item note-item" @click="selectMediaType('note')">
                        <div class="menu-icon bg-yellow-500">
                            <Icon name="ph:note-pencil" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">Note</span>
                            <span class="menu-subtitle text-gray-500">Créer une note partagée</span>
                        </div>
                    </div>

                    <!-- Option Événement -->
                    <div class="menu-item event-item" @click="selectMediaType('event')">
                        <div class="menu-icon bg-blue-500">
                            <Icon name="ph:calendar-plus" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">Événement</span>
                            <span class="menu-subtitle text-gray-500">Planifier un rendez-vous</span>
                        </div>
                    </div>

                    <!-- Option Fichier -->
                    <div class="menu-item file-item" @click="selectMediaType('file')">
                        <div class="menu-icon bg-gray-600">
                            <Icon name="ph:file-arrow-up" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">Fichier</span>
                            <span class="menu-subtitle text-gray-500">Envoyer un document</span>
                        </div>
                    </div>

                    <!-- Option Musique -->
                    <div class="menu-item music-item" @click="selectMediaType('music')">
                        <div class="menu-icon bg-green-500">
                            <Icon name="ph:music-note" size="18px" class="text-white" />
                        </div>
                        <div class="menu-text">
                            <span class="menu-title text-gray-900">Musique</span>
                            <span class="menu-subtitle text-gray-500">Partager de l'audio</span>
                        </div>
                    </div>
                </div>

                <!-- Input files cachés -->
                <input ref="photoInput" 
                       type="file" 
                       accept="image/*" 
                       class="hidden" 
                       @change="handlePhotoSelect" />
            </div>

            <div class="microphone-container" @click="toggleRecording">
                <!-- Animation d'enregistrement -->
                <div v-if="isRecording" class="recording-overlay">
                    <!-- Cercles pulsants -->
                    <div class="pulse-circle pulse-1"></div>
                    <div class="pulse-circle pulse-2"></div>
                    <div class="pulse-circle pulse-3"></div>

                    <!-- Barres de vague animées -->
                    <div class="wave-container">
                        <div class="wave-bar" v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></div>
                    </div>

                    <!-- Cercle central avec microphone -->
                    <div class="mic-circle">
                        <Icon name="mdi:microphone" size="24px" class="text-white" />
                    </div>
                </div>

                <!-- Microphone normal -->
                <Icon name="ph:microphone" size="21px"
                    class="media textColorBlack cursor-pointer transition-all duration-200 hover:scale-110"
                    :class="{ 'opacity-0': isRecording }" />
            </div>
        </div>
        <input class="textMessageInput bgColorBlack textColorWhite" v-model="currentMessage" placeholder="Message..."
            @keyup.enter="sendMessage" style="outline: none" />
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch, computed, nextTick } from 'vue';
import type { Conversation } from '~/types/Conversation';
import type { Message } from '~/types/Message';
import { useUserStore } from '~/stores/userStore';
import useAuthFetch from '~/composables/useAuthFetch';
import { useWebSocket } from '~/composables/useWebSocket';

const userStore = useUserStore();
const { $toast } = useNuxtApp();
const chatContainer = ref<HTMLElement | null>(null);
import { useRuntimeConfig } from '#app';
const config = useRuntimeConfig();
const baseUrlWithoutApi = config.public.baseUrlWithoutApi;

const currentMessage = ref<string | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const isRecording = ref(false);
const isRecordingActive = ref(false);
const currentAttachment = ref<string>('');
const activeMenu = ref<string | null>(null);
const menuPositions = ref<{ [key: string]: number }>({});

// États pour le menu média
const showMediaMenu = ref(false);
const photoInput = ref<HTMLInputElement | null>(null);
const isUploadingMedia = ref(false);

// État pour les modals d'image
const showImageModal = ref(false);
const selectedImage = ref<string>('');

// États pour Giphy
const showGiphyModal = ref(false);
const giphyGifs = ref<any[]>([]);
const giphySearchQuery = ref('');
const isLoadingGiphy = ref(false);
const giphyOffset = ref(0);
const hasMoreGiphy = ref(true);

const showEditModal = ref(false);
const editedMessageContent = ref('');
const currentEditingMessage = ref<Message | null>(null);

// État pour la gestion audio
const audioElements = ref<{ [key: string]: HTMLAudioElement }>({});
const audioStates = ref<{ [key: string]: { isPlaying: boolean; currentTime: number; duration: number; progress: number } }>({});

// État pour la confirmation audio
const showAudioConfirmModal = ref(false);
const recordedAudioBlob = ref<Blob | null>(null);
const previewAudioUrl = ref<string>('');
const previewAudio = ref<HTMLAudioElement | null>(null);
const previewAudioState = reactive({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0
});

const props = defineProps<{ conversation: Conversation }>();

const reactiveConversation = reactive({ ...props.conversation });

const messages = computed(() => {
    return [...(reactiveConversation.messages || [])].reverse();
});

const emits = defineEmits<{
    'message-sent': [];
    'update-message': [];
    'refresh-conversations': [];
}>();

watch(
    () => props.conversation,
    newConversation => {
        Object.assign(reactiveConversation, newConversation);
    },
    { deep: true, immediate: true },
);

const { connect, webSocketData } = useWebSocket();

const isOwnMessage = (message: Message) => {
    return message.sender?.email === userStore.email;
};

const isAudioMessage = (content: string | undefined) => {
    if (!content) return false;
    const audioExtensions = ['.ogg', '.wav', '.mp3', '.webm', '.m4a', '.aac'];
    return audioExtensions.some(ext => content.toLowerCase().includes(ext));
};

const isImageMessage = (content: string | undefined) => {
    if (!content) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => content.toLowerCase().includes(ext));
};

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Fonctions pour le menu média
const toggleMediaMenu = () => {
    showMediaMenu.value = !showMediaMenu.value;
};

const selectMediaType = (type: 'photo' | 'gif' | 'password' | 'note' | 'event' | 'file' | 'music') => {
    if (type === 'photo') {
        photoInput.value?.click();
    } else if (type === 'gif') {
        openGiphyModal();
    } else if (type === 'password') {
        console.log('Share password functionality');
        $toast.info('Fonctionnalité de partage de mot de passe à implémenter.');
    } else if (type === 'note') {
        console.log('Share note functionality');
        $toast.info('Fonctionnalité de partage de note à implémenter.');
    } else if (type === 'event') {
        console.log('Plan event functionality');
        $toast.info('Fonctionnalité de planification d\'événement à implémenter.');
    } else if (type === 'file') {
        console.log('Share file functionality');
        $toast.info('Fonctionnalité de partage de fichier à implémenter.');
    } else if (type === 'music') {
        console.log('Share music functionality');
        $toast.info('Fonctionnalité de partage de musique à implémenter.');
    }
    showMediaMenu.value = false;
};

const handlePhotoSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        await uploadMedia(file, 'image');
    }
    target.value = '';
};

// Fonctions Giphy
const openGiphyModal = async () => {
    showGiphyModal.value = true;
    if (giphyGifs.value.length === 0) {
        await loadTrendingGifs();
    }
};

const closeGiphyModal = () => {
    showGiphyModal.value = false;
    giphySearchQuery.value = '';
    giphyOffset.value = 0;
    hasMoreGiphy.value = true;
};

const searchGiphy = async (query: string = giphySearchQuery.value) => {
    if (isLoadingGiphy.value) return;

    try {
        isLoadingGiphy.value = true;
        giphyOffset.value = 0;

        const apiKey = config.public.giphyApiKey;
        const endpoint = query 
            ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=20&offset=0&rating=g`
            : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20&offset=0&rating=g`;

        const response = await fetch(endpoint);
        const data = await response.json();

        giphyGifs.value = data.data || [];
        hasMoreGiphy.value = data.data && data.data.length === 20;
        giphyOffset.value = 20;
    } catch (error) {
        console.error('Erreur lors de la recherche Giphy:', error);
        $toast.error('Erreur lors du chargement des GIFs');
        giphyGifs.value = [];
    } finally {
        isLoadingGiphy.value = false;
    }
};

const loadTrendingGifs = async () => {
    await searchGiphy('');
};

const loadMoreGifs = async () => {
    if (isLoadingGiphy.value || !hasMoreGiphy.value) return;

    try {
        isLoadingGiphy.value = true;

        const apiKey = config.public.giphyApiKey;
        const endpoint = giphySearchQuery.value 
            ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(giphySearchQuery.value)}&limit=20&offset=${giphyOffset.value}&rating=g`
            : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20&offset=${giphyOffset.value}&rating=g`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            giphyGifs.value = [...giphyGifs.value, ...data.data];
            giphyOffset.value += 20;
            hasMoreGiphy.value = data.data.length === 20;
        } else {
            hasMoreGiphy.value = false;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des GIFs supplémentaires:', error);
        $toast.error('Erreur lors du chargement des GIFs');
    } finally {
        isLoadingGiphy.value = false;
    }
};

const selectGiphyGif = async (gif: any) => {
    try {
        const gifUrl = gif.images.original.url;
        await sendGifMessage(gifUrl);
        closeGiphyModal();
    } catch (error) {
        console.error('Erreur lors de l\'envoi du GIF:', error);
        $toast.error('Erreur lors de l\'envoi du GIF');
    }
};

const sendGifMessage = async (gifUrl: string) => {
    try {
        await useAuthFetch(`conversation/${reactiveConversation.id}/message/new/gif?${Date.now()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gifUrl: gifUrl,
            }),
        });

        emits('message-sent');
    } catch (error) {
        console.error('Error sending GIF:', error);
        $toast.error('Erreur lors de l\'envoi du GIF');
    }
};

// Debounce pour la recherche
let searchTimeout: ReturnType<typeof setTimeout>;
const debouncedSearch = (query: string) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (query.trim()) {
            searchGiphy(query);
        } else {
            loadTrendingGifs();
        }
    }, 500);
};

const uploadMedia = async (file: File, type: 'image' | 'gif') => {
    if (isUploadingMedia.value) return;

    try {
        isUploadingMedia.value = true;
        const formData = new FormData();
        formData.append('media', file);
        formData.append('type', type);

        await useAuthFetch(`conversation/${reactiveConversation.id}/message/new/media?${Date.now()}`, {
            method: 'POST',
            body: formData,
        });

        emits('message-sent');
    } catch (error) {
        console.error('Error uploading media:', error);
        $toast.error(`Erreur lors de l'envoi du ${type === 'image' ? 'photo' : 'GIF'}`);
    } finally {
        isUploadingMedia.value = false;
    }
};

// Fonctions pour les modals d'image
const openImageModal = (imageSrc: string) => {
    selectedImage.value = imageSrc;
    showImageModal.value = true;
};

const closeImageModal = () => {
    showImageModal.value = false;
    selectedImage.value = '';
};

const toggleAudioPlayback = async (messageId: string, audioUrl: string) => {
    if (!audioElements.value[messageId]) {
        audioElements.value[messageId] = new Audio(audioUrl);
        audioStates.value[messageId] = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            progress: 0
        };

        const audio = audioElements.value[messageId];

        audio.addEventListener('loadedmetadata', () => {
            if (audioStates.value[messageId]) {
                audioStates.value[messageId]!.duration = audio.duration;
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (audioStates.value[messageId]) {
                audioStates.value[messageId]!.currentTime = audio.currentTime;
            }
            if (audioStates.value[messageId]) {
                audioStates.value[messageId]!.progress = audio.currentTime / audio.duration;
            }
        });

        audio.addEventListener('ended', () => {
            if (audioStates.value[messageId]) {
                audioStates.value[messageId]!.isPlaying = false;
            }
            audioStates.value[messageId]!.currentTime = 0;
            audioStates.value[messageId]!.progress = 0;
        });
    }

    const audio = audioElements.value[messageId];
    const state = audioStates.value[messageId];

    if (state?.isPlaying) {
        audio.pause();
        state.isPlaying = false;
    } else {
        // Pause tous les autres audios
        Object.keys(audioElements.value).forEach(key => {
            if (key !== messageId && audioStates.value[key]?.isPlaying) {
                audioElements.value[key].pause();
                if (audioStates.value[key]) {
                    audioStates.value[key]!.isPlaying = false;
                }
            }
        });

        audio.play();
        if (state) {
            state.isPlaying = true;
        }
    }
};

const togglePreviewPlayback = () => {
    if (!previewAudio.value) return;

    if (previewAudioState.isPlaying) {
        previewAudio.value.pause();
        previewAudioState.isPlaying = false;
    } else {
        previewAudio.value.play();
        previewAudioState.isPlaying = true;
    }
};

const getConversationName = () => {
    if (reactiveConversation.name) {
        const allUsersName = reactiveConversation.users
            ?.map(user => `${user.firstName ?? ''} ${user.lastName ?? ''}`)
            .join(', ');
        return `${reactiveConversation.name} (${allUsersName})`;
    }

    if (reactiveConversation.users?.length === 2) {
        return reactiveConversation.users
            ?.filter(user => user.email !== userStore.email)
            .map(user => `${user.firstName ?? ''} ${user.lastName ?? ''}`)
            .join(' ');
    }
    return reactiveConversation.users
        ?.map(user => `${user.firstName ?? ''} ${user.lastName ?? ''}`)
        .join(', ');
};

const showContextMenu = (message: Message) => {
    if (isOwnMessage(message)) {
        toggleMenu(String(message.id));
    }
};

const toggleMenu = (messageId: string) => {
    if (activeMenu.value === messageId) {
        activeMenu.value = null;
    } else {
        activeMenu.value = messageId;
        nextTick(() => {
            const element = document.querySelector(
                `[data-message-id="${messageId}"]`,
            );
            if (element) {
                const rect = element.getBoundingClientRect();
                menuPositions.value[messageId] = rect.right;
            }
        });
    }
};

onMounted(() => {
    document.addEventListener('click', event => {
        const target = event.target as Element;

        // Fermer le menu contextuel des messages
        if (
            activeMenu.value &&
            !target?.closest?.('.message-container')
        ) {
            activeMenu.value = null;
        }

        // Fermer le menu média si on clique ailleurs
        if (
            showMediaMenu.value &&
            !target?.closest?.('.media-menu-container')
        ) {
            showMediaMenu.value = false;
        }

        // Fermer la modal Giphy si on clique en dehors
        if (
            showGiphyModal.value &&
            !target?.closest?.('.bg-white') &&
            target?.closest?.('.fixed')
        ) {
            closeGiphyModal();
        }
    });
});

const showEditMessageModal = (message: Message) => {
    currentEditingMessage.value = message;
    editedMessageContent.value = message.content ?? '';
    showEditModal.value = true;
    activeMenu.value = null;
};

const closeEditModal = () => {
    showEditModal.value = false;
    currentEditingMessage.value = null;
    editedMessageContent.value = '';
};

const submitEditMessage = async () => {
    if (!currentEditingMessage.value || !editedMessageContent.value.trim()) {
        return;
    }

    await editMessage(currentEditingMessage.value, editedMessageContent.value);
    closeEditModal();
};

const deleteMessage = async (message: Message) => {
    try {
        await useAuthFetch(`conversation/message/remove/${message.id}?${Date.now()}`, {
            method: 'DELETE',
        });

        if (reactiveConversation.messages) {
            const index = reactiveConversation.messages.findIndex(
                m => m.id === message.id,
            );
            if (index !== -1) {
                reactiveConversation.messages.splice(index, 1);
            }
        }

        $toast.success('Message deleted successfully');
        activeMenu.value = null;
        emits('update-message');
    } catch (error) {
        if (error instanceof Error) {
            $toast.error(error.message);
        } else {
            $toast.error('Failed to delete message');
        }
    }
};

const editMessage = async (message: Message, newMessageContent: string) => {
    try {
        await useAuthFetch(`conversation/message/edit/${message.id}?${Date.now()}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: newMessageContent,
            }),
        });

        if (reactiveConversation.messages) {
            const index = reactiveConversation.messages.findIndex(
                m => m.id === message.id,
            );
            if (index !== -1) {
                reactiveConversation.messages[index]!.content = newMessageContent;
            }
        }

        $toast.success('Message updated successfully');
        activeMenu.value = null;
        emits('update-message');
    } catch (error) {
        if (error instanceof Error) {
            $toast.error(error.message);
        } else {
            $toast.error('Failed to update message');
        }
    }
};

const sendMessage = async () => {
    try {
        await useAuthFetch(`conversation/${reactiveConversation.id}/message/new?${Date.now()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: currentMessage.value,
                attachment: currentAttachment.value,
            }),
        });

        emits('message-sent');
    } catch (error) {
        if (error instanceof Error) {
            $toast.error(error.message);
        } else {
            $toast.error('An unknown error occurred');
        }
    } finally {
        currentMessage.value = null;
        currentAttachment.value = '';
    }
};

watch(
    () => giphySearchQuery.value,
    (newQuery) => {
        if (showGiphyModal.value) {
            debouncedSearch(newQuery);
        }
    }
);
watch(webSocketData.value, async data => {
    if (data.type === 'refreshConversations') {
        emits('refresh-conversations');
    }
});
watch(webSocketData.value, async data => {
    if (data.type === 'newMessage') {
        if (data.conversationId === reactiveConversation.id) {
            if (typeof data.newMessage === 'string') {
                try {
                    const parsedMessage = JSON.parse(data.newMessage) as Message;
                    if (reactiveConversation.messages !== undefined && reactiveConversation.messages !== null) {
                        reactiveConversation.messages.push(parsedMessage);
                    }
                } catch (error) {
                    console.error('Failed to parse message:', error);
                }
            } else {
                if (reactiveConversation.messages !== undefined && reactiveConversation.messages !== null) {
                    reactiveConversation.messages.push(data.newMessage);
                }
            }
        }
    }
});

onMounted(() => {
    userStore.loadUserFromCookies();
    connect();
});

const toggleRecording = async () => {
    if (isRecording.value) {
        stopRecording();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.value = new MediaRecorder(stream);

            mediaRecorder.value.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            };

            mediaRecorder.value.onstop = async () => {
                const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
                audioChunks.value = [];

                // Stocker le blob et afficher la modal de confirmation
                recordedAudioBlob.value = audioBlob;
                previewAudioUrl.value = URL.createObjectURL(audioBlob);
                showAudioConfirmationModal();
            };

            audioChunks.value = [];
            mediaRecorder.value.start();
            isRecording.value = true;
            isRecordingActive.value = true;
        } catch (error) {
            $toast.error('Erreur microphone');
            console.error(error);
        }
    }
};

function stopRecording() {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;
        isRecordingActive.value = false;
    }
}

const showAudioConfirmationModal = () => {
    showAudioConfirmModal.value = true;

    // Configurer l'audio de prévisualisation
    nextTick(() => {
        previewAudio.value = new Audio(previewAudioUrl.value);

        previewAudio.value.addEventListener('loadedmetadata', () => {
            previewAudioState.duration = previewAudio.value!.duration;
        });

        previewAudio.value.addEventListener('timeupdate', () => {
            previewAudioState.currentTime = previewAudio.value!.currentTime;
            previewAudioState.progress = previewAudio.value!.currentTime / previewAudio.value!.duration;
        });

        previewAudio.value.addEventListener('ended', () => {
            previewAudioState.isPlaying = false;
            previewAudioState.currentTime = 0;
            previewAudioState.progress = 0;
        });
    });
};

const cancelAudioPreview = () => {
    if (previewAudio.value) {
        previewAudio.value.pause();
        previewAudio.value = null;
    }

    if (previewAudioUrl.value) {
        URL.revokeObjectURL(previewAudioUrl.value);
        previewAudioUrl.value = '';
    }

    recordedAudioBlob.value = null;
    showAudioConfirmModal.value = false;

    // Reset preview state
    Object.assign(previewAudioState, {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        progress: 0
    });
};

const retryRecording = () => {
    cancelAudioPreview();
    toggleRecording();
};

const confirmSendAudio = async () => {
    if (recordedAudioBlob.value) {
        await sendAudioMessage(recordedAudioBlob.value);
        cancelAudioPreview();
    }
};

const sendAudioMessage = async (audioBlob: Blob) => {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio-message.webm');

        await useAuthFetch(`conversation/${reactiveConversation.id}/message/new/audio?${Date.now()}`, {
            method: 'POST',
            body: formData,
        });

        emits('message-sent');
    } catch (error) {
        $toast.error('Failed to send audio message');
        console.error(error);
    }
};
</script>

<style scoped>
.textMessageInput {
    width: 85%;
    border-radius: 5px;
    height: 4vh;
}

.textMessageInput {
    color: var(--color-white);
    padding-left: 2%;
}

.utilsZone {
    width: 13%;
}

.chatArea {
    display: flex;
    flex-direction: column-reverse;
    gap: 15px;
    padding: 15px 5px;
}

.message-container {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    position: relative;
}

.message-bubble {
    padding: 12px 15px;
    border-radius: 18px;
    max-width: 70%;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    margin-top: 1.5rem;
}

.incoming.message-bubble {
    background-color: var(--color-white);
    color: var(--color-black);
    border-top-left-radius: 4px;
}

.outgoing.message-bubble {
    background-color: var(--color-primary);
    color: var(--color-white);
    border-top-right-radius: 4px;
}

.messageInput {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 99%;
    height: 5vh;
    border: 1px solid var(--color-black);
    border-radius: 5px;
    padding: 0.5rem;
    margin-bottom: 0.1rem;
    margin-left: 0.13rem;
}

.profile-name {
    font: var(--text-style-mini);
    color: var(--color-black);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    background-color: var(--color-white);
    transition: transform 0.3s ease;
}

/* Styles pour les messages d'image */
.image-message {
    width: 100%;
    max-width: 300px;
}

.message-image {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.message-image:hover {
    transform: scale(1.02);
}

/* Styles pour le menu média */
.media-menu-container {
    position: relative;
    z-index: 30;
}

.media-menu {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: 8px;
    min-width: 400px; /* Wider for 2 columns */
    /* max-width: 280px; - Removed, as min-width defines new base */
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.08);
    overflow: hidden; /* Keep hidden for border-radius clip */
    transform-origin: bottom left;
    animation: menuSlideUp 0.2s ease-out forwards;
    /* max-height: 400px; - Removed for 2-row layout */
    /* overflow-y: auto; - Removed for 2-row layout */
    padding: 8px; /* Add some padding inside the grid container */
}

@keyframes menuSlideUp {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.05); - Removed for grid layout */
}

.menu-item:last-child {
    /* border-bottom: none; - No longer needed */
}

.menu-item:hover {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    transform: translateX(2px);
}

.photo-item:hover {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.gif-item:hover {
    background: linear-gradient(135deg, #faf5ff, #f3e8ff);
}

.password-item:hover {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

.note-item:hover {
    background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.event-item:hover {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.file-item:hover {
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

.music-item:hover {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    margin-right: 12px;
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.menu-item:hover .menu-icon {
    transform: scale(1.1);
}

.menu-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-grow: 1;
}

.menu-title {
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;
}

.menu-subtitle {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.2;
}

/* Animation de rotation pour l'icône + */
.rotate-45 {
    transform: rotate(45deg);
}

/* Styles pour les lecteurs audio personnalisés */
.audio-message {
    width: 100%;
    min-width: 250px;
}

.custom-audio-player {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: var(--color-black);
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.preview-player {
    background: var(--color-black);
    border: 1px solid rgba(59, 130, 246, 0.2);
}

.play-pause-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.play-pause-btn:hover {
    transform: scale(1.05);
}

.audio-progress-container {
    display: flex;
    flex-grow: 1;
    gap: 4px;
}

.audio-waveform {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    flex-grow: 1;
}

.wave-bar-static {
    width: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    transition: all 0.3s ease;
    min-height: 4px;
}

.wave-bar-static.active {
    background: var(--color-primary);
    transform: scaleY(1.2);
}

.audio-time {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
}

.microphone-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
}

.recording-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    animation: fade-in-scale 0.3s ease-out;
}

/* Cercles pulsants */
.pulse-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    opacity: 0.3;
}

.pulse-1 {
    width: 80px;
    height: 80px;
    animation: pulse-expand 2s infinite ease-out;
}

.pulse-2 {
    width: 60px;
    height: 60px;
    animation: pulse-expand 2s infinite ease-out 0.3s;
}

.pulse-3 {
    width: 40px;
    height: 40px;
    animation: pulse-expand 2s infinite ease-out 0.6s;
}

@keyframes pulse-expand {
    0% {
        transform: scale(0.3);
        opacity: 0.8;
    }

    50% {
        transform: scale(1);
        opacity: 0.4;
    }

    100% {
        transform: scale(1.4);
        opacity: 0;
    }
}

/* Cercle central avec microphone */
.mic-circle {
    position: relative;
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    animation: mic-glow 1.5s infinite ease-in-out;
}

@keyframes mic-glow {

    0%,
    100% {
        box-shadow: 0 4px 15px rgba(var(--color-primary), 0.4);
        transform: scale(1);
    }

    50% {
        box-shadow: 0 6px 25px rgba(var(--color-primary), 0.8);
        transform: scale(1.05);
    }
}

/* Container des barres de vague */
.wave-container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    top: -15px;
    z-index: 3;
}

/* Barres de vague */
.wave-bar {
    width: 3px;
    height: 8px;
    background: linear-gradient(to top, #ef4444, #fca5a5);
    border-radius: 2px;
    animation: wave-bounce 1.2s infinite ease-in-out;
    transform-origin: center;
}

.wave-bar:nth-child(1) {
    animation-delay: 0s;
}

.wave-bar:nth-child(2) {
    animation-delay: 0.1s;
}

.wave-bar:nth-child(3) {
    animation-delay: 0.2s;
}

.wave-bar:nth-child(4) {
    animation-delay: 0.3s;
}

.wave-bar:nth-child(5) {
    animation-delay: 0.4s;
}

@keyframes wave-bounce {

    0%,
    100% {
        transform: scaleY(0.5);
        opacity: 0.6;
    }

    25% {
        transform: scaleY(2.5);
        opacity: 1;
    }

    50% {
        transform: scaleY(1.2);
        opacity: 0.8;
    }

    75% {
        transform: scaleY(3);
        opacity: 1;
    }
}

/* Animation d'apparition */
@keyframes fade-in-scale {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }

    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

/* Responsive */
@media(max-width: 640px) {
    .recording-overlay {
        width: 70px;
        height: 70px;
    }

    .pulse-1 {
        width: 70px;
        height: 70px;
    }

    .pulse-2 {
        width: 50px;
        height: 50px;
    }

    .pulse-3 {
        width: 35px;
        height: 35px;
    }

    .mic-circle {
        width: 40px;
        height: 40px;
    }

    .wave-container {
        top: -12px;
    }

    .media-menu {
        min-width: 200px; /* Adjusted for smaller screens, single column */
        max-width: 250px; /* Adjusted for smaller screens */
        grid-template-columns: 1fr; /* Force single column on small screens */
        gap: 0; /* Remove gap when single column */
    }

    .menu-item {
        padding: 10px 12px;
    }

    .menu-icon {
        width: 32px;
        height: 32px;
    }

    .menu-title {
        font-size: 13px;
    }

    .menu-subtitle {
        font-size: 11px;
    }

    /* Responsive pour la modal Giphy */
    .grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>