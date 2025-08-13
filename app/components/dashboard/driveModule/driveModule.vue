<template>
    <div class="flex flex-col h-full" @dragover.prevent="dragover = true" @dragleave.prevent="dragover = false"
        @drop.prevent="handleFileDrop" @dblclick="fileInput?.click()">
        <div class="h-14 flex justify-center items-center mx-4 flex-shrink-0">
            <div class="max-w-[800px] w-full overflow-x-auto scrollbar-hide">
                <ul
                    class="flex text-sm font-medium text-center textColorBlack dark:text-gray-400 whitespace-nowrap w-full gap-2 p-1">
                    <li class="flex-1">
                        <a href="#" @click.prevent="changeTab('recent')" :class="[
                            'inline-block w-full px-3 py-2 rounded recentTab',
                            activeTab === 'recent'
                                ? 'textColorWhiteFull bgColorCategoryPrimary'
                                : '',
                        ]">
                            Récent
                        </a>
                    </li>
                    <li class="flex-1">
                        <a href="#" @click.prevent="changeTab('documents')" :class="[
                            'inline-block w-full px-3 py-2 rounded documentTab',
                            activeTab === 'documents'
                                ? 'textColorWhiteFull bgColorCategorySecondary'
                                : '',
                        ]">
                            Documents
                        </a>
                    </li>
                    <li class="flex-1">
                        <a href="#" @click.prevent="changeTab('photos')" :class="[
                            'inline-block w-full px-3 py-2 rounded pictureTab',
                            activeTab === 'photos'
                                ? 'textColorWhiteFull bgColorCategoryTritary'
                                : '',
                        ]">
                            Photos
                        </a>
                    </li>
                    <li class="flex-1">
                        <a href="#" @click.prevent="changeTab('folders')" :class="[
                            'inline-block w-full px-3 py-2 rounded folderTab',
                            activeTab === 'folders'
                                ? 'textColorWhiteFull bgColorCategoryQuaternary'
                                : '',
                        ]">
                            Dossiers
                        </a>
                    </li>
                    <li class="flex-1">
                        <a href="#" @click.prevent="changeTab('all')" :class="[
                            'inline-block w-full px-3 py-2 rounded allTab',
                            activeTab === 'all' ? 'textColorWhiteFull bgColorCategoryQuinary' : '',
                        ]">
                            Tout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mb-1 flex-grow overflow-y-auto relative" :class="{ 'drop-active': dragover }">
            <div v-if="dragover || !getFilesByTab || getFilesByTab.length === 0"
                class="absolute inset-0 bgColorBlack bg-opacity-70 flex items-center justify-center z999 globalRadius cursor-pointer h-full"
                @click="fileInput?.click()">
                <div class="textColorWhite text-center p-4">
                    <div class="megaFont mb-2">
                        <i class="fas fa-upload"></i>
                    </div>
                    <Icon name="ph:file-bold" size="48" />
                    <p class="largeFont font-medium">Aucun fichier disponible</p>
                    <p class="largeFont font-medium">Glissez-déposez vos fichiers ici</p>
                    <p class="normalFont font-medium mt-2">ou cliquez pour sélectionner</p>
                    <p class="miniFont opacity-80 mt-1">
                        Le téléchargement s'effectuera dans le répertoire courant
                    </p>
                </div>
            </div>
            <Transition v-else name="fade" mode="out-in">
                <RecentFileItem v-if="getFilesByTab && getFilesByTab.length > 0" :files="getFilesByTab"
                    @file-removed="handleFileRemove" @open-folder="handleFolderOpening" :current-tab="activeTab"
                    :current-folder="currentFolder" @fetch-files="fetchFiles()" />
            </Transition>

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
            `files/folder/${currentFolder.value.id}?${Date.now()}`,
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
    const response = await useAuthFetch(`files/folder/${folder.id}?${Date.now()}`);
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
                ? `files/upload/${currentFolder.value.id}?${Date.now()}`
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
