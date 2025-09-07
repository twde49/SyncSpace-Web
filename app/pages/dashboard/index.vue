<template>
    <div class="max-size">
        <MessageModule />
        <NotificationDrawer />
        <ProfileModule />
        <MusicPlayerModule />
        <div class="debug-panel"
            style="position: fixed; bottom: 10px; left: 10px; z-index: 9999; background: rgba(0,0,0,0.8); color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; display: none;">
            Open console for debugging (F12)
        </div>

        <div class="module-slider">
            <Swiper :slides-per-view="1" :centered-slides="true" direction="vertical" loop grabCursor
                @swiper="onSwiperInitialized">
                <SwiperSlide>
                    <div data-swapy-slot="topLeft" class="mobile-module">
                        <div data-swapy-item="topLeft">
                            <div class="module topLeftModule">
                                <CalendarModule @contextmenu.prevent="showContextMenu" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div data-swapy-slot="topRight" class="mobile-module">
                        <div data-swapy-item="topRight">
                            <div class="module topRightModule">
                                <EditorMarkdown :note-id="noteId" :title-note="noteTitle" :content-note="noteContent"
                                    @open-markdown-center="handleMarkdownCenterOpening" />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div data-swapy-slot="bottomLeft" class="mobile-module">
                        <div data-swapy-item="bottomLeft">
                            <div class="module bottomLeftModule">
                                <PasswordManager @contextmenu.prevent="showContextMenu"
                                    @open-password-center="handlePasswordCenterOpening"
                                    :refresh-counter='refreshCounter' />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div data-swapy-slot="bottomRight" class="mobile-module">
                        <div data-swapy-item="bottomRight">
                            <div class="module bottomRightModule">
                                <DriveModule />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>

        <div class="fourZoneContainer" ref="moduleZone">
            <div class="fourZone">
                <div data-swapy-slot="topLeft" class="centered">
                    <div data-swapy-item="topLeft">
                        <div class="module topLeftModule">
                            <CalendarModule @contextmenu.prevent="showContextMenu" />
                        </div>
                    </div>
                </div>
                <div data-swapy-slot="topRight" class="centered" @contextmenu.prevent="showContextMenu">
                    <div data-swapy-item="topRight">
                        <div class="module topRightModule">
                            <EditorMarkdown :note-id="noteId" :title-note="noteTitle" :content-note="noteContent"
                                @open-markdown-center="handleMarkdownCenterOpening" />
                        </div>
                    </div>
                </div>
                <div data-swapy-slot="bottomLeft" class="centered" @contextmenu.prevent="showContextMenu">
                    <div data-swapy-item="bottomLeft">
                        <div class="module bottomLeftModule">
                            <PasswordManager @contextmenu.prevent="showContextMenu"
                                @open-password-center="handlePasswordCenterOpening" :refresh-counter='refreshCounter' />
                        </div>
                    </div>
                </div>
                <div data-swapy-slot="bottomRight" class="centered">
                    <div data-swapy-item="bottomRight">
                        <div class="module bottomRightModule">
                            <DriveModule />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <MarkdownCenter @open-note="handleOpeningNote" @close-markdown-center="handleMarkdownCenterClosing"
        v-if="isMarkdownCenterOpen" />

    <PasswordCenter @close-password-center="handlePasswordCenterClosing" v-if="isPasswordCenterOpen"
        @refresh-counter="handleRefreshCounter" />

    <div v-if="contextMenu.show" class="custom-context-menu"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
        <div class="context-menu-item" @click="''">Refresh</div>
        <div class="context-menu-item" @click="''">Edit</div>
        <div class="context-menu-item" @click="''">Swap Modules</div>
        <div class="context-menu-item" @click="handleSettings">Settings</div>
    </div>
</template>

<script setup lang="ts">
import type { Note } from '~/types/Note';
import type { Swapy } from 'swapy';
import { createSwapy } from 'swapy';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import MessageModule from '~/components/dashboard/messageModule/messageModule.vue';
import ProfileModule from '~/components/dashboard/profileModule.vue';
import MusicPlayerModule from '~/components/dashboard/musicModule/MusicPlayerModule.vue';
import EditorMarkdown from '~/components/dashboard/markdownModule/editorMarkdown.vue';
import MarkdownCenter from '~/components/dashboard/markdownModule/markdownCenter.vue';
import DriveModule from '~/components/dashboard/driveModule/driveModule.vue';
import PasswordManager from '~/components/dashboard/passwordManagerModule/passwordManager.vue';
import PasswordCenter from '~/components/dashboard/passwordManagerModule/passwordCenter.vue';
import CalendarModule from '~/components/dashboard/calendarModule/calendarModule.vue';
import NotificationDrawer from '~/components/dashboard/notificationDrawer/NotificationDrawer.vue';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import * as moduleUtils from '~/utils/modulesUtils';
import type { ModuleData } from '~/types/ModuleData';

import 'swiper/css';
const { $toast } = useNuxtApp();
let noteId: number;
let noteTitle = '';
let noteContent = '';
const refreshCounter = ref(false);

const router = useRouter();
const layoutOrder = ref<ModuleData[]>([]);
const swapy = ref<Swapy | null>(null);
const moduleZone = ref<HTMLElement | null>(null);

const isMarkdownCenterOpen = ref(false);
const isPasswordCenterOpen = ref(false);

const contextMenu = ref({
    show: false,
    x: 0,
    y: 0,
    targetModule: '',
});

const handleRefreshCounter = (value: boolean) => {
    refreshCounter.value = value;
};

const handleMarkdownCenterOpening = (status: boolean) => {
    isMarkdownCenterOpen.value = status;
};

const handleMarkdownCenterClosing = () => {
    isMarkdownCenterOpen.value = false;
};

const handlePasswordCenterOpening = (status: boolean) => {
    isPasswordCenterOpen.value = status;
};

const handlePasswordCenterClosing = () => {
    isPasswordCenterOpen.value = false;
};

const handleOpeningNote = (chosenNote: Note) => {
    noteId = chosenNote.id;
    noteTitle = chosenNote.title ?? '';
    noteContent = chosenNote.content ?? '';
};

const showContextMenu = (event: MouseEvent) => {
    contextMenu.value.show = true;
    contextMenu.value.x = event.clientX;
    contextMenu.value.y = event.clientY;

    const target = event.target as HTMLElement;
    const moduleElement = target.closest('.module');
    if (moduleElement) {
        if (moduleElement.classList.contains('topLeftModule')) {
            contextMenu.value.targetModule = 'topLeft';
        } else if (moduleElement.classList.contains('topRightModule')) {
            contextMenu.value.targetModule = 'topRight';
        } else if (moduleElement.classList.contains('bottomLeftModule')) {
            contextMenu.value.targetModule = 'bottomLeft';
        } else if (moduleElement.classList.contains('bottomRightModule')) {
            contextMenu.value.targetModule = 'bottomRight';
        }
    }
};

const handleSettings = () => {
    router.push('/settings');
    contextMenu.value.show = false;
};

onMounted(() => {
    if (moduleZone.value) {
        swapy.value = createSwapy(moduleZone.value, {
            dragOnHold: true,
        });

        swapy.value.onSwapStart(() => {
            $toast.info('Module peut être déplacé');
        });
    }

    document.addEventListener('click', () => {
        contextMenu.value.show = false;
    });

    layoutOrder.value = moduleUtils.getModuleFromUserStorePreference();
});


onUnmounted(() => {
    swapy.value?.destroy();
    document.removeEventListener('click', () => {
        contextMenu.value.show = false;
    });
});

const swiperInstance = ref(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSwiperInitialized = (swiper: any) => {
    swiperInstance.value = swiper;
    nextTick(() => swiper.update());
};
</script>

<style scoped>
.fourZoneContainer {
    margin-top: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    width: 80vw;
    margin-left: auto;
    margin-right: auto;
    z-index: 10;
    display: none;
}

.module-slider {
    width: 100%;
    padding: 20px 0;
    margin-top: 15vh;
    height: 70vh;
}


.mobile-module {
    display: flex;
    justify-content: center;
    align-items: center;
}

.module {
    width: 95vw;
    height: 70vh;
    background-color: var(--color-white);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.fourZone {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 30px;
}

.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

.custom-context-menu {
    position: fixed;
    z-index: 1000;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 8px 0;
    min-width: 160px;
}

.context-menu-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.context-menu-item:hover {
    background-color: #f5f5f5;
}

@media (min-width: 768px) {
    .module-slider {
        display: none;
    }

    .fourZoneContainer {
        display: flex;
    }

    .module {
        width: 40vw;
        height: 32vh;
    }
}
</style>
