<template>
    <div id="select-modal" tabindex="-1" aria-hidden="true"
        class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
        <div class="relative p-4 w-full max-w-md max-h-[90%]">
            <div class="relative bgColorWhite rounded-lg shadow-sm dark:bg-gray-700">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 class="text-lg font-semibold textColorBlack dark:textColorWhite">
                        Ouvrir note
                    </h3>
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
                                @change="chosenNote = {} as Note" />
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
                        <li v-for="note in notes" :key="note.id" v-if="notes.length !== 0">
                            <input type="radio" :id="String(note.id)" name="job" :value="note.id" class="hidden peer"
                                required @change="chosenNote = note" />
                            <label :for="String(note.id)"
                                class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500">
                                <div class="block">
                                    <div v-if="noteToDelete !== note.id" class="w-full text-lg font-semibold">
                                        {{ note.title }}
                                    </div>
                                    <div v-if="noteToDelete !== note.id"
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
                                <Icon v-if="noteToDelete !== note.id" name="ph:trash-fill" size="21px" class="trashIcon"
                                    @click.stop="confirmDelete(note.id)" />
                            </label>
                        </li>
                        <li v-else>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <span class="ml-2">Aucune note disponible</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <button @click="openNote(chosenNote)" :disabled="!chosenNote"
                        class="textColorWhite disabledButton disabled:bg-gray-400 disabled:!important inline-flex w-full justify-center bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark">
                        Ouvrir cette note
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Note } from "~/types/Note";
import useAuthFetch from "~/composables/useAuthFetch";
const { $toast } = useNuxtApp();
const emit = defineEmits(["closeMarkdownCenter", "openNote"]);
const closeModal = () => {
    emit("closeMarkdownCenter", true);
};

const notes = ref<Note[]>([]);
const chosenNote = ref<Note | undefined>();
const noteToDelete = ref<number | null>(null);

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
        await fetchNotes();
    } catch (e) {
        console.error(e);
    } finally {
        noteToDelete.value = null;
    }
};

onMounted(async () => {
    await fetchNotes();
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
</style>
