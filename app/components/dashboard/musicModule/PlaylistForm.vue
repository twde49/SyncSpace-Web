<template>
    <div>
        <button ref="createBtn" @click="toggleForm"
            class="create-playlist-btn flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-3 shadow-lg hover:opacity-90 transition-transform duration-200 hover:scale-105"
            aria-label="Créer une nouvelle playlist">
            <Icon name="ph:plus-circle-bold" :size="24" class="text-white" />
        </button>

        <Teleport to="body">
            <div v-if="isFormVisible" class="playlist-form-modal" @click.self="closeForm">
                <div ref="formContainer" class="playlist-form-container bgColorBlack rounded-lg p-6 shadow-2xl">
                    <h3 class="textColorWhite text-xl font-semibold mb-4">Créer une nouvelle playlist</h3>
                    <form @submit.prevent="createPlaylist" class="space-y-4">
                        <div class="form-group">
                            <label for="playlist-name" class="textColorWhite block mb-2">Nom de la playlist</label>
                            <input id="playlist-name" v-model="playlistName" type="text"
                                class="w-full p-2 rounded-md bg-[#1A1A1A] border-0 textColorWhite focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                                placeholder="Nom " autofocus ref="nameInput" />
                            <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button type="button" @click="closeForm"
                                class="px-4 py-2 rounded-md border-0 bg-[#2A2A2A] textColorWhite hover:bg-[#3A3A3A] transition-colors duration-200">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-4 py-2 rounded-md bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] textColorWhite hover:opacity-90 transition-opacity duration-200"
                                :disabled="isCreating">
                                {{ isCreating ? 'Création...' : 'Créer la playlist' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { Icon } from '#components';
import { useMusicPlayer } from '~/utils/useMusicPlayer';

const emit = defineEmits(['playlistCreated']);
const { createPlaylist: createMusicPlayerPlaylist } = useMusicPlayer();

const playlistName = ref('');
const nameError = ref('');
const isFormVisible = ref(false);
const isCreating = ref(false);

const createBtn = ref(null);
const formContainer = ref(null);
const nameInput = ref(null);

const toggleForm = () => {
    if (isFormVisible.value) {
        closeForm();
    } else {
        showForm();
    }
};

const showForm = () => {
    isFormVisible.value = true;
    playlistName.value = '';
    nameError.value = '';

    nextTick(() => {
        if (nameInput.value) {
            (nameInput.value as HTMLInputElement).focus();
        }
    });
};

const closeForm = () => {
    isFormVisible.value = false;
};

const createPlaylist = async () => {
    if (!playlistName.value.trim()) {
        nameError.value = 'Veuillez entrer un nom de playlist';
        return;
    }

    nameError.value = '';
    isCreating.value = true;

    try {
        const newPlaylist = await createMusicPlayerPlaylist(playlistName.value.trim());

        emit('playlistCreated', newPlaylist);
        closeForm();

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
        console.error('Erreur lors de la création de la playlist :', error);
        nameError.value = errorMessage || 'Échec de la création de la playlist. Veuillez réessayer.';
    } finally {
        isCreating.value = false;
    }
};


watch(() => isFormVisible.value, (newValue) => {
    if (newValue) {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeForm();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }
});
</script>

<style scoped>
.playlist-form-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.playlist-form-container {
    width: 90%;
    max-width: 400px;
}

.create-playlist-btn {
    position: relative;
    z-index: 1;
}

@media (max-width: 640px) {
    .playlist-form-container {
        width: 95%;
        max-width: 350px;
        padding: 1rem;
    }
}
</style>
