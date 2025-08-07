<template>
  <div class="youtube-player">
    <iframe
      v-if="youtubeId"
      :src="`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=1&autoplay=0`"
      frameborder="0"
      allow="encrypted-media"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
const { youtubeId } = defineProps<{ youtubeId: string }>();
</script>

<style scoped>
.youtube-player iframe {
  width: 300px;
  height: 100px;
  border-radius: 8px;
}
</style>
