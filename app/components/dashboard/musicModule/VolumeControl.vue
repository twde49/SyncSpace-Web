<template>
    <div class="currentVolume ml-6 flex flex-row justify-center items-center">
        <Icon name="ph:speaker-simple-high-fill" class="volumeIcon" size="150%" />
        <input class="volume-slider" type="range" id="volume" min="0" max="100" v-model="volume"
            @input="handleVolumeChange" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const volume = ref<number>(10);
const emit = defineEmits(['volume-change'])

const handleVolumeChange = () => {
    emit('volume-change', volume.value)
}
</script>

<style scoped>
.volume-slider {
    width: 10vw;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    outline: none;
    border-radius: 10px;
}

.volume-slider::-webkit-slider-track {
    width: 100%;
    height: 6px;
    background: var(--color-black);
    border-radius: 10px;
    border: none;
}

.volume-slider::-moz-range-track {
    width: 100%;
    height: 6px;
    background: var(--color-black);
    border-radius: 10px;
    border: none;
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-top: -6px;
}

.volume-slider::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.volume-slider::-webkit-slider-runnable-track {
    background: linear-gradient(to right,
            var(--color-primary) 0%,
            var(--color-primary) var(--progress, 10%),
            var(--color-black) var(--progress, 10%),
            var(--color-black) 100%);
    height: 6px;
    border-radius: 10px;
}

.volume-slider::-moz-range-progress {
    background: var(--color-primary);
    height: 6px;
    border-radius: 10px;
}

.volume-slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0, 0, 0), 0.2);
}

.volume-slider:focus::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0, 0, 0), 0.2);
}

.volumeIcon {
    color: var(--color-black);
}
</style>
