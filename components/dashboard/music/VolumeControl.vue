<template>
  <div class="currentVolume ml-6 flex flex-row justify-center items-center">
    <Icon
      name="material-symbols:volume-up-rounded"
      class="volumeIcon"
      size="200%"
    />
    <input
      class="progressMini"
      type="range"
      id="volume"
      min="0"
      max="100"
      v-model="volume"
      @input="handleVolumeChange"
    />
  </div>
</template>

<script>
export default {
	name: "VolumeControl",
	data() {
		return {
			volume: 10,
		};
	},
	methods: {
		handleVolumeChange() {
			this.adjustVolume(this.volume / 100);
		},
		adjustVolume(value) {
			const audioElement = this.$refs.audioElement;
			if (audioElement) {
				audioElement.volume = value;
			}
		},
	},
	mounted() {
		this.adjustVolume(this.volume / 100);
	},
};
</script>

<style scoped>
#volume {
  width: 200px;
}

.progressMini {
  width: 10vw;
  height: 1vh;
  accent-color: var(--color-primary);
}

.volumeIcon {
  color: var(--color-black);
}
</style>
