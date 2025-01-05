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
</template>

<script setup lang="ts">
import type { Swapy } from 'swapy';
import { createSwapy } from 'swapy';
import { onMounted, onUnmounted, ref } from 'vue';
import messageModule from '~/components/dashboard/messageModule.vue';
import profileModule from '~/components/dashboard/profileModule.vue';

const { $toast } = useNuxtApp();
import musicPlayerModule from '~/components/dashboard/music/musicPlayerModule.vue';

const swapy = ref<Swapy | null>(null);
const moduleZone = ref<HTMLElement | null>(null);

onMounted(() => {
  if (moduleZone.value) {
    swapy.value = createSwapy(moduleZone.value);
    swapy.value.onSwap(() => {
      $toast.success('You made a point',{
        position: 'top-center',
        transition: "slide",
      })
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
