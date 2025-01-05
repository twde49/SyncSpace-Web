<template>
  <div
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer marged-left"
    v-if="closed"
    @click="openClose"
  >
    <Icon name="tabler:message-filled" size="3.5em" class="messageIcon" />
  </div>
  <div
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer marged-left"
    v-else
    @click="openClose"
  >
    <Icon name="meteor-icons:message" size="3.5em" class="messageIcon" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const closed = ref(true);

const openClose = () => {
  closed.value = !closed.value;
};
</script>

<style scoped>
.bgColorLight {
  background-color: var(--color-white);
  border-radius: 5px;
}

.topComponentSize {
  width: 100px;
  height: 100px;
}

.messageIcon{
    color: var(--color-black);
}

.marged-left {
    position: fixed;
    left: 2rem;
    top:2rem;
}
</style>
