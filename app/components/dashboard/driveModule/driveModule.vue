<template>
  <div
    class="flex flex-col h-full"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    @drop.prevent="handleFileDrop"
    @dblclick="fileInput?.click()"
    @contextmenu.prevent="handleContextMenu($event)"
  >
    <div
      class="h-14 flex justify-center items-center mx-4 flex-shrink-0"
    >
      <div class="max-w-[800px] w-full overflow-x-auto scrollbar-hide">
        <ul
          class="flex text-sm font-medium text-center textColorBlack dark:text-gray-400 whitespace-nowrap w-full gap-2 p-1"
        >
          <li class="flex-1">
            <a
              href="#"
              @click.prevent="changeTab('recent')"
              :class="[
                'inline-block w-full px-3 py-2 rounded recentTab',
                activeTab === 'recent'
                  ? 'textColorWhiteFull bgColorCategoryPrimary'
                  : '',
              ]"
            >
              Récent
            </a>
          </li>
          <li class="flex-1">
            <a
              href="#"
              @click.prevent="changeTab('documents')"
              :class="[
                'inline-block w-full px-3 py-2 rounded documentTab',
                activeTab === 'documents'
                  ? 'textColorWhiteFull bgColorCategorySecondary'
                  : '',
              ]"
            >
              Documents
            </a>
          </li>
          <li class="flex-1">
            <a
              href="#"
              @click.prevent="changeTab('photos')"
              :class="[
                'inline-block w-full px-3 py-2 rounded pictureTab',
                activeTab === 'photos'
                  ? 'textColorWhiteFull bgColorCategoryTritary'
                  : '',
              ]"
            >
              Photos
            </a>
          </li>
          <li class="flex-1">
            <a
              href="#"
              @click.prevent="changeTab('folders')"
              :class="[
                'inline-block w-full px-3 py-2 rounded folderTab',
                activeTab === 'folders'
                  ? 'textColorWhiteFull bgColorCategoryQuaternary'
                  : '',
              ]"
            >
              Dossiers
            </a>
          </li>
          <li class="flex-1">
            <a
              href="#"
              @click.prevent="changeTab('all')"
              :class="[
                'inline-block w-full px-3 py-2 rounded allTab',
                activeTab === 'all' ? 'textColorWhiteFull bgColorCategoryQuinary' : '',
              ]"
            >
              Tout
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="mb-1 flex-grow overflow-y-auto relative"
      :class="{ 'drop-active': dragover }"
    >
        <div
          v-if="dragover || !getFilesByTab || getFilesByTab.length === 0"
          class="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-lg cursor-pointer"
          @click="fileInput?.click()"
        >
          <div class="textColorWhite text-center p-4">
            <div class="text-3xl mb-2">
              <i class="fas fa-upload"></i>
            </div>
            <Icon name="solar:file-bold" size="48" />
            <p class="text-xl font-medium">Aucun fichier disponible</p>
            <p class="text-xl font-medium">Glissez-déposez vos fichiers ici</p>
            <p class="text-sm font-medium mt-2">ou cliquez pour sélectionner</p>
            <p class="text-sm opacity-80 mt-1">
              Le téléchargement s'effectuera dans le répertoire courant
            </p>
          </div>
        </div>
      <Transition v-else name="fade" mode="out-in">
        <RecentFileItem
          v-if="getFilesByTab && getFilesByTab.length > 0"
          :files="getFilesByTab"
          @file-removed="handleFileRemove"
          @open-folder="handleFolderOpening"
        />
      </Transition>

      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        class="hidden"
        accept="*/*"
      />
    </div>

    <div
      v-if="showMenu"
      class="absolute z-50 bg-white border rounded shadow-md"
      :style="{ left: menuX + 'px', top: menuY + 'px' }"
    >
      <ul class="py-2">
        <li
          @click="openCreateFolderModal"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Nouveau dossier
        </li>
      </ul>

      <ul class="py-2"
      v-if="currentFolder !== null"
      >
        <li
          @click="back"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
            Retour arrière
        </li>
      </ul>
    </div>

    <div
      v-if="showCreateFolderModal"
      class="fixed inset-0 flex items-center justify-center z-40"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative p-4 w-full max-w-md max-h-[90%] z-50">
        <div
          class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700"
        >
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:textColorWhite">
              Nouveau dossier
            </h3>
            <button
              @click="cancelCreateFolder"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:textColorWhite"
            >
              <svg
                class="w-3 h-3"
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
          <div class="p-4 md:p-5">
            <div class="mb-4">
              <label
                for="folderName"
                class="block mb-2 text-sm font-medium text-gray-900 dark:textColorWhite"
              >
                Nom du dossier
              </label>
              <input
                type="text"
                id="folderName"
                v-model="newFolderName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:textColorWhite dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Nom du dossier"
                required
              />
            </div>
            <button
              :disabled="newFolderName === ''"
              @click="confirmCreateFolder"
              class="textColorWhite disabled:bg-gray-400 disabled:!important inline-flex w-full justify-center bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import useAuthFetch from '~/composables/useAuthFetch';
import type { File } from '~/types/File';
import RecentFileItem from './recentFileItem.vue';

const recentFiles = ref<File[]>([]);
const picturesFiles = ref<File[]>([]);
const documentsFiles = ref<File[]>([]);
const foldersFiles = ref<File[]>([]);
const allFiles = ref<File[]>([]);
const openedFolderFiles = ref<File[]>([]);

const activeTab = ref('recent');
const isLoading = ref(false);
const dragover = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const currentFolder = ref<File | null>(null);

const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);

const showCreateFolderModal = ref(false);
const newFolderName = ref<string>('');

const changeTab = async (tab: string) => {
  isLoading.value = true;
  activeTab.value = tab;

  await nextTick();
  isLoading.value = false;
};

const fetchFiles = async () => {
  const recentResponse = await useAuthFetch(`files/recent?${Date.now()}`);
  recentFiles.value = recentResponse.data.value as File[];

  const picturesResponse = await useAuthFetch(`files/images?${Date.now()}`);
  picturesFiles.value = picturesResponse.data.value as File[];

  const documentsResponse = await useAuthFetch(`files/documents?${Date.now()}`);
  documentsFiles.value = documentsResponse.data.value as File[];

  const foldersResponse = await useAuthFetch(`files/folders?${Date.now()}`);
  foldersFiles.value = foldersResponse.data.value as File[];

  const allResponse = await useAuthFetch(`files/all?${Date.now()}`);
  allFiles.value = allResponse.data.value as File[];

  if (currentFolder.value) {
    const folderResponse = await useAuthFetch(
      `files/folder/${currentFolder.value.id}`,
    );
    openedFolderFiles.value = folderResponse.data.value as File[];
  }
};

const getFilesByTab = computed(() => {
  switch (activeTab.value) {
    case 'recent':
      return Array.isArray(recentFiles.value) ? recentFiles.value : [];
    case 'photos':
      return Array.isArray(picturesFiles.value) ? picturesFiles.value : [];
    case 'documents':
      return Array.isArray(documentsFiles.value) ? documentsFiles.value : [];
    case 'folders':
      return Array.isArray(foldersFiles.value) ? foldersFiles.value : [];
    case 'all':
      return Array.isArray(allFiles.value) ? allFiles.value : [];
    case 'openedFolderFiles':
      return Array.isArray(openedFolderFiles.value)
        ? openedFolderFiles.value
        : [];
    default:
      return [];
  }
});

const handleFileRemove = (fileId: string) => {
  const fileArrays = [
    recentFiles,
    picturesFiles,
    documentsFiles,
    foldersFiles,
    allFiles,
  ];
  let changed = false;
  for (const fileArray of fileArrays) {
    const index = fileArray.value.findIndex(file => file.id === Number(fileId));
    if (index !== -1) {
      if (!changed) {
        changed = true;
      }
      fileArray.value.splice(index, 1);
    }
  }
  if (changed) {
    fetchFiles();
  }
};

const handleFolderOpening = async (folder: File) => {
  const response = await useAuthFetch(`files/folder/${folder.id}`);
  currentFolder.value = folder;
  openedFolderFiles.value = response.data.value as File[];
  activeTab.value = 'openedFolderFiles';
};

const uploadFile = async (file: globalThis.File) => {
  if (!file) return;

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await useAuthFetch(
      currentFolder.value !== null
        ? `files/upload/${currentFolder.value.id}`
        : 'files/upload',
      {
        method: 'POST',
        body: formData,
      },
    );

    if (response.error.value) {
      console.error('Upload error:', response.error.value);
    }    
  } catch (error) {
    console.error('Error during file upload:', error);
  } finally {
    isLoading.value = false;
    await fetchFiles();
  }
};

const handleFileDrop = (event: DragEvent) => {
  dragover.value = false;
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    uploadFile(droppedFiles[0]);
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    uploadFile(input.files[0]);
    input.value = '';
  }
};

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  if ((event.target as Element).closest('.recentFiles')) {
    return;
  }
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  showMenu.value = true;

  document.addEventListener('click', closeMenu);
};

const closeMenu = () => {
  showMenu.value = false;
  document.removeEventListener('click', closeMenu);
};

const openCreateFolderModal = () => {
  showMenu.value = false;
  showCreateFolderModal.value = true;
};

const confirmCreateFolder = async () => {
  try {
    const body: { folderName: string; parentId?: number } = {
      folderName: newFolderName.value,
    };

    if (currentFolder.value) {
      body.parentId = currentFolder.value.id;
    }

    const response = await useAuthFetch('files/folder/create',
      {
        method: 'POST',
        body: body,
      },
    );

    if (response.error.value) {
      console.error('Error creating folder:', response.error.value);
    } else {
      await fetchFiles();
    }
  } catch (error) {
    console.error('Error creating folder:', error);
  } finally {
    showCreateFolderModal.value = false;
    newFolderName.value = '';
  }
};

const cancelCreateFolder = () => {
  showCreateFolderModal.value = false;
  newFolderName.value = '';
};

const back = () => {
    if (currentFolder.value) {
        currentFolder.value = null;
        activeTab.value = 'folders';
        fetchFiles();
    }
};

onMounted(async () => {
  await nextTick(async () => {
    await fetchFiles();
  });
});

watch(
  () => activeTab.value,
  newTab => {
    if (newTab !== 'openedFolderFiles') {
      currentFolder.value = null;
    }
  },
);
</script>

<style scoped>
.allTab {
  border: 1.5px solid var(--color-category-quinary);
}

.documentTab {
  border: 1.5px solid var(--color-category-secondary);
}

.pictureTab {
  border: 1.5px solid var(--color-category-tritary);
}

.folderTab {
  border: 1.5px solid var(--color-category-quaternary);
}

.recentTab {
  border: 1.5px solid var(--color-category-primary);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-active {
  border: 2px dashed #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.drop-overlay {
  transition: all 0.3s ease;
  border: 3px dashed var(--color-primary);
}
.context-menu {
  position: absolute;
  z-index: 50;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #f3f4f6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-container {
  position: relative;
  width: auto;
  max-width: 448px;
  max-height: 90vh;
}

.bgColorWhite {
  background-color: white;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-header button {
  background-color: transparent;
  border: none;
  color: #717171;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.modal-header button:hover {
  background-color: #f3f4f6;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(90vh - 10rem);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.modal-footer button {
  border-radius: 0.375rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-weight: 500;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.modal-footer button:first-child {
  margin-right: 0.75rem;
  background-color: #f3f4f6;
  color: #4b5563;
}

.modal-footer button:first-child:hover {
  background-color: #e5e7eb;
}

.modal-footer button:last-child {
  background-color: #6b7280;
  color: white;
}

.modal-footer button:last-child:hover {
  background-color: #4b5563;
}

.disabledButton:disabled {
  background-color: #9ca3af !important;
  cursor: not-allowed;
}
</style>
