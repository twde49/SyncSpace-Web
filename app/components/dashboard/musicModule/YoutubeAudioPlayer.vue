<template>
  <div class="hidden">
    <div :id="playerId"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineEmits, inject } from 'vue'

const props = defineProps<{ youtubeId: string }>()
const emit = defineEmits(['ready'])

const playerId = 'youtube-audio-player'
const player = ref<any>(null)
const isReady = ref(false)

const injectedYoutubePlayer = inject<Ref<any | null>>('youtubePlayerRef');

const loadYouTubeAPI = () =>
  new Promise<void>((resolve) => {
    // @ts-expect-error window.YT is defined
    if (window?.YT && window?.YT?.Player) resolve()
    else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => resolve()
    }
  })

const initPlayer = () => {
  // @ts-expect-error Yt is defined
  player.value = new YT.Player(playerId, {
    height: '0',
    width: '0',
    videoId: props.youtubeId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
    },
    events: {
      onReady: () => {
        isReady.value = true
        emit('ready', player.value)
        if (injectedYoutubePlayer) {
          injectedYoutubePlayer.value = player.value;
        }
      },
      onStateChange: (event: any) => {
      },
    },
  })
}

watch(
  () => props.youtubeId,
  (newId) => {
    if (player.value && player.value.loadVideoById) {
      isReady.value = false
      player.value.loadVideoById(newId)
    }
  }
)

onMounted(async () => {
  await loadYouTubeAPI()
  initPlayer()
})

function play() {
  if (isReady.value && player.value) player.value.playVideo()
}

function pause() {
  if (isReady.value && player.value) player.value.pauseVideo()
}

function setVolume(volume: number) {
  if (player.value) player.value.setVolume(volume)
}

async function getCurrentTime(): Promise<number> {
  return player.value?.getCurrentTime?.() || 0
}

async function getDuration(): Promise<number> {
  return player.value?.getDuration?.() || 0
}

function seekTo(seconds: number) {
  if (player.value) player.value.seekTo(seconds, true)
}

function loadVideoById(videoId: string) {
  if (player.value) {
    isReady.value = false
    player.value.loadVideoById(videoId)
  }
}

defineExpose({
  play,
  pause,
  setVolume,
  getCurrentTime,
  getDuration,
  seekTo,
  loadVideoById,
  isReady,
})
</script>
