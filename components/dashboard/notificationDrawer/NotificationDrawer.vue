<template>
<div v-if="!isNotificationDrawerOpen" @click="toggleNotificationDrawer" class="w-fit absolute top-4 left-1/2 transform -translate-x-1/2">
    <Icon name="solar:bell-bold" size="2rem" class="textColorWhite hover:animate-bell cursor-pointer"/>
</div>

<div v-show="isNotificationDrawerOpen" ref="notificationDrawer" class="w-fit fixed top-4 left-1/2 transform -translate-x-1/2 bgColorWhite border border-gray-200 rounded-lg shadow-lg p-6 min-w-[400px] max-h-[80vh] overflow-y-auto opacity-0 scale-95 z-50">
    <div class="flex justify-between items-center mb-3">
        <div class="text-lg font-semibold">Notifications</div>
        <div @click="toggleNotificationDrawer" class="cursor-pointer p-1">
            <Icon name="mdi:close" size="1.2rem" />
        </div>
    </div>
    <NotificationList />
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const isNotificationDrawerOpen = ref(false);
const notificationDrawer = ref(null);

const toggleNotificationDrawer = () => {
    isNotificationDrawerOpen.value = !isNotificationDrawerOpen.value;

    if (isNotificationDrawerOpen.value) {
        gsap.to(notificationDrawer.value, {
            duration: 0.3,
            opacity: 1,
            scale: 1,
            ease: "back.out(1.7)"
        });
    } else {
        gsap.to(notificationDrawer.value, {
            duration: 0.2,
            opacity: 0,
            scale: 0.95,
            ease: "power2.in"
        });
    }
};

onMounted(() => {
    if (notificationDrawer.value) {
        gsap.set(notificationDrawer.value, {
            opacity: 0,
            scale: 0.95
        });
    }
});
</script>

<style scoped>
.hover\:animate-bell:hover {
    animation: bellRing 0.5s ease-in-out;
}

@keyframes bellRing {
    0%, 100% {
        transform: rotate(0);
    }
    20% {
        transform: rotate(15deg);
    }
    40% {
        transform: rotate(-15deg);
    }
    60% {
        transform: rotate(7deg);
    }
    80% {
        transform: rotate(-7deg);
    }
}
</style>
