<template>
    <div class="hidden">
        <div :id="playerId"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineEmits, inject } from 'vue'
import type { Ref } from 'vue';

const props = defineProps<{ youtubeId: string }>()
const emit = defineEmits(['ready'])

const playerId = 'youtube-audio-player'
interface YouTubePlayer {
    loadVideoById: (videoId: string) => void
    cueVideoById: (videoId: string) => void
    playVideo: () => void
    pauseVideo: () => void
    getCurrentTime: () => number
    getDuration: () => number
    seekTo: (seconds: number, allowSeekAhead: boolean) => void
    setVolume: (volume: number) => void
    getPlayerState: () => number
}

const player = ref<YouTubePlayer | null>(null)
const isReady = ref(false)

const injectedYoutubePlayer = inject<Ref<YouTubePlayer | null>>('youtubePlayerRef');

interface YT {
    Player: new (
        elementId: string,
        options: {
            height: string;
            width: string;
            videoId: string;
            playerVars: Record<string, number>;
            events: {
                onReady?: () => void;
                onStateChange?: (event: { data: number }) => void;
            };
        }
    ) => YouTubePlayer;
}

interface Window {
    YT?: YT;
    onYouTubeIframeAPIReady?: () => void;
}

const loadYouTubeAPI = () =>
    new Promise<void>((resolve) => {
        if ((window as Window)?.YT && (window as Window)?.YT?.Player) resolve()
        else {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            document.body.appendChild(tag);
            (window as Window).onYouTubeIframeAPIReady = () => resolve()
        }
    })

const initPlayer = () => {
    const storedVideoId = localStorage.getItem('currentVideoId') || '';

    player.value = new ((window as Window).YT as YT).Player(playerId, {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
        },
        events: {
            onReady: () => {
                isReady.value = true
                emit('ready', player.value)
                if (injectedYoutubePlayer) {
                    injectedYoutubePlayer.value = player.value;
                }

                if (storedVideoId &&
                    storedVideoId !== 'dQw4w9WgXcQ' &&
                    props.youtubeId === storedVideoId) {
                    player.value?.cueVideoById(storedVideoId);
                }
            },
            onStateChange: (event: { data: number }) => {
            },
        },
    })
}

watch(
    () => props.youtubeId,
    (newId, oldId) => {
        if (!newId) {
            return;
        }

        if (newId === 'dQw4w9WgXcQ') {
            return;
        }

        if (player.value && player.value.cueVideoById) {
            isReady.value = false
            player.value.cueVideoById(newId)
            if (import.meta.client) {
                localStorage.setItem('currentVideoId', newId)
            }
        }
    }
)

onMounted(async () => {
    if (import.meta.client) {
        await loadYouTubeAPI()
        initPlayer()
    }
})

function play() {
    if (isReady.value && player.value) {
        if (props.youtubeId &&
            props.youtubeId !== 'dQw4w9WgXcQ' &&
            !player.value.getCurrentTime()) {
            player.value.cueVideoById(props.youtubeId)

            if (import.meta.client) {
                localStorage.setItem('currentVideoId', props.youtubeId)
            }

            setTimeout(() => {
                player.value?.playVideo()
            }, 100)
        } else {
            player.value.playVideo()
        }
    }
}

function pause() {
    if (isReady.value && player.value) {
        player.value.pauseVideo()
    }
}

function setVolume(volume: number) {
    if (player.value) {
        player.value.setVolume(volume)
    }
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
    if (!videoId || videoId === 'dQw4w9WgXcQ') {
        return;
    }

    if (player.value) {
        isReady.value = false
        player.value.cueVideoById(videoId)
        if (import.meta.client) {
            localStorage.setItem('currentVideoId', videoId)
        }
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
