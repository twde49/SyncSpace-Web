<template>
  <h1 class="text-3xl font-bold underline">
    Écrivez votre première idée brillante ici...
  </h1>
  <div>
    <div class="flex justify-center p-4">
      <button
        id="button"
        data-modal-toggle="modal"
        data-modal-target="modal"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Show modal
      </button>
    </div>

    <div
      id="modal"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3
              class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white"
            >
              Terms of Service
            </h3>
            <button
              id="closeButton"
              data-modal-hide="modal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
            <p
              class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              The European Union’s General Data Protection Regulation (G.D.P.R.)
              goes into effect on May 25 and is meant to ensure a common set of
              data rights in the European Union. It requires organizations to
              notify users as soon as possible of high-risk data breaches that
              could personally affect them.
            </p>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              I accept
            </button>
            <button
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div ref="dropdown" class="dropdown">
    <strong class="dropdown-label cursor-pointer" @click="show = !show">
      Click me to open!
    </strong>
    <p class="dropdown-content" v-if="show">Lorum ipsum...</p>
  </div>

  <div class="container">
    <div class="flair flair--3b"></div>
  </div>

  <div>
    <button @click="notify">Notify !</button>
  </div>

  <div ref="containerswapy">
    <div data-swapy-slot="a">
      <div data-swapy-item="a">
        <div><h1>A</h1></div>
      </div>
    </div>

    <div data-swapy-slot="b">
      <div data-swapy-item="b">
        <div><h1>B</h1></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ref, onMounted, onUnmounted } from 'vue';
import autoAnimate from '@formkit/auto-animate';
import { createSwapy } from 'swapy';
gsap.registerPlugin(Draggable);

const { $toast } = useNuxtApp();
const dropdown = ref();
const show = ref(false);

onMounted(() => {
  autoAnimate(dropdown.value);
  Draggable.create('.flair--3b', {
    type: 'rotation',
    inertia: true,
  });
});

const notify = () => {
  $toast.error('Something went wrong');
};

const swapy = ref();
const containerswapy = ref();

onMounted(() => {
  if (containerswapy.value) {
    swapy.value = createSwapy(containerswapy.value);
  }
});

onUnmounted(() => {
  swapy.value?.destroy();
});
</script>

<style scoped>
html,
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.container {
  position: relative;
  width: 90vw;
  height: 90vh;
  max-width: 90vh;
  max-height: 90vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 9px;
}

.flair {
  cursor: pointer;
  width: 70px;
  height: 70px;
  max-height: 15vh;
  max-width: 15vh;
}

.flair--3b {
  background-image: url(https://assets.codepen.io/16327/ui-flair-2.png);
}
</style>
