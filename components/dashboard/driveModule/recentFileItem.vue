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
            :class="file.isFolder ? 'bgColorPrimary' : 'bgColorBlack'"
            class="fileItem globalRadius flex items-center p-2 my-2 rounded-lg w-full"
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
                name="solar:swimming-bold"
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
            <div class="fileActionWrapper relative">
              <button
                class="fileAction text-white"
                @click="toggleMenu(file.id)"
              >
                <Icon
                  name="bi:three-dots-vertical"
                  class="flex text-white"
                  size="24"
                />
              </button>
              <div 
                v-if="activeMenu === file.id" 
                class="actionMenu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
              >
                <div class="py-1">
                  <button 
                    class="menuItem flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="downloadFile(file)"
                  >
                    <Icon name="heroicons:arrow-down-tray" class="mr-2" size="16" />
                    Télécharger
                  </button>
                  <button 
                    class="menuItem flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    @click="removeFile(file)"
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
      <div v-else>
        <div class="noFiles text-center py-8">
          <Icon name="solar:file-bold" size="48" />
          <div class="text-lg font-semibold">Aucun fichier récent</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAuthFetch from '~/composables/useAuthFetch';
import type { File } from '~/types/File';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { ref, onMounted, onUnmounted } from 'vue';

const { $toast } = useNuxtApp();

const { files } = defineProps<{
  files: File[];
}>();

const fileListRef = useAutoAnimate({
  duration: 300,
  easing: 'ease-in-out',
});

const activeMenu = ref<string | null>(null);

const toggleMenu = (fileId: string) => {
  if (activeMenu.value === fileId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = fileId;
  }
};

// Close menu when clicking outside
const closeMenuOnOutsideClick = (event: MouseEvent) => {
  if (activeMenu.value !== null && !(event.target as Element).closest('.fileActionWrapper')) {
    activeMenu.value = null;
  }
};

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick);
});

// Remove event listener when component is unmounted
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

    const url = URL.createObjectURL(data);
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

const removeFile = async (file: File) => {
  try {
    activeMenu.value = null;
    await useAuthFetch(`files/remove/${file.id}`, {
      method: 'DELETE'
    });
    if (file.isFolder) {
      $toast.info('Le dossier a bien été supprimé');
    } else {
      $toast.info('Le fichier a bien été supprimé');
    }

    emit('file-removed', file.id);
  } catch (error) {
    console.error('Error removing file:', error);
  }
};

const emit = defineEmits(['file-removed']);

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
</style>
