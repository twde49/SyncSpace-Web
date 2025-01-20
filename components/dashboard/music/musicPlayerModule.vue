<template>
  <div class="player flex flex-row">
    <div class="cover w-1/12 mr-2">
      <img
        class="coverImage h-full object-cover"
        :src="coverUrl"
        alt="current music cover"
      />
    </div>
    <div class="details h-full flex flex-col justify-evenly ml-8 mr-8">
      <span class="normalFont">{{
          musicPlayer.musicName
        }}</span>
      <span class="normalFont">{{ musicPlayer.artist }}</span>
    </div>
    <div class="commands flex flex-row">
      <div class="mainButtons flex h-full justify-center items-center">
        <Icon name="mi:previous" class="musicControls" size="250%" />
        <span class="playButton flex justify-center items-center">
          <Icon name="solar:play-bold" style="color: var(--color-white)" />
        </span>
        <Icon name="mi:next" class="musicControls" size="250%" />
        <Icon
          class="ml-2.5 likeButton"
          name="solar:heart-bold"
          size="200%"
        />
      </div>
      <div
        class="currentMusicProgress ml-6 flex flex-row justify-center items-center"
      >
        <input
          type="range"
          class="progress"
          value="83"
          :max="getMaxValueFromCurrentMusic"
          readonly
        />
        <div class="time ml-8">1:23/3:24</div>
      </div>
      <VolumeControl />
      <div class="threeDotsMenu ml-6 flex flex-row justify-center items-center">
        <Icon
          name="entypo:dots-three-vertical"
          class="threedots"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VolumeControl from '~/components/dashboard/music/VolumeControl.vue';

const coverUrl: string =
  'https://images2.alphacoders.com/135/thumb-1920-1354873.png';
const musicPlayer = {
  musicName: 'Navigating',
  album: 'Clancy',
  artist: 'Twenty One Pilots',
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
  border-radius: 5px 5px 0 0;
}

.coverImage {
  border-radius: 5px 0 0 0;
}

.playButton {
  background-color: var(--color-primary);
  border-radius: 100%;
  height: 4vw;
  width: 4vw;
}

.progress {
  width: 30vw;
  height: auto;
  accent-color: var(--color-primary);
}

.threedots {
  color: var(--color-black);
}

.musicControls {
  color: var(--color-secondary)
}

.likeButton {
  color: var(--color-tritary)
}
</style>
