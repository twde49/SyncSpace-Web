<template>
  <div
    id="messageMenuClosed"
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer marged-left"
    v-if="closed"
    @click="openClose"
    ref="closedButton"
  >
    <Icon name="tabler:message-filled" size="3.5em" class="messageIcon" />
  </div>
  <div
    v-else
    class="expanded-container bgColorLight flex justify-start items-start cursor-pointer marged-left"
    @click="openClose"
    ref="expandedContainer"
  >
  <div class="leftPart flex flex-col">
    <div
      class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer"
    >
      <Icon
        name="tabler:message-filled"
        size="3.5em"
        class="messageIcon expanded-icon"
      />
    </div>

    <div class="conversationSlider mt-8 ml-4">
      <div v-for="conversation in conversations" :key="conversation.id">
        {{conversation.name ?? 'pas de nom'}}
      </div>
    </div>
  </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, nextTick } from 'vue';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import useAuthFetch from '~/composables/useAuthFetch';
import type { Conversation } from '~/types/Conversation';
gsap.registerPlugin(Draggable);
const { $toast } = useNuxtApp();
const closed = ref(true);
const expandedContainer = ref(null);
const closedButton = ref(null);
let draggableInstance: Draggable[] | null = null;
const conversations = ref<Conversation[] | null>(null);

const applyDraggable = () => {
  if (draggableInstance) {
    for (const instance of draggableInstance) {
      instance.kill();
    }
    draggableInstance = null;
  }

  draggableInstance = Draggable.create('#messageMenuClosed', {
    type: 'rotation',
    inertia: true,
    throwResistance: 1000,
    snap: value => Math.round(value / 15) * 15,
    zIndexBoost: false,
  });
};

const openClose = () => {
  closed.value = !closed.value;
};

const getConversations = async () => {
  try {
    const response = await useAuthFetch('conversations');

    conversations.value = response.data.value as Conversation[];

    for (const conversation of response.data.value as Conversation[]) {
      console.log('conv',conversation);
    }

  } catch (error: any) {
    $toast.error(error.message);
  }
};

watch(closed, value => {
  return value ? applyDraggable() : () => {};
});



onMounted( async () => {
  await nextTick(async () => {
    await getConversations()
  })
  applyDraggable();
});

onUpdated(() => {
  if (closed.value) {
    applyDraggable();
  }
});
</script>

<style scoped>
.bgColorLight {
  background-color: var(--color-white);
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.topComponentSize {
  width: 100px;
  height: 100px;
  transition:
    width 0.5s ease,
    height 0.5s ease;
}

.expanded-container {
  width: 60vw;
  height: 80vh;
  transition:
    width 0.5s ease,
    height 0.5s ease;
  position: fixed;
  top: 2rem;
  left: 2rem;
}

.messageIcon {
  color: var(--color-black);
}

.marged-left {
  position: fixed;
  left: 30px;
  top: 31px;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
</style>
