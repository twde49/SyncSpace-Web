<template>
    <nav class="relative px-4 sm:px-6 md:px-8 py-6 flex justify-between items-center">
        <div class="flex items-center">
            <h1 class="logo">
                <div @click="navigateTo('/')" class="cursor-pointer">SyncSpace</div>
            </h1>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path v-if="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        <!-- Desktop menu -->
        <div class="hidden md:flex navbar items-center rounded-md px-4 py-2 space-x-6">
            <div class="dropdown flex items-center relative" ref="dropdownRef">
                <a @click="toggleDropdown" class="flex items-center cursor-pointer">
                    Modules
                    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 4 4 4-4" />
                    </svg>
                </a>

                <div v-if="dropdownOpen"
                    class="z-10 absolute top-full mt-2 left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <div @click="navigateTo('/modules/music-player'); dropdownOpen = false"
                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer">
                                Lecteur de musique
                            </div>
                        </li>
                        <li>
                            <div @click="navigateTo('/modules/markdown-editor'); dropdownOpen = false"
                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer">
                                Éditeur Markdown
                            </div>
                        </li>
                        <li>
                            <div @click="navigateTo('/modules/drive'); dropdownOpen = false"
                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer">
                                Drive
                            </div>
                        </li>
                        <li>
                            <div @click="navigateTo('/modules/calendar'); dropdownOpen = false"
                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer">
                                Calendrier
                            </div>
                        </li>
                        <li>
                            <div @click="navigateTo('/modules/chat-users'); dropdownOpen = false"
                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer">
                                Chat/Utilisateurs
                            </div>
                        </li>
                        <li>
                            <div @click="navigateTo('/modules/password-manager'); dropdownOpen = false"
                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:textColorWhite cursor-pointer">
                                Gestionnaire de mot de passe
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div @click="navigateTo('/about')" class="nav-item cursor-pointer">A propos</div>
            <div @click="navigateTo('/contact')" class="nav-item cursor-pointer">Contact</div>
            <NuxtLink to="https://github.com/twde49/SyncSpace-Web" class="nav-item" target="_blank"
                rel="noopener noreferrer">
                <Icon name="ph:github-logo-fill" class="github-logo" />
            </NuxtLink>
            <button class="login-button px-4 py-2" @click="navigateTo('/login')">
                Login
            </button>
        </div>

        <div class="hidden md:flex items-center ml-4">
            <LightDarkModeSwitch />
        </div>

        <!-- Mobile menu -->
        <div v-if="isMobileMenuOpen"
            class="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-b-lg z-50">
            <div class="flex flex-col p-4 space-y-4">
                <div class="dropdown">
                    <button @click="mobileDropdownOpen = !mobileDropdownOpen"
                        class="w-full text-left flex justify-between items-center">
                        Modules
                        <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <div v-if="mobileDropdownOpen" class="mt-2 pl-4 space-y-2">
                        <div @click="navigateTo('/modules/music-player'); closeMobileMenu()" class="cursor-pointer">
                            Lecteur de musique</div>
                        <div @click="navigateTo('/modules/markdown-editor'); closeMobileMenu()" class="cursor-pointer">
                            Éditeur Markdown</div>
                        <div @click="navigateTo('/modules/drive'); closeMobileMenu()" class="cursor-pointer">Drive</div>
                        <div @click="navigateTo('/modules/calendar'); closeMobileMenu()" class="cursor-pointer">
                            Calendrier</div>
                        <div @click="navigateTo('/modules/chat-users'); closeMobileMenu()" class="cursor-pointer">
                            Chat/Utilisateurs</div>
                        <div @click="navigateTo('/modules/password-manager'); closeMobileMenu()" class="cursor-pointer">
                            Gestionnaire de mot de passe</div>
                    </div>
                </div>
                <div @click="navigateTo('/about'); closeMobileMenu()" class="cursor-pointer">A propos</div>
                <div @click="navigateTo('/contact'); closeMobileMenu()" class="cursor-pointer">Contact</div>
                <NuxtLink to="https://github.com/twde49/SyncSpace-Web" target="_blank" rel="noopener noreferrer"
                    class="flex items-center" @click="closeMobileMenu()">
                    <Icon name="ph:github-logo-fill" class="github-logo mr-2" />
                    GitHub
                </NuxtLink>
                <button class="login-button w-full py-2 text-center" @click="navigateTo('/login'); closeMobileMenu()">
                    Login
                </button>
                <div class="flex justify-center pt-2">
                    <LightDarkModeSwitch />
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import LightDarkModeSwitch from "~/components/Switch/LightDarkModeSwitch.vue";
import { useRouter } from '#app';

const router = useRouter();
const isMobileMenuOpen = ref(false);
const mobileDropdownOpen = ref(false);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const navigateTo = (path: string) => {
    router.push(path);
};

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    mobileDropdownOpen.value = false;
};

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
    color: var(--color-black);
    background-color: var(--color-white);
}

.login-button {
    color: var(--color-white);
    background-color: var(--color-secondary);
    border-radius: var(--global-radius);
}

.github-logo {
    color: var(--color-black);
}

/* Mobile styles */
@media (max-width: 768px) {

    .dropdown,
    .nav-item {
        width: 100%;
        padding: 0.5rem 0;
    }
}
</style>
