<template>
    <nav class="nav mt-6 flex flex-row justify-around mx-auto">
        <div class="w-max flex items-center">
            <h1 class="logo">SyncSpace</h1>
        </div>
        <div class="navbar flex justify-around items-center w-60vw">
            <div class="dropdown flex items-center">
                <div class="nav-item flex items-center dropdown">
                    <a
                        id="dropdownDefaultButton"
                        data-dropdown-offset-distance="35"
                        data-dropdown-offset-skidding="5"
                        data-dropdown-toggle="dropdown"
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

                    <!-- Dropdown menu -->
                    <div
                        id="dropdown"
                        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                        <ul
                            class="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownDefaultButton"
                        >
                            <li>
                                <a
                                    href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >Lecteur de musique</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >Éditeur Markdown</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >Drive</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >Calendrier</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >Chat/Utilisateurs</a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >Gestionnaire de mot de passe</a
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <a href="/about" class="nav-item flex items-center">A propos</a>
            <a href="/contact" class="nav-item flex items-center">Contact</a>
            <a
                href="https://github.com/twde49/SyncSpace-Web"
                class="nav-item flex items-center"
            >
                <Icon name="uil:github" class="github-logo" />
            </a>
            <button class="login-button flex items-center"><a href="/login">Login</a></button>
        </div>
        <div class="dark-light-switcher flex items-center">
            <LightDarkModeSwitch />
        </div>
    </nav>
</template>

<script setup lang="ts">
import LightDarkModeSwitch from "~/components/Switch/LightDarkModeSwitch.vue";
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
