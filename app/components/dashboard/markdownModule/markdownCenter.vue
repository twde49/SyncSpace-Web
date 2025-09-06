<template>
    <div id="select-modal" tabindex="-1" aria-hidden="true"
        class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
        <div class="relative p-4 w-full max-w-md max-h-[90%]">
            <div class="relative bgColorWhite rounded-lg shadow-sm dark:bg-gray-700">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <div class="flex-grow">
                        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                            <li class="me-2" role="presentation">
                                <button @click="activeTab = 'myNotes'" :class="{
                                    'inline-block p-4 border-b-2 rounded-t-lg': true,
                                    'border-[var(--primary-color)] textColorPrimary': activeTab === 'myNotes',
                                    'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'myNotes'
                                }" type="button" role="tab">Mes notes</button>
                            </li>
                            <li class="me-2" role="presentation">
                                <button @click="activeTab = 'sharedNotes'" :class="{
                                    'inline-block p-4 border-b-2 rounded-t-lg': true,
                                    'border-[var(--primary-color)] textColorPrimary': activeTab === 'sharedNotes',
                                    'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== 'sharedNotes'
                                }" type="button" role="tab">Notes partagées</button>
                            </li>
                        </ul>
                    </div>
                    <button @click="closeModal" type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:textColorWhite"
                        data-modal-toggle="select-modal">
                        <Icon name="ph:x-square" size="24" />
                    </button>
                </div>
                <div class="p-4 md:p-5">
                    <ul class="space-y-4 mb-4 max-h-64 overflow-y-auto">
                        <li>
                            <input type="radio" id="new-note" name="job" value="new" class="hidden peer" required
                                @change="chosenNote = {} as Note" :checked="chosenNote && !chosenNote.id" />
                            <label for="new-note"
                                class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500">
                                <div class="block">
                                    <div class="w-full text-lg textColorBlack font-semibold">Nouvelle note</div>
                                </div>
                                <div>
                                    <Icon name="ph:plus-fill" size="21px" class="media textColorBlack" />
                                </div>
                            </label>
                        </li>
                        <hr class="my-4 border-gray-300 dark:border-gray-600" />

                        <!-- My Notes List -->
                        <template v-if="activeTab === 'myNotes'">
                            <li v-for="note in notes" :key="note.id">
                                <input type="radio" :id="`my-note-${note.id}`" name="job" :value="note.id"
                                    class="hidden peer" required @change="chosenNote = note"
                                    :checked="chosenNote && chosenNote.id === note.id" />
                                <label :for="`my-note-${note.id}`"
                                    class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500">
                                    <div class="block">
                                        <div v-if="noteToDelete !== note.id && noteToShare !== note.id"
                                            class="w-full text-lg font-semibold">
                                            {{ note.title }}
                                        </div>
                                        <div v-if="noteToDelete !== note.id && noteToShare !== note.id"
                                            class="w-full text-gray-500 dark:text-gray-400">
                                            Dernière mise à jour:
                                            <br />
                                            {{ getFormatedDate(note.updatedAt) }}
                                        </div>
                                        <div v-if="noteToDelete === note.id" class="flex justify-between w-full">
                                            <button @click.stop="cancelDelete"
                                                class="bg-gray-200 text-gray-900 rounded-lg px-4 py-2">
                                                Annuler
                                            </button>
                                            <button @click.stop="deleteNote(note.id)"
                                                class="bg-red-600 textColorWhite rounded-lg px-4 py-2">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                    <div v-if="noteToDelete !== note.id && noteToShare !== note.id"
                                        class="flex space-x-2">
                                        <Icon name="ph:share-network-fill" size="21px" class="shareIcon"
                                            @click.stop="openShareModal(note.id)" />
                                        <Icon name="ph:trash-fill" size="21px" class="trashIcon"
                                            @click.stop="confirmDelete(note.id)" />
                                    </div>
                                </label>
                            </li>
                            <li v-if="notes.length === 0">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <span class="ml-2">Aucune note personnelle disponible</span>
                                    </div>
                                </div>
                            </li>
                        </template>

                        <!-- Shared Notes List -->
                        <template v-if="activeTab === 'sharedNotes'">
                            <li v-for="note in sharedNotes" :key="note.id">
                                <input type="radio" :id="`shared-note-${note.id}`" name="job" :value="note.id"
                                    class="hidden peer" required @change="chosenNote = note"
                                    :checked="chosenNote && chosenNote.id === note.id" />
                                <label :for="`shared-note-${note.id}`"
                                    class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500">
                                    <div class="block">
                                        <div class="w-full text-lg font-semibold">
                                            {{ note.title }}
                                        </div>
                                        <div class="w-full text-gray-500 dark:text-gray-400">
                                            Dernière mise à jour:
                                            <br />
                                            {{ getFormatedDate(note.updatedAt) }}
                                        </div>
                                    </div>
                                    <!-- Shared notes usually don't have a delete option for the current user -->
                                </label>
                            </li>
                            <li v-if="sharedNotes.length === 0">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <span class="ml-2">Aucune note partagée disponible</span>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                    <button @click="openNote(chosenNote)" :disabled="!chosenNote"
                        class="textColorWhite disabledButton disabled:bg-gray-400 disabled:!important inline-flex w-full justify-center bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark">
                        Ouvrir cette note
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden w-[90%] max-w-[500px] max-h-[80vh] flex flex-col">
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-xl textColorBlack m-0">Partager la note</h3>
                <button class="bg-transparent border-0 cursor-pointer textColorBlack" @click="closeShareModal">
                    <Icon name="ph:x-square" size="1.5em" />
                </button>
            </div>
            <div class="p-5 flex-1 overflow-y-auto">
                <div class="mb-4">
                    <input type="text" v-model="searchQuery"
                        class="w-full p-3 border border-gray-300 rounded-md text-base"
                        placeholder="Rechercher des utilisateurs..." @input="searchUsers" />
                </div>
                <div class="max-h-[200px] overflow-y-auto border border-gray-200 rounded mb-4"
                    v-if="searchResults.length > 0">
                    <div v-for="user in searchResults" :key="user.id"
                        class="flex items-center p-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                        @click="selectUser(user)">
                        <div
                            class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center mr-2.5">
                            <Icon name="ph:user" size="1.5em" />
                        </div>
                        <div class="flex flex-col">
                            <span class="font-bold">{{ user.firstName }}</span>
                            <span class="text-xs text-gray-500">{{ user.email }}</span>
                        </div>
                    </div>
                </div>
                <div class="py-4 text-center text-gray-500" v-else-if="searchQuery && !isSearching">
                    Pas d'utilisateurs trouvés
                </div>
                <div class="mt-5" v-if="selectedUsers.length > 0">
                    <h4 class="mt-0 mb-2.5 textColorBlack">Utilisateurs sélectionnés</h4>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="user in selectedUsers" :key="user.id"
                            class="flex items-center textColorBlack bg-[var(--color-primary)] px-2.5 py-1.5 rounded-full text-sm">
                            <span>{{ user.email }}</span>
                            <button @click="removeUser(user)"
                                class="bg-transparent border-0 cursor-pointer ml-1.5 flex items-center justify-center">
                                <Icon name="ph:x-circle" size="1em" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 flex justify-end gap-2.5 border-t border-gray-200">
                <button @click="closeShareModal"
                    class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer">
                    Annuler
                </button>
                <button @click="shareNote" :class="selectedUsers.length === 0 ? 'bg-gray-300' : 'bgColorPrimary'"
                    class="px-4 py-2 border-0 textColorBlack rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    :disabled="selectedUsers.length === 0">
                    Partager
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Note } from "~/types/Note";
import type { User } from "~/types/User";
import useAuthFetch from "~/composables/useAuthFetch";
import { useUserStore } from "~/stores/userStore";
const { $toast } = useNuxtApp();
const emit = defineEmits(["closeMarkdownCenter", "openNote"]);
const closeModal = () => {
    emit("closeMarkdownCenter", true);
};

const notes = ref<Note[]>([]);
const sharedNotes = ref<Note[]>([]);
const chosenNote = ref<Note | undefined>();
const noteToDelete = ref<number | null>(null);
const noteToShare = ref<number | null>(null);
const activeTab = ref<'myNotes' | 'sharedNotes'>('myNotes');
const showShareModal = ref(false);
const searchQuery = ref("");
const searchResults = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const isSearching = ref(false);
const userStore = useUserStore();

const getFormatedDate = (date: string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
        month: "long",
        day: "numeric",
    });
};

const fetchNotes = async () => {
    const res = await useAuthFetch("notes");
    notes.value = res.data.value as Note[];
};

const fetchSharedNotes = async () => {
    const res = await useAuthFetch("notes/shared");
    sharedNotes.value = res.data.value as Note[];
};

const openNote = (chosenNote: Note | undefined) => {
    emit("openNote", chosenNote);
    emit("closeMarkdownCenter");
};

const confirmDelete = (id: number) => {
    noteToDelete.value = id;
};

const cancelDelete = () => {
    noteToDelete.value = null;
};

const deleteNote = async (id: number) => {
    try {
        const response = await useAuthFetch(`note/remove/${id}?${Date.now()}`, {
            method: "DELETE",
        });

        if (response.status.value === "success") {
            $toast.success("Note supprimée avec succès");
        } else {
            $toast.error("Erreur lors de la suppression de la note");
        }
        await fetchNotes(); // Re-fetch only personal notes after deletion
    } catch (e) {
        console.error(e);
    } finally {
        noteToDelete.value = null;
    }
};

const openShareModal = (id: number) => {
    noteToShare.value = id;
    showShareModal.value = true;
    searchQuery.value = "";
    searchResults.value = [];
    selectedUsers.value = [];
};

const closeShareModal = () => {
    showShareModal.value = false;
    noteToShare.value = null;
    searchQuery.value = "";
    searchResults.value = [];
    selectedUsers.value = [];
};

const searchUsers = async () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;

    try {
        const response = await useAuthFetch(`conversation/user/search?${Date.now()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: searchQuery.value,
            }),
        });

        if (response.data.value) {
            searchResults.value = response.data.value as User[];
        }

        const currentUser = userStore.email;

        searchResults.value = searchResults.value.filter(
            (user) => user.email !== currentUser,
        );
    } catch (error: unknown) {
        const err = error as Error;
        $toast.error(err.message || "Erreur lors de la recherche d'utilisateurs");
    } finally {
        isSearching.value = false;
    }
};

const selectUser = (user: User) => {
    if (!selectedUsers.value.some((selected) => selected.id === user.id)) {
        selectedUsers.value.push(user);
    }
    searchQuery.value = "";
    searchResults.value = [];
};

const removeUser = (user: User) => {
    selectedUsers.value = selectedUsers.value.filter(
        (selected) => selected.id !== user.id
    );
};

const shareNote = async () => {
    if (selectedUsers.value.length === 0 || !noteToShare.value) {
        return;
    }

    try {
        const userIds = selectedUsers.value.map((user) => user.id);
        const response = await useAuthFetch(`note/share/${noteToShare.value}?${Date.now()}`, {
            method: "POST",
            body: {
                userIds,
            },
        });

        if (response.status.value === "success") {
            $toast.success("Note partagée avec succès");
            closeShareModal();
        } else {
            $toast.error("Erreur lors du partage de la note");
        }
    } catch (error: unknown) {
        const err = error as Error;
        $toast.error(err.message || "Erreur lors du partage de la note");
    }
};

onMounted(async () => {
    await fetchNotes();
    await fetchSharedNotes(); // Fetch shared notes on mount
    userStore.loadUserFromCookies();
});
</script>

<style scoped>
.disabledButton:disabled {
    background-color: #4a4a4a !important;
    cursor: not-allowed;
}

.trashIcon {
    color: gray;
}

.trashIcon:hover {
    color: var(--color-category-quaternary);
}

.shareIcon {
    color: gray;
}

.shareIcon:hover {
    color: var(--primary-color);
}
</style>
