<template>
  <div class="allItems flex flex-col mx-4">
    <div class="recentFiles h-full w-full">
      <div
        v-if="files.length > 0"
        class="filesContainer overflow-y-auto scroll-behavior: smooth;"
        ref="fileListRef"
      >
        <div v-for="file in files" :key="file.id">
          <div
            @dblclick.prevent="previewFile(file)"
            @contextmenu.prevent="showFileActions(file)"
            :class="
              file.isFolder ? 'bgColorPrimary cursor-pointer' : 'bgColorBlack'
            "
            class="fileItem globalRadius flex items-center p-2 my-2 rounded-lg w-full"
            @click="openFolder(file)"
            :data-file-id="file.id"
          >
            <div class="fileIcon mr-4">
              <Icon
                v-if="file.isFolder"
                name="solar:folder-bold"
                class="flex bgColorBlack"
                size="24"
              />
              <Icon
                v-else-if="isImage(file)"
                name="lets-icons:img-box-fill"
                class="flex bgColorWhite"
                size="24"
              />
              <Icon
                v-else
                name="solar:file-bold"
                class="flex bgColorWhite"
                size="24"
              />
            </div>
            <div class="fileDetails flex-1">
              <div
                v-if="file.originalName !== null"
                :class="file.isFolder ? 'textColorBlack' : 'textColorWhite'"
                class="fileName normalFont"
                :title="file.originalName"
              >
                {{
                  file.originalName.length > 40
                    ? file.originalName.substring(0, 30) + '...'
                    : file.originalName
                }}
              </div>
              <div
                v-else
                :class="file.isFolder ? 'textColorBlack' : 'textColorWhite'"
                class="fileName normalFont"
                :title="file.filename"
              >
                {{
                  file.filename.length > 70
                    ? file.filename.substring(0, 60) + '...'
                    : file.filename
                }}
              </div>
              <div
                :class="file.isFolder ? 'textColorBlack' : 'textColorWhite'"
                class="fileMeta text-gray-400 text-xs"
              >
                <span v-if="file.size !== null">
                  {{ getFileSize(file.size) }}
                </span>
                <span v-else>Dossier</span>
                - ajouté le {{ $formatDate(file.uploadedAt) }}
              </div>
            </div>
            <div class="fileActionWrapper relative flex">
              <div
                v-if="activeMenu === String(file.id)"
                class="actionMenu absolute right-0 w-48 bg-white rounded-md shadow-lg z-50"
                style="top: 0; right: 30px"
              >
                <div class="py-1">
                  <button
                  class="menuItem flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="previewFile(file)"
                  >
                    <Icon name="heroicons:eye" class="mr-2" size="16" />
                    Prévisualiser
                  </button>
                  <button
                    class="menuItem flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="downloadFile(file)"
                  >
                    <Icon
                      name="heroicons:arrow-down-tray"
                      class="mr-2"
                      size="16"
                    />
                    Télécharger
                  </button>
                  <button
                    class="menuItem flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    @click="openDeleteModal(file)"
                  >
                    <Icon name="heroicons:trash" class="mr-2" size="16" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="modal-overlay absolute inset-0 bg-black opacity-50"></div>
      <div
        class="modal-container bg-white w-96 rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <div class="modal-header bg-red-100 px-6 py-4 flex items-center">
          <Icon
            name="heroicons:exclamation-triangle"
            class="text-red-600 mr-2"
            size="24"
          />
          <h3 class="text-lg font-semibold text-red-600">
            Confirmation de suppression
          </h3>
        </div>
        <div class="modal-body px-6 py-4">
          <p class="text-gray-700">
            Êtes-vous sûr de vouloir supprimer
            <span class="font-semibold">
              {{ fileToDelete?.isFolder ? 'le dossier' : 'le fichier' }}
            </span>
            <span class="font-semibold italic">
              {{ fileToDelete?.originalName || fileToDelete?.filename }}
            </span>
            ?
          </p>
          <p class="text-gray-700 mt-2">Cette action est irréversible.</p>
        </div>
        <div class="modal-footer bg-gray-100 px-6 py-3 flex justify-end">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
            @click="cancelDelete"
          >
            Annuler
          </button>
          <button
            class="bgColorCategoryQuaternary removeButton text-white font-semibold py-2 px-4 rounded-lg"
            @click="confirmDelete"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showPreviewModal"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div
      class="modal-overlay absolute inset-0 bg-black opacity-50"
      @click="closePreviewModal"
    ></div>

    <div
      class="modal-container bg-white w-[80%] max-w-4xl rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <div
        class="modal-header bg-gray-100 px-6 py-4 flex justify-between items-center"
      >
        <h3 class="text-lg font-semibold">Aperçu du fichier</h3>
        <button
          @click="closePreviewModal"
          class="text-gray-600 hover:text-gray-900 text-xl"
        >
          &times;
        </button>
      </div>

      <div class="modal-body px-6 py-4 flex justify-center items-center">
        <img
          v-if="filePreviewUrl && previewableFile"
          :src="filePreviewUrl"
          class="max-w-full max-h-[500px] rounded-lg shadow-md"
        />

        <iframe
          v-else-if="
            filePreviewUrl && filePreviewUrl.includes('application/pdf')
          "
          :src="filePreviewUrl"
          width="100%"
          height="500px"
        ></iframe>

        <p v-else class="text-gray-700">
          Aperçu non disponible. Téléchargez le fichier pour l'afficher.
        </p>
      </div>

      <div class="modal-footer bg-gray-100 px-6 py-3 flex justify-end">
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
          @click="closePreviewModal"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAuthFetch from '~/composables/useAuthFetch';
import type { File } from '~/types/File';
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';

const { $toast } = useNuxtApp();

const { files } = defineProps<{
  files: File[];
}>();

const activeMenu = ref<string | null>(null);
const showDeleteModal = ref<boolean>(false);
const fileToDelete = ref<File | null>(null);
const menuPositions = ref<{ [key: string]: number }>({});
const currentPreviewFile = ref<File | null>(null);

const toggleMenu = (fileId: string) => {
  if (activeMenu.value === fileId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = fileId;
    nextTick(() => {
      const element = document.querySelector(`[data-file-id="${fileId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        menuPositions.value[fileId] = rect.top;
      }
    });
  }
};

const showFileActions = (file: File) => {
  toggleMenu(String(file.id));
};

const closeMenuOnOutsideClick = (event: MouseEvent) => {
  if (
    activeMenu.value !== null &&
    !(event.target as Element).closest('.fileActionWrapper')
  ) {
    activeMenu.value = null;
  }
};

const openFolder = (file: File) => {
  if (file.isFolder) {
    emit('openFolder', file);
  }
};

onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick);
});

const downloadFile = async (file: File) => {
  try {
    activeMenu.value = null;
    const response = await useAuthFetch(`files/download/${file.id}`, {
      responseType: 'blob',
    });

    const data = response.data.value;
    if (!data) {
      throw new Error('Failed to download file');
    }

    const url = URL.createObjectURL(data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.originalName || file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

const filePreviewUrl = ref<string | null>(null);
const showPreviewModal = ref<boolean>(false);

const previewableFile = computed(() => {
  if (!currentPreviewFile.value) return false;
  return (
    isImage(currentPreviewFile.value) ||
    currentPreviewFile.value.mimeType === 'application/pdf'
  );
});

const previewFile = async (file: File) => {
  try {
    if (file.isFolder) return;

    currentPreviewFile.value = file;

    if (!isImage(file) && file.mimeType !== 'application/pdf') {
      $toast.info(
        'Ce type de fichier ne peut pas être prévisualisé. Veuillez le télécharger.',
      );
      return;
    }

    activeMenu.value = null;
    const response = await useAuthFetch(`files/preview/${file.id}`, {
      responseType: 'blob',
    });

    const data = response.data.value;
    if (!data) {
      throw new Error('Failed to preview file');
    }

    const blob = new Blob([data as Blob], { type: file.mimeType });
    filePreviewUrl.value = URL.createObjectURL(blob);
    showPreviewModal.value = true;
  } catch (error) {
    console.error('Error previewing file:', error);
    $toast.error(
      'Erreur lors de la prévisualisation. Veuillez télécharger le fichier.',
    );
  }
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
    filePreviewUrl.value = null;
  }
  currentPreviewFile.value = null;
};

const openDeleteModal = (file: File) => {
  fileToDelete.value = file;
  showDeleteModal.value = true;
  activeMenu.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  fileToDelete.value = null;
};

const confirmDelete = async () => {
  if (!fileToDelete.value) return;

  try {
    await useAuthFetch(`files/remove/${fileToDelete.value.id}`, {
      method: 'DELETE',
    });

    if (fileToDelete.value.isFolder) {
      $toast.info('Le dossier a bien été supprimé');
    } else {
      $toast.info('Le fichier a bien été supprimé');
    }

    emit('file-removed', fileToDelete.value.id);
    showDeleteModal.value = false;
    fileToDelete.value = null;
  } catch (error) {
    console.error('Error removing file:', error);
    $toast.error('Erreur lors de la suppression');
  }
};

const emit = defineEmits(['file-removed', 'openFolder']);

const getFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let bytes = size;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
};

const isImage = (file: File) => {
  if (!file) return false;
  const imageExtensions = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml',
    'image/tiff',
    'image/tif',
    'image/heic',
    'image/heif',
  ];
  return imageExtensions.includes(file.mimeType.toLowerCase());
};
</script>

<style scoped>
.filesContainer::-webkit-scrollbar {
  width: 6px;
}

.filesContainer::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.5);
  border-radius: 3px;
}

.bgColorBlack {
  background-color: #403d39;
}

.bgColorOrange {
  background-color: #e07a5f;
}

.bgColorPurple {
  background-color: #6a0572;
}

.fileItem {
  display: flex;
  align-items: center;
  padding: 10px;
  transition: all 0.3s ease;
}

.fileAction {
  background: none;
  border: none;
  cursor: pointer;
}

.menuButton {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.fileActionWrapper {
  position: relative;
}

.actionMenu {
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.menuItem {
  transition: background-color 0.2s ease;
  text-align: left;
}

.modal-overlay {
  transition: opacity 0.3s ease;
}

.modal-container {
  transition: all 0.3s ease;
}

.removeButton:hover {
  background-color: #e36976 !important;
}

.modal-overlay {
  transition: opacity 0.3s ease;
}

.modal-container {
  transition: all 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
