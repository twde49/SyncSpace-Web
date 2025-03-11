<template>
  <div class="max-size">
    <MessageModule />
    <NotificationDrawer />
    <ProfileModule />
    <MusicPlayerModule />
    <div class="fourZoneContainer">
      <div class="fourZone" ref="moduleZone">
        <div data-swapy-slot="topLeft" class="centered" @contextmenu.prevent="showContextMenu">
          <div data-swapy-item="topLeft">
            <div class="module topLeftModule">
                <CalendarModule />
            </div>
          </div>
        </div>
        <div data-swapy-slot="topRight" class="centered" @contextmenu.prevent="showContextMenu">
          <div data-swapy-item="topRight">
            <div class="module topRightModule">
                <EditorMarkdown :note-id="noteId" :title-note='noteTitle' :content-note='noteContent' @open-markdown-center="handleMarkdownCenterOpening" />
            </div>
          </div>
        </div>
        <div data-swapy-slot="bottomLeft" class="centered" @contextmenu.prevent="showContextMenu">
          <div data-swapy-item="bottomLeft">
            <div class="module bottomLeftModule">
              <PasswordManager @open-password-center="handlePasswordCenterOpening" />
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

<MarkdownCenter @open-note="handleOpeningNote" @close-markdown-center="handleMarkdownCenterClosing" v-if="isMarkdownCenterOpen" />
<PasswordCenter @close-password-center="handlePasswordCenterClosing" v-if="isPasswordCenterOpen" />

<div v-if="contextMenu.show" class="custom-context-menu" :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
  <div class="context-menu-item" @click="handleRefresh">Refresh</div>
  <div class="context-menu-item" @click="handleEdit">Edit</div>
  <div class="context-menu-item" @click="handleSwapModules">Swap Modules</div>
  <div class="context-menu-item" @click="handleSettings">Settings</div>
</div>
</template>

<script setup lang="ts">
import type { Note } from '~/types/Note';
import type { Swapy } from 'swapy';
import { createSwapy } from 'swapy';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import MessageModule from '~/components/dashboard/messageModule/messageModule.vue';
import ProfileModule from '~/components/dashboard/profileModule.vue';
import MusicPlayerModule from '~/components/dashboard/music/musicPlayerModule.vue';
import EditorMarkdown from '~/components/dashboard/markdownModule/editorMarkdown.vue';
import MarkdownCenter from '~/components/dashboard/markdownModule/markdownCenter.vue';
import DriveModule from '~/components/dashboard/driveModule/driveModule.vue';
import PasswordManager from '~/components/dashboard/passwordManagerModule/passwordManager.vue'
import PasswordCenter from '~/components/dashboard/passwordManagerModule/passwordCenter.vue';
import CalendarModule from '~/components/dashboard/calendarModule/calendarModule.vue';
import NotificationDrawer from '~/components/dashboard/notificationDrawer/NotificationDrawer.vue';
import { useRouter } from 'vue-router';

const { $toast } = useNuxtApp();
let noteId:number;
let noteTitle = '';
let noteContent = '';

const router = useRouter();

const swapy = ref<Swapy | null>(null);
const moduleZone = ref<HTMLElement | null>(null);

const isMarkdownCenterOpen = ref(false);
const isPasswordCenterOpen = ref(false);

const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  targetModule: ''
});

const handleMarkdownCenterOpening = (status:boolean) =>{
  isMarkdownCenterOpen.value = status;
};

const handleMarkdownCenterClosing = () =>{
  isMarkdownCenterOpen.value = false;
};

const handlePasswordCenterOpening = (status:boolean) =>{
  isPasswordCenterOpen.value = status;
};

const handlePasswordCenterClosing = () =>{
  isPasswordCenterOpen.value = false;
};

const handleOpeningNote = (chosenNote :Note) => {
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
    swapy.value = createSwapy(moduleZone.value,{
        dragOnHold: true
    });
  }

  document.addEventListener('click', () => {
    contextMenu.value.show = false;
  });
});

onUnmounted(() => {
  swapy.value?.destroy();
  document.removeEventListener('click', () => {
    contextMenu.value.show = false;
  });
});
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
}

.fourZone {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 50px;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.module {
  width: 550px;
  height: 300px;
  background-color: var(--color-white);
  border-radius: 5px;
}

/* Custom Context Menu Styles */
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
</style>
