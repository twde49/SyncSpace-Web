<template>
  <div class="max-size">
    <messageModule />
    <profileModule />
    <musicPlayerModule />
    <div class="fourZoneContainer">
      <div class="fourZone" ref="moduleZone">
        <div data-swapy-slot="topLeft" class="centered">
          <div data-swapy-item="topLeft">
            <div class="module topLeftModule">
            
            </div>
          </div>
        </div>
        <div data-swapy-slot="topRight" class="centered">
          <div data-swapy-item="topRight">
            <div class="module topRightModule">
              <EditorMarkdown :note-id="noteId" :title-note='noteTitle' :content-note='noteContent' @open-markdown-center="handleMarkdownCenterOpening" />
            </div>
          </div>
        </div>
        <div data-swapy-slot="bottomLeft" class="centered">
          <div data-swapy-item="bottomLeft">
            <div class="module bottomLeftModule">
            
            </div>
          </div>
        </div>
        <div data-swapy-slot="bottomRight" class="centered">
          <div data-swapy-item="bottomRight">
            <div class="module bottomRightModule">
            
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<MarkdownCenter @open-note="handleOpeningNote" @close-markdown-center="handleMarkdownCenterClosing" v-if="isMarkdownCenterOpen" />
</template>

<script setup lang="ts">
import type { Note } from '~/types/Note';
import type { Swapy } from 'swapy';
import { createSwapy } from 'swapy';
import { onMounted, onUnmounted, ref } from 'vue';
import messageModule from '~/components/dashboard/messageModule/messageModule.vue';
import profileModule from '~/components/dashboard/profileModule.vue';
import musicPlayerModule from '~/components/dashboard/music/musicPlayerModule.vue';
import EditorMarkdown from '~/components/dashboard/markdownModule/editorMarkdown.vue';
import MarkdownCenter from '~/components/dashboard/markdownModule/markdownCenter.vue';

const { $toast } = useNuxtApp();
let noteId:number;
let noteTitle = '';
let noteContent = '';

const swapy = ref<Swapy | null>(null);
const moduleZone = ref<HTMLElement | null>(null);

const isMarkdownCenterOpen = ref(false);

const handleMarkdownCenterOpening = (status:boolean) =>{
  isMarkdownCenterOpen.value = status;
};

const handleMarkdownCenterClosing = () =>{
  isMarkdownCenterOpen.value = false;
};

const handleOpeningNote = (chosenNote :Note) => {
  noteId = chosenNote.id;
  noteTitle = chosenNote.title ?? '';
  noteContent = chosenNote.content ?? '';
};



onMounted(() => {
  if (moduleZone.value) {
    swapy.value = createSwapy(moduleZone.value);
    swapy.value.onSwap(() => {
      console.log('swapped');
    })
  }
})

onUnmounted(() => {
  swapy.value?.destroy();
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
  width: 450px;
  height: 250px;
  background-color: var(--color-white);
  border-radius: 5px;
}
</style>
