<template>
  <nav class="nav mt-6 flex flex-row justify-around mx-auto">
    <div class="w-max flex items-center">
      <h1 class="logo"><div @click="navigateTo('/')" class="cursor-pointer">SyncSpace</div></h1>
    </div>
    <div class="navbar flex justify-around items-center w-60vw">
      <div class="dropdown flex items-center">
        <div class="nav-item flex items-center dropdown relative" ref="dropdownRef">
          <a
            @click="toggleDropdown"
            class="flex items-center cursor-pointer"
          >
            Modules
            <svg
              class="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </a>

          <!-- Conditionally render based on dropdownOpen state -->
          <div
            v-if="dropdownOpen"
            class="z-10 absolute top-full mt-2 left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <div
                  @click="navigateTo('/modules/music-player'); dropdownOpen = false"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer"
                >
                  Lecteur de musique
                </div>
              </li>
              <li>
                <div
                  @click="navigateTo('/modules/markdown-editor'); dropdownOpen = false"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer"
                >
                  Éditeur Markdown
                </div>
              </li>
              <li>
                <div
                  @click="navigateTo('/modules/drive'); dropdownOpen = false"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer"
                >
                  Drive
                </div>
              </li>
              <li>
                <div
                  @click="navigateTo('/modules/calendar'); dropdownOpen = false"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer"
                >
                  Calendrier
                </div>
              </li>
              <li>
                <div
                  @click="navigateTo('/modules/chat-users'); dropdownOpen = false"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer"
                >
                  Chat/Utilisateurs
                </div>
              </li>
              <li>
                <div
                  @click="navigateTo('/modules/password-manager'); dropdownOpen = false"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer"
                >
                  Gestionnaire de mot de passe
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div @click="navigateTo('/about')" class="nav-item flex items-center cursor-pointer">A propos</div>
      <div @click="navigateTo('/contact')" class="nav-item flex items-center cursor-pointer">Contact</div>
      <NuxtLink
        to="https://github.com/twde49/SyncSpace-Web"
        class="nav-item flex items-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="uil:github" class="github-logo" />
      </NuxtLink>
      <button class="login-button flex items-center" @click="navigateTo('/login')">
        Login
      </button>
    </div>
    <div class="dark-light-switcher flex items-center">
      <LightDarkModeSwitch />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'; // Import ref for reactive state
import { onClickOutside } from '@vueuse/core'; // Import onClickOutside for closing dropdown
import LightDarkModeSwitch from "~/components/Switch/LightDarkModeSwitch.vue";
import { useRouter } from '#app'; // Nuxt 3's useRouter composable

const router = useRouter();

const navigateTo = (path: string) => {
  router.push(path);
};

// Dropdown logic
const dropdownOpen = ref(false); // Reactive state for dropdown visibility
const dropdownRef = ref(null); // Template ref for the dropdown container to detect outside clicks

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Close dropdown when clicking outside the dropdownRef element
onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false;
});
</script>

<style scoped>
.logo {
  font: var(--text-style-mega);
  color: var(--color-primary);
  -webkit-text-stroke: 1px var(--color-primary);
}

.navbar {
  font: var(--text-style-large);
  border-radius: var(--global-radius);
  height: 8vh;
  min-width: 50vw;
  color: var(--color-black);
  background-color: var(--color-white);
}

.login-button {
  color: var(--color-white);
  background-color: var(--color-secondary);
  border-radius: var(--global-radius);
  padding: 10px;
}

.github-logo {
  color: var(--color-black);
}

.nav {
  width: 100vw;
}
</style>
