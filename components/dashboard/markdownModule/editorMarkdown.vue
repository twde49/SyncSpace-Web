<template>
  <MdEditor
    :toolbarsExclude="excluded"
    :placeholder="placeholder"
    language="fr-FR"
    :theme="$colorMode.preference === 'light' ? 'dark' : 'light'"
    class="markdownEditor"
    v-model="content"
    :preview="false"
    :footers="footer"
    @onSave="handleSave"
    contentClass="cm-content"
  />
  <div class="showModal flex justify-center items-center">
    <button @click="openMarkdownCenter" class="seeAllNotes bgColorPrimary">
      Voir toutes les notes
    </button>
  </div>

  <div
    v-if="showModal"
    id="save-markdown-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div
      class="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800"
      @mousedown.stop
    >
      <div
        class="flex items-center justify-between border-b pb-4 dark:border-gray-600"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Sauvegarder fichier markdown?
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 p-2 rounded-full dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <form @submit.prevent="saveTitle" class="space-y-4 mt-4">
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Nom du fichier
          </label>
          <input
            type="text"
            id="title"
            v-model="title"
            required
            class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { type Footers, MdEditor, type ToolbarNames } from "md-editor-v3";
import useAuthFetch from "~/composables/useAuthFetch";
import "md-editor-v3/lib/style.css";

const { noteId, titleNote, contentNote } = defineProps<{
	noteId: number;
	titleNote: string;
	contentNote: string;
}>();

const { $colorMode } = useNuxtApp();

const placeholders = [
	"Écrivez votre première idée brillante ici...",
	"Une page blanche, infinie en possibilités...",
	"Quel est votre message au monde aujourd'hui ?",
	"Un titre, un mot, une phrase... lancez-vous !",
	"Tout commence par un mot. Qu'allez-vous écrire ?",
	"Commencez à écrire, vos pensées prendront forme.",
	"Laissez vos idées couler librement ici...",
	"Que voulez-vous raconter aujourd'hui ?",
	"Ajoutez une touche de créativité...",
	"Il n'y a pas de mauvaises idées, seulement des débuts prometteurs.",
];

const footer: Footers[] = [];
const excluded: ToolbarNames[] = ["github", "preview", "sub", "sup", "catalog"];
const content = ref<string>(contentNote);
const showModal = ref(false);
const title = ref(titleNote);
const { $toast } = useNuxtApp();
const emit = defineEmits(["openMarkdownCenter"]);

const getRandomPlaceholder = () => {
	const randomIndex = Math.floor(Math.random() * placeholders.length);
	return placeholders[randomIndex];
};

const placeholder = ref(getRandomPlaceholder());

const openMarkdownCenter = () => {
	emit("openMarkdownCenter", true);
};

const handleSave = () => {
	if (!showModal.value) {
		showModal.value = true;
	}
};

const closeModal = () => {
	showModal.value = false;
};

const saveTitle = async () => {
	if (noteId) {
		return await updateExistingNote();
	}
	return await addNewNote();
};

const addNewNote = async () => {
	try {
		const response = await useAuthFetch("note/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: title.value,
				content: content.value,
			}),
		});

		if (response.status.value === "success") {
			$toast.success("Votre note a bien été sauvegardée");
			title.value = "";
			content.value = "";
			placeholder.value = getRandomPlaceholder();
			closeModal();
		} else {
			$toast.error("Quelque chose n'a pas marché");
		}
	} catch (error: unknown) {
		$toast.error((error as Error).message);
	}
};

const updateExistingNote = async () => {
	try {
		const response = await useAuthFetch(`note/save/${noteId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: title.value,
				content: content.value,
			}),
		});

		if (response.status.value === "success") {
			$toast.success("Votre note a bien été sauvegardée");
			title.value = "";
			content.value = "";
			placeholder.value = getRandomPlaceholder();
			closeModal();
		} else {
			$toast.error("Quelque chose n'a pas marché");
		}
	} catch (error: unknown) {
		$toast.error((error as Error).message);
	}
};

watch(
	() => titleNote,
	(newTitle) => {
		title.value = newTitle;
	},
);

watch(
	() => contentNote,
	(newContent) => {
		content.value = newContent;
	},
);
</script>

<style scoped>
.markdownEditor {
  width: 100%;
  height: 75%;
  border-radius: 5px;
  background-color: var(--color-white);
}

.showModal {
  width: 100%;
  height: 25%;
  padding: 5px;
  background-color: var(--color-black);
  border: 2px solid var(--color-white);
  border-radius: 5px;
}

.seeAllNotes {
  width: 95%;
  height: 80%;
  color: var(--color-white);
  border-radius: 5px;
}
</style>
