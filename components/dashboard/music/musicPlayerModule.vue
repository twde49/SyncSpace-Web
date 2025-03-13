<template>
  <div class="player flex flex-row">
    <div class="cover w-1/12 mr-4">
      <img
        class="coverImage h-full object-cover"
        :src="coverUrl"
        alt="current music cover"
      />
    </div>
    <div class="details h-full flex flex-col justify-center ml-4 mr-8">
      <span class="normalFont text-lg font-semibold text-gray-800">
        {{ musicPlayer.musicName }}
      </span>
      <span class="normalFont text-sm text-gray-600">
        {{ musicPlayer.artist }}
      </span>
    </div>
    <div class="commands flex flex-row items-center">
      <div
        class="mainButtons flex h-full justify-center items-center space-x-4"
      >
        <Icon name="mi:previous" class="musicControls" size="200%" />
        <span
          class="playButton flex justify-center items-center p-2.5 bg-primary rounded-full hover:bg-primary-light transition duration-300"
        >
          <Icon name="solar:play-bold" style="color: var(--color-white)" />
        </span>
        <Icon name="mi:next" class="musicControls" size="200%" />
        <Icon
          class="ml-2.5 likeButton hover:text-red-500 transition duration-300"
          name="solar:heart-bold"
          size="200%"
        />
      </div>
      <div
        class="currentMusicProgress ml-6 flex flex-row justify-center items-center space-x-4"
      >
        <input
          type="range"
          class="progress"
          value="83"
          :max="getMaxValueFromCurrentMusic"
          readonly
        />
        <div class="time text-sm text-gray-600">1:23/3:24</div>
      </div>
      <VolumeControl />
      <div class="threeDotsMenu ml-6 flex flex-row justify-center items-center">
        <Icon
          name="entypo:dots-three-vertical"
          class="threedots hover:text-gray-600 transition duration-300"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VolumeControl from "~/components/dashboard/music/VolumeControl.vue";

const coverUrl: string =
	"https://images2.alphacoders.com/135/thumb-1920-1354873.png";
const musicPlayer = {
	musicName: "Navigating",
	album: "Clancy",
	artist: "Twenty One Pilots",
};

const getMaxValueFromCurrentMusic = computed(() => {
	return (204 / 84) * 100;
});
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background-color: var(--color-white);
  height: 10vh;
  border-radius: 10px 10px 0 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
}

.coverImage {
  border-radius: 8px;
}

.playButton {
  background-color: var(--color-primary);
  border-radius: 100%;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.playButton:hover {
  background-color: var(--color-primary-light);
}

.progress {
  width: 35vw;
  height: 8px;
  accent-color: var(--color-primary);
  border-radius: 10px;
  cursor: pointer;
}

.progress::-webkit-slider-thumb {
  border-radius: 50%;
  background-color: var(--color-primary);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.progress::-moz-range-thumb {
  border-radius: 50%;
  background-color: var(--color-primary);
  width: 16px;
  height: 16px;
}

.threedots {
  color: var(--color-black);
  cursor: pointer;
}

.threedots:hover {
  color: var(--color-primary);
}

.musicControls {
  color: var(--color-secondary);
  cursor: pointer;
}

.musicControls:hover {
  color: var(--color-primary);
}

.likeButton {
  color: var(--color-tritary);
  cursor: pointer;
}

.likeButton:hover {
  color: red;
}

.normalFont {
  font-family: 'Arial', sans-serif;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.time {
  font-size: 12px;
  color: #4a4a4a;
}

.volumeControl {
  margin-left: 20px;
}
</style>
