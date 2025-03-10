<template>
    <div v-for="notification in notifications" :key="notification.id" class="flex flex-col gap-2">
        {{ notification.content }}
    </div>
    coucou
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import type { Notification } from '~/types/Notification';
const notifications = ref<Notification[]>([]);

const fetchNotifications = async () => {
    try {
        const response = await fetch('/api/notifications/all');
        const data = await response.json();
        notifications.value = data as Notification[];
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

onMounted(async () => {
  await nextTick(async () => {
    await fetchNotifications();
  });
});
</script>
