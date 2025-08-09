<template>
  <div
    v-if="notifications.length > 0"
    class="flex flex-col gap-2 max-h-52 scrollable"
  >
    <div v-for="notification in notifications" :key="notification.id">
      <div
        class="bg-white rounded-lg shadow-md p-4 mb-3 relative border border-gray-200"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-lg text-gray-800">
            {{ notification.title }}
          </h3>
          <button
            @click="$emit('readNotification', notification.id)"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="text-gray-600 my-2">{{ getDisplayedContent(notification.content) }}</p>
        <div v-if="notification.createdAt" class="text-sm text-gray-500 mt-2">
          {{ $formatDate(notification.createdAt, 'HH:mm dd/MM') }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col gap-2 max-h-32 scrollable">
    <div>
      <p class="textColorBlack my-2">Pas de notifications</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from "~/types/Notification";

const { notifications } = defineProps<{ notifications: Notification[] }>();
defineEmits(["readNotification"]);

const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mkv'];

const getDisplayedContent = (content: string | undefined) => {
  if (!content) return '';
  const lowerContent = content.toLowerCase();
  for (const ext of audioExtensions) {
    if (lowerContent.includes(ext)) {
      return 'audio';
    }
  }
  for (const ext of imageExtensions) {
    if (lowerContent.includes(ext)) {
      return 'image';
    }
  }
  for (const ext of videoExtensions) {
    if (lowerContent.includes(ext)) {
      return 'video';
    }
  }
  return content;
};
</script>
