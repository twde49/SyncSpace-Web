<template>
  <div
    id="profileMenuClosed"
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer marged-right"
    v-if="closed"
    @click="openClose"
    ref="closedButton"
  >
    <span class="profile-name">{{ initialUser }}</span>
  </div>
  <div
    v-else
    class="drawer-container"
    @click.self="openClose"
    ref="drawerContainer"
  >
    <div class="drawer bgColorLight" ref="drawer">
      <span class="profile-name drawer-profile-name">{{ initialUser }}</span>
      <ul class="space-y-4 mt-8">
        <li
          v-for="item in menuItems"
          :key="item"
          class="flex items-center flex-col group"
        >
          <span
            class="ml-2 text-gray-800 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            {{ item }}
          </span>
          <span
            class="text-2xl textColorBlack group-hover:scale-110 transition-transform duration-300"
          >
            ●
          </span>
        </li>
        <button @click="logout" type="submit" class="logout-btn w-full">Logout</button>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useUserStore } from '~/stores/userStore';
gsap.registerPlugin(Draggable);

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

const openClose = () => {
  closed.value = !closed.value;
};

const getInitialCurrentUser = () => {
  if (!userStore.currentUser()) {
    route.push('/');
  }
  return `${userStore.firstName[0].toUpperCase()}.${userStore.lastName[0].toUpperCase()}`;
};

const logout = () => {
  userStore.logout();
  route.push('/');
}

watch(closed, value => {
  if (value === true) {
    applyDraggable();
  }
});

onMounted(() => {
  applyDraggable();
  userStore.loadUserFromCookies();
  componentMounted.value = true;
});

watch(componentMounted, mounted => {
  if (mounted) {
    initialUser.value = getInitialCurrentUser();
  }
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
  margin-top: 6rem;
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
  z-index: 15;
  animation: fadeIn 0.5s ease;
}

.drawer {
  width: 40vw;
  height: 100vh;
  background-color: var(--color-white);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(100%);
  animation: slideIn 0.5s ease forwards;
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
</style>
