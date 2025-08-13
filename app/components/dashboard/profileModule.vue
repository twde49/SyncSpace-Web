<template>
    <div id="profileMenuClosed"
        class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer marged-right"
        v-if="closed" @click="openClose" ref="closedButton">
        <span class="profile-name">{{ initialUser }}</span>
    </div>
    <div v-else class="drawer-container" @click.self="closeDrawer" ref="drawerContainer">
        <div class="drawer bgColorLight" ref="drawer">
            <div class="drawer-header">
                <WeatherInfo class="weather-component" />
                <div class="parameters-icon">
                    <Icon @click="openParamModal" name="ph:gear-six-fill" size="1em" class="textColorBlack" />
                </div>
            </div>
            <span class="profile-name drawer-profile-name">{{ initialUser }}</span>
            <ul class="space-y-4 mt-8">
                <li v-for="item in menuItems" :key="item" class="flex items-center flex-col group">
                    <span
                        class="ml-2 textColorBlack group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                        {{ item }}
                    </span>
                    <span class="text-2xl textColorBlack group-hover:scale-110 transition-transform duration-300">
                        ●
                    </span>
                </li>
                <button @click="logout" type="submit" class="logout-btn w-full">
                    Logout
                </button>
            </ul>
        </div>
    </div>

    <div v-show="paramModalVisible" @click.self="closeParamModal" tabindex="-1" aria-hidden="true"
        class="modalParams flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
        <div class="relative p-4 w-full max-w-md max-h-[90%]">
            <div class="relative globalRadius bgColorBlack rounded-lg shadow-sm dark:bg-gray-700">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 class="text-lg font-semibold textColorWhite dark:textColorWhite">
                        Paramètres
                    </h3>
                    <button @click="closeParamModal" type="button"
                        class="text-gray-400 globalRadius bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:textColorWhite">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div class="p-4 md:p-5">
                    <ul class="space-y-4 mb-4 max-h-64 overflow-y-auto">
                        <li>
                            <input type="checkbox" id="notifications"
                                v-model="userStore.parameters.notificationsEnabled" class="hidden peer" />
                            <label for="notifications"
                                class="inline-flex globalRadius items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500 bgColorWhite textColorBlack">
                                <div class="block">
                                    <div class="w-full text-lg font-semibold">notifications</div>
                                </div>
                                <div class="flex justify-center items-center">
                                    <label class="inline-flex globalRadius items-center mr-2 cursor-pointer">
                                        <input type="checkbox" v-model="userStore.parameters.notificationsEnabled"
                                            class="sr-only peer" />
                                        <div
                                            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)] dark:peer-checked:bg-[var(--color-primary)]">
                                        </div>
                                    </label>
                                </div>
                            </label>
                        </li>

                        <li>
                            <div
                                class="inline-flex globalRadius items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500 bgColorWhite textColorBlack">
                                <div class="block">
                                    <div class="w-full text-lg font-semibold">Theme</div>
                                </div>
                                <div class="flex h-6 justify-center items-center">
                                    <LightDarkModeSwitch v-model="$colorMode.preference" />
                                </div>
                            </div>
                        </li>

                        <li>
                            <input type="checkbox" id="geolocation" v-model="userStore.parameters.geolocationEnabled"
                                class="hidden peer" />
                            <label for="geolocation"
                                class="inline-flex globalRadius items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500 bgColorWhite textColorBlack">
                                <div class="block">
                                    <div class="w-full text-lg font-semibold">Géolocalisation</div>
                                </div>
                                <div class="flex justify-center items-center">
                                    <label class="inline-flex globalRadius items-center mr-2 cursor-pointer">
                                        <input type="checkbox" v-model="userStore.parameters.geolocationEnabled"
                                            class="sr-only peer" />
                                        <div
                                            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)] dark:peer-checked:bg-[var(--color-primary)]">
                                        </div>
                                    </label>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useUserStore } from '~/stores/userStore';
import WeatherInfo from './weatherModule/weatherInfo.vue';
import { useWebSocket } from '#imports';
import { useAuthFetch } from '#imports';
import LightDarkModeSwitch from '~/components/Switch/LightDarkModeSwitch.vue';

const { connect, webSocketData, isOnline, isOffline } = useWebSocket();

gsap.registerPlugin(Draggable);
const { $colorMode } = useNuxtApp();
const paramModalVisible = ref(false);
const initialUser = ref('');
const componentMounted = ref(false);
const route = useRouter();
const userStore = useUserStore();
const closed = ref(true);
const drawerContainer = ref(null);
const drawer = ref(null);
const closedButton = ref(null);
const menuItems = [
    'Lecteur de musique',
    'Éditeur Markdown',
    'Drive',
    'Calendrier',
    'Chat/Utilisateurs',
    'Gestionnaire de mot de passe',
];

let draggableInstance: Draggable[] | null = null;

const applyDraggable = () => {
    if (draggableInstance) {
        for (const instance of draggableInstance) {
            instance.kill();
        }
        draggableInstance = null;
    }

    draggableInstance = Draggable.create('#profileMenuClosed', {
        type: 'rotation',
        inertia: true,
        throwResistance: 1000,
        snap: value => Math.round(value / 15) * 15,
        zIndexBoost: false,
    });
};

const closeDrawer = () => {
    if (drawer.value && drawerContainer.value) {
        gsap.to(drawer.value, {
            duration: 0.5,
            x: '100%',
            ease: 'power2.inOut',
        });

        gsap.to(drawerContainer.value, {
            duration: 0.5,
            opacity: 0,
            ease: 'power2.inOut',
            onComplete: () => {
                closed.value = true;
            },
        });
    }
};

const openClose = () => {
    if (closed.value) {
        closed.value = false;
    } else {
        closeDrawer();
    }
};

const openParamModal = () => {
    paramModalVisible.value = true;
};

const closeParamModal = () => {
    paramModalVisible.value = false;
};

const getInitialCurrentUser = () => {
    if (!userStore.currentUser()) {
        route.push('/');
    }
    if (!userStore.firstName[0] || !userStore.lastName[0]) {
        return '';
    }
    return `${userStore.firstName[0].toUpperCase()}.${userStore.lastName[0].toUpperCase()}`;
};

const logout = () => {
    isOffline(userStore.email, userStore.token);
    userStore.logout();
    route.push('/');
};

watch(closed, value => {
    if (value === true) {
        applyDraggable();
    }
});

onMounted(() => {
    applyDraggable();
    userStore.loadUserFromCookies();
    componentMounted.value = true;
    connect();
    $colorMode.preference = userStore.parameters.theme;
});

watch(componentMounted, mounted => {
    if (mounted) {
        initialUser.value = getInitialCurrentUser();
    }
});

watch(webSocketData.value, async newData => {
    if (newData.type === 'checkUser') {
        userStore.setSocketId(newData.socketId.id);
        isOnline(userStore.email, userStore.token);
    }
});

watch(
    () => userStore.parameters.notificationsEnabled,
    newValue => {
        useAuthFetch(`settings/enable-disable-notifications?${Date.now()}`, {
            method: 'POST',
            body: JSON.stringify({ notifications_enabled: newValue }),
        });
    },
);

watch(
    () => userStore.parameters.geolocationEnabled,
    newValue => {
        useAuthFetch(`settings/enable-disable-geolocation?${Date.now()}`, {
            method: 'POST',
            body: JSON.stringify({ geolocation_enabled: newValue }),
        });
    },
);

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
}

.profile-name {
    font: var(--text-style-large);
    color: var(--color-black);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border: 2px solid var(--color-black);
    border-radius: 5px;
    background-color: var(--color-white);
    transition: transform 0.3s ease;
}

.drawer-profile-name {
    margin-top: 10rem;
}

.marged-right {
    position: fixed;
    right: 2rem;
    top: 2rem;
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}

.drawer-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    z-index: 9999;
    animation: fadeIn 0.5s ease;
}

.modalParams {
    z-index: 99999;
}

.drawer {
    width: 70vw;
    height: 100vh;
    background-color: var(--color-white);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(0);
    animation: slideIn 0.5s ease;
    position: relative;
}

.drawer-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 1rem 2rem;
    position: absolute;
    top: 0;
    right: 0;
}

.weather-component {
    margin-right: 1rem;
}

.parameters-icon {
    font-size: 24px;
    cursor: pointer;
    color: var(--color-black);
    transition: transform 0.3s ease;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transform-origin: center;
}

.parameters-icon:hover {
    transform: rotate(45deg);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(100%);
    }
}

.logout-btn {
    background-color: #ff7f50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.logout-btn:hover {
    background-color: #ff5722;
}

@media (min-width: 768px) {
    .drawer {
        width: 40vw;
    }
}
</style>
