<template>
  <div 
    class="flex flex-col h-full"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    @drop.prevent="handleFileDrop"
  >
    <div
      class="tabPart h-14 flex justify-center items-center mx-4 flex-shrink-0"
    >
      <div class="max-w-[800px] w-full overflow-x-auto scrollbar-hide">
        <ul
          class="flex text-sm font-medium text-center text-gray-500 dark:text-gray-400 whitespace-nowrap w-full gap-2 p-1"
        >
          <li class="flex-1">
            <a
              href="#"
              @click.prevent="changeTab('recent')"
              :class="[
                'inline-block w-full px-3 py-2 globalRadius recentTab',
                activeTab === 'recent'
                  ? 'text-white bgColorCategoryPrimary'
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
                'inline-block w-full px-3 py-2 globalRadius documentTab',
                activeTab === 'documents'
                  ? 'text-white bgColorCategorySecondary'
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
                'inline-block w-full px-3 py-2 globalRadius pictureTab',
                activeTab === 'photos'
                  ? 'text-white bgColorCategoryTritary'
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
                'inline-block w-full px-3 py-2 globalRadius folderTab',
                activeTab === 'folders'
                  ? 'text-white bgColorCategoryQuaternary'
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
                'inline-block w-full px-3 py-2 globalRadius allTab',
                activeTab === 'all' ? 'text-white bgColorCategoryQuinary' : '',
              ]"
            >
              Tout
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div 
      class="filePart mb-1 flex-grow overflow-y-auto relative" 
      :class="{ 'drop-active': dragover }"
    >
      <div v-if="dragover || !getFilesByTab || getFilesByTab.length === 0" class="drop-overlay absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
        <div class="text-white text-center p-4">
          <div class="text-3xl mb-2">
            <i class="fas fa-upload"></i>
          </div>
          <Icon name="solar:file-bold" size="48" />
          <p class="text-xl font-medium">Aucun fichier disponible</p>
          <p class="text-xl font-medium">Glissez-déposez vos fichiers ici</p>
          <p class="text-sm opacity-80 mt-1">Le téléchargement s'effectuera dans le répertoire courant</p>
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

const changeTab = async (tab: string) => {
  isLoading.value = true;
  activeTab.value = tab;

  await nextTick();
  isLoading.value = false;
};

const fetchFiles = async () => {
  const recentResponse = await useAuthFetch('files/recent');
  recentFiles.value = recentResponse.data.value as File[];

  const picturesResponse = await useAuthFetch('files/images');
  picturesFiles.value = picturesResponse.data.value as File[];

  const documentsResponse = await useAuthFetch('files/documents');
  documentsFiles.value = documentsResponse.data.value as File[];

  const foldersResponse = await useAuthFetch('files/folders');
  foldersFiles.value = foldersResponse.data.value as File[];

  const allResponse = await useAuthFetch('files/all');
  allFiles.value = allResponse.data.value as File[];
  
  if (currentFolder.value) {
    const folderResponse = await useAuthFetch(`files/folder/${currentFolder.value.id}`);
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
      return Array.isArray(openedFolderFiles.value) ? openedFolderFiles.value : [];
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
      if (!changed){
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
  console.log(response.data.value as File);
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
        body: formData
      }
    );

    if (response.error.value) {
      console.error('Upload error:', response.error.value);
    } else {
      await fetchFiles();
    }
  } catch (error) {
    console.error('Error during file upload:', error);
  } finally {
    isLoading.value = false;
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

onMounted(async () => {
  await nextTick(async () => {
    await fetchFiles();
  });
});

watch(() => activeTab.value, (newTab) => {
  if (newTab !== 'openedFolderFiles') {
    currentFolder.value = null;
  }
});

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
</style>
