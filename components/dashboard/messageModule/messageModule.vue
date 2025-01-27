<template>
  <div
    id="messageMenuClosed"
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center marged-left"
    v-if="closed"
    ref="closedButton"
  >
    <Icon name="tabler:message-filled" size="3.5em" class="messageIcon  cursor-pointer" @click="openClose" />
  </div>
  <div
    v-else
    class="expanded-container bgColorLight flex justify-start items-start marged-left"
    ref="expandedContainer"
  >
    <div class="leftPart flex flex-col w-56">
      <div
        class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer"
      >
        <Icon
          name="tabler:message-filled"
          size="3.5em"
          class="messageIcon expanded-icon cursor-pointer"
          @click="openClose"
        />
      </div>

      <div class="conversationSlider mt-3">
        <div class="w-full littleConversation" v-for="conversation in conversations" :key="conversation.id">
          <little-conversation
            class="mt-8 w-full"
            :conversation="conversation"
            :is-active="activeConversation === conversation"
            @click="activeConversation = conversation"
          />
        </div>
      </div>
      <button class="createConversation">
        <Icon name="typcn:plus" size="24px" class="textColorWhite" />
      </button>
    </div>

      <div v-if="activeConversation" class="rightPart bg-dark flex flex-col justify-between m-4">
        <ActiveConversation :conversation="activeConversation" />
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, nextTick } from 'vue';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import useAuthFetch from '~/composables/useAuthFetch';
import type { Conversation } from '~/types/Conversation';
import LittleConversation from '~/components/dashboard/messageModule/littleConversation.vue';
import ActiveConversation from '~/components/dashboard/messageModule/activeConversation.vue';
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

const activeConversation = ref<Conversation | null>(null);

const openClose = async () => {
  const duration = 0.5;
  if (closed.value) {
    gsap.to(expandedContainer.value, {
      duration,
      width: '70vw',
      height: '80vh',
      ease: 'power2.inOut',
    });
    gsap.to(closedButton.value, {
      duration,
      opacity: 0,
      ease: 'power2.inOut',
    });
    await nextTick();
    closed.value = false;
  } else {
    gsap.to(expandedContainer.value, {
      duration,
      width: '100px',
      height: '100px',
      ease: 'power2.inOut',
    });
    gsap.to(closedButton.value, {
      duration,
      opacity: 1,
      ease: 'power2.inOut',
    });
    await nextTick();
    closed.value = true;
  }
};


const getConversations = async () => {
  try {
    const response = await useAuthFetch('conversations');

    conversations.value = response.data.value as Conversation[];

  } catch (error: any) {
    $toast.error(error.message);
  }
};

watch(closed, value => {
  return value ? applyDraggable() : () => {};
});

onMounted(async () => {
  await nextTick(async () => {
    await getConversations();
  });
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
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.expanded-container {
z-index: 55;
  width: 70vw;
  height: 80vh;
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
  position: fixed;
}

.marged-left {
  position: fixed;
  left: 30px;
  top: 31px;
  transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}


.messageIcon {
  color: var(--color-black);
}

.leftPart {
  position: relative;
  height: 100%;
  display: flex;
}

.conversationSlider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.createConversation {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vh;
  border-radius: 5px;
  background-color: var(--color-black);
}

.littleConversation{
  width: 90%;
}

.bg-dark {
  background-color: var(--color-black);
  color: white;
  border-radius: 5px;
}

.rightPart {
  width: 80%;
  height: 96.5% !important;

}

</style>
