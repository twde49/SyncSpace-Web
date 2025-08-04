<template>
  <div
    ref="playerElement"
    class="player flex flex-col"
    :class="{
      'flex-row': playerMode === 'mini',
      'flex-col': playerMode === 'full'
    }"
  >
    <div
      ref="dragHandle"
      class="drag-handle mx-auto mb-1 w-12 h-1.5 rounded bgColorSecondary cursor-pointer"
      @click="togglePlayerMode"
      @mousedown="startDrag"
      @touchstart="startDrag"
    ></div>

    <div v-if="playerMode === 'full'" class="full-player-content flex-1 overflow-hidden">
          <div class="full-player-layout flex h-full">
            <div class="bgColorWhite w-2/5 p-6 flex flex-col">
              <div class="flex-1 flex flex-col justify-center items-center text-center bgColorWhite">
                <div class="current-cover mb-6">
                  <img
                    :src="coverUrl"
                    alt="Album Cover"
                    class="w-64 h-64 rounded-2xl shadow-2xl object-cover mx-auto"
                  />
                </div>

                <div class="track-info mb-8">
                  <h1 class="text-3xl font-bold textColorBlack mb-2">{{ musicPlayer.title }}</h1>
                  <h2 class="text-xl textColorTritary mb-1">{{ musicPlayer.artist }}</h2>
                </div>

                <div class="full-progress-section w-full max-w-md mb-6">
                  <input
                    type="range"
                    class="track-progress-slider w-full"
                    :value="progress"
                    :max="duration"
                    @input="seek"
                    :style="{ '--progress-percentage': (progress / duration * 100 || 0) + '%' }"
                  />
                  <div class="flex justify-between text-sm textColorBlack mt-2">
                    <span>{{ formatTime(progress) }}</span>
                    <span>{{ formatTime(duration) }}</span>
                  </div>
                </div>

                <div class="enhanced-controls flex items-center justify-center space-x-6">
                  <Icon
                    name="mi:shuffle"
                    class="control-icon textColorSecondary"
                    size="24px"
                  />
                  <Icon
                    name="mi:previous"
                    class="control-icon textColorSecondary"
                    size="32px"
                    @click="previousTrack"
                  />
                  <button
                    class="play-button-large flex justify-center items-center w-16 h-16 bgColorPrimary rounded-full transition duration-300 shadow-lg"
                    @click.stop="togglePlay"
                  >
                    <Icon
                      :name="isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
                      class="textColorWhite"
                      size="24px"
                    />
                  </button>
                  <Icon
                    name="mi:next"
                    class="control-icon textColorSecondary"
                    size="32px"
                    @click="nextTrack"
                  />
                  <Icon
                    name="mi:repeat"
                    class="control-icon textColorSecondary"
                    size="24px"
                  />
                </div>
              </div>
            </div>

            <div class="right-panel w-3/5 flex flex-col globalRadius">
              <div class="tab-headers mb-3 globalRadius flex bgColorBlack">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'tab-header px-6 py-4 normalFont transition-colors duration-200',
                    activeTab === tab.id
                    ? 'textColorSecondary border-b-2 border-[var(--color-secondary)] bgColorWhite'
                    : 'textColorWhite hover:textColorPrimary hover:bgColorWhite'
                  ]"
                >
                  <Icon :name="tab.icon" class="inline mr-2" size="18px" />
                  {{ tab.name }}
                </button>
              </div>

              <div class="tab-content globalRadius flex-1 overflow-hidden bgColorBlack">
                <div v-if="activeTab === 'library'" class="tab-panel h-full overflow-y-auto p-6">
                  <div class="library-section">
                    <h3 class="largeFont mb-4 textColorWhite">Ma Bibliothèque</h3>
                    <div class="library-categories space-y-3">
                      <div class="category-item flex items-center p-3 rounded-lg bgColorBlack border border-[var(--color-secondary)] hover:border-[var(--color-primary)] cursor-pointer transition">
                        <Icon name="solar:music-note-bold" class="textColorSecondary mr-3" size="20px" />
                        <span class="normalFont textColorWhite">Titres récents</span>
                        <span class="ml-auto normalFont textColorTritary">{{ playlist.length }}</span>
                      </div>
                      <div class="category-item flex items-center p-3 rounded-lg bgColorBlack border border-[var(--color-secondary)] hover:border-[var(--color-primary)] cursor-pointer transition">
                        <Icon name="solar:heart-bold" class="textColorPrimary mr-3" size="20px" />
                        <span class="normalFont textColorWhite">Favoris</span>
                        <span class="ml-auto normalFont textColorTritary">{{ favoriteQuantity }}</span>
                      </div>
                      <div class="category-item flex items-center p-3 rounded-lg bgColorBlack border border-[var(--color-secondary)] hover:border-[var(--color-primary)] cursor-pointer transition">
                        <Icon name="solar:playlist-bold" class="textColorCategoryTritary mr-3" size="20px" />
                        <span class="normalFont textColorWhite">Mes Playlists</span>
                        <span class="ml-auto normalFont textColorTritary">0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'queue'" class="tab-panel h-full overflow-y-auto p-6">
                  <div class="playlist-header flex justify-between items-center mb-6">
                    <h3 class="largeFont textColorWhite">File d'attente</h3>
                    <button class="miniFont textColorPrimary hover:textColorSecondary transition-colors duration-200">
                      Effacer tout
                    </button>
                  </div>

                  <div class="playlist-items space-y-2">
                    <div
                      v-for="(track, index) in playlist"
                      :key="index"
                      :class="[
                        'playlist-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200',
                        index === currentTrackIndex
                          ? 'bg-opacity-20 bgColorSecondary border border-[var(--color-secondary)]'
                          : 'bg-opacity-10 hover:bg-opacity-20 bgColorBlack hover:bgColorSecondary border border-transparent hover:border-[var(--color-secondary)]'
                      ]"
                      @click="currentTrackIndex = index"
                    >
                      <div class="track-number w-8 text-center">
                        <span v-if="index === currentTrackIndex && isPlaying" class="textColorPrimary">
                          <Icon name="solar:play-bold" size="16px" />
                        </span>
                        <span v-else class="textColorWhite miniFont">{{ index + 1 }}</span>
                      </div>

                      <img
                        :src="`https://img.youtube.com/vi/${track.youtubeId}/default.jpg`"
                        alt="Track cover"
                        class="w-12 h-12 rounded-lg mr-4 object-cover border border-[var(--color-secondary)]"
                      />

                      <div class="track-details flex-1 min-w-0">
                        <div class="track-name normalFont textColorWhite truncate">{{ track.title }}</div>
                        <div class="track-artist miniFont textColorTritary truncate">{{ track.artist }}</div>
                      </div>

                      <div class="track-actions flex items-center space-x-2">
                        <Icon
                          name="solar:heart-linear"
                          class="textColorWhite hover:textColorPrimary cursor-pointer transition-colors duration-200"
                          size="18px"
                        />
                        <Icon
                          name="entypo:dots-three-vertical"
                          class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                          size="16px"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'search'" class="tab-panel h-full overflow-y-auto p-6">
                  <div class="search-section">
                    <h3 class="largeFont mb-4 textColorWhite">Rechercher</h3>

                    <div class="search-input-container mb-6">
                      <div class="relative">
                        <Icon
                          name="solar:magnifer-linear"
                          class="absolute left-3 top-1/2 transform -translate-y-1/2 textColorSecondary"
                          size="20px"
                        />
                        <input
                          v-model="searchQuery"
                          type="text"
                          placeholder="Rechercher des titres, artistes, albums..."
                          class="w-full pl-10 pr-4 py-3 border border-[var(--color-secondary)] bgColorBlack textColorWhite rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                          @input="performSearch"
                        />
                      </div>
                    </div>

                    <div v-if="isSearching" class="loading-state text-center py-8">
                      <Icon name="solar:spinner-linear-bold" class="textColorSecondary mx-auto mb-4 animate-spin" size="48px" />
                      <p class="normalFont textColorWhite">Recherche en cours...</p>
                    </div>

                    <div v-else-if="searchResults.length > 0" class="search-results">
                      <h4 class="normalFont mb-3 textColorWhite">Résultats</h4>
                      <div class="search-items space-y-2">
                        <div
                          v-for="(result, index) in searchResults"
                          :key="index"
                          class="search-item flex items-center p-3 rounded-lg bgColorBlack border border-[var(--color-secondary)] hover:border-[var(--color-primary)] cursor-pointer transition-all duration-200"
                        >
                          <img
                            :src="`https://img.youtube.com/vi/${result.youtubeId}/default.jpg`"
                            alt="Track cover"
                            class="w-12 h-12 rounded-lg mr-4 object-cover border border-[var(--color-tritary)]"
                          />
                          <div class="result-details flex-1 min-w-0">
                            <div class="result-name normalFont textColorWhite truncate">{{ result.title }}</div>
                            <div class="result-artist miniFont textColorTritary truncate">{{ result.artist }}</div>
                          </div>
                          <button
                            class="add-button px-3 py-1 miniFont bgColorPrimary textColorWhite rounded-lg hover:bgColorSecondary transition-colors duration-200"
                            @click="addToPlaylist(result)"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="searchQuery" class="empty-search text-center py-8">
                      <Icon name="solar:magnifer-linear" class="textColorSecondary mx-auto mb-4" size="48px" />
                      <p class="normalFont textColorWhite">Aucun résultat trouvé</p>
                    </div>

                    <div v-else class="search-suggestions">
                      <h4 class="normalFont mb-3 textColorWhite">Suggestions</h4>
                      <div class="suggestion-tags flex flex-wrap gap-2">
                        <span
                          v-for="suggestion in suggestions"
                          :key="suggestion"
                          class="suggestion-tag px-3 py-2 bgColorBlack border border-[var(--color-secondary)] rounded-full miniFont textColorWhite cursor-pointer hover:bgColorSecondary transition-all duration-200"
                          @click="() => { searchQuery = suggestion; performSearch(); }"
                        >
                          {{ suggestion }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-show="playerMode !== 'hidden' && playerMode !== 'full'"
          class="mini-player flex flex-row items-center w-full px-4"
          style="flex: none"
        >
          <div class="cover w-16 h-16 mr-4 flex-shrink-0">
            <img
              class="coverImage w-full h-full object-cover"
              :src="coverUrl"
              alt="current music cover"
            />
          </div>

          <div class="details flex flex-col justify-center mr-6 flex-1 max-w-[180px]">
            <span class="normalFont text-lg font-semibold textColorBlack truncate break-words">
              {{ musicPlayer.title }}
            </span>
            <span class="normalFont text-sm textColorTritary break-words">
              {{ musicPlayer.artist }}
            </span>
          </div>


          <div class="commands flex flex-row items-center justify-between flex-grow">
            <div class="mainButtons flex items-center space-x-3">
              <Icon
                name="mi:previous"
                class="musicControls textColorSecondary"
                size="200%"
                @click="previousTrack"
              />
              <span
                class="playButton flex justify-center items-center p-2.5 bgColorPrimary rounded-full transition duration-300"
                @click.stop="togglePlay"
              >
                <Icon
                  :name="isPlaying ? 'solar:pause-bold' : 'solar:play-bold'"
                  style="color: var(--color-white)"
                />
              </span>
              <Icon
                name="mi:next"
                class="musicControls textColorSecondary"
                size="200%"
                @click="nextTrack"
              />
              <Icon
                class="likeButton textColorSecondary hover:textColorPrimary transition duration-300"
                name="solar:heart-bold"
                size="200%"
                @click="likeTrack(musicPlayer)"
              />
            </div>

            <div class="currentMusicProgress flex items-center space-x-4 flex-grow mx-2">
              <input
                type="range"
                class="track-progress-slider flex-1"
                :value="progress"
                :max="duration"
                @input="seek"
                :style="{ '--progress-percentage': (progress / duration * 100 || 0) + '%' }"
              />
              <div class="time text-sm textColorBlack whitespace-nowrap">
                {{ formatTime(progress) }}/{{ formatTime(duration) }}
              </div>
            </div>

            <div class="rightControls flex items-center space-x-4">
              <VolumeControl @volume-change="handleVolumeChange" />
              <div class="threeDotsMenu">
                <Icon
                  name="entypo:dots-three-vertical"
                  class="threedots textColorSecondary hover:textColorPrimary transition duration-300"
                />
              </div>
            </div>
          </div>

          <YouTubeAudioPlayer
            ref="youtubePlayer"
            :youtubeId="currentYoutubeId"
            @ready="onYouTubeReady"
          />
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import VolumeControl from '~/components/dashboard/musicModule/VolumeControl.vue'
import YouTubeAudioPlayer from '~/components/dashboard/musicModule/YoutubeAudioPlayer.vue'
const {
  playlist,
  currentTrackIndex,
  isPlaying,
  progress,
  duration,
  currentYoutubeId,
  youtubePlayer,
  playerElement,
  dragHandle,
  activeTab,
  searchQuery,
  searchResults,
  musicPlayer,
  coverUrl,
  playerMode,
  canPlay,
  animateToMode,
  togglePlayerMode,
  startDrag,
  onYouTubeReady,
  togglePlay,
  previousTrack,
  nextTrack,
  addToPlaylist,
  likeTrack,
  handleVolumeChange,
  seek,
  formatTime,
  performSearch,
  isSearching,
  favoriteQuantity,
  checkFavoriteQuantity
} = useMusicPlayer();
import { useMusicPlayer } from '~/utils/useMusicPlayer'

const tabs = ref([
  {
    id: 'library',
    name: 'Bibliothèque',
    icon: 'solar:library-bold'
  },
  {
    id: 'queue',
    name: 'File d\'attente',
    icon: 'solar:playlist-bold'
  },
  {
    id: 'search',
    name: 'Rechercher',
    icon: 'solar:magnifer-linear'
  }
]) as Ref<Array<{ id: 'search' | 'queue' | 'library', name: string, icon: string }>>;

activeTab.value = 'library'

const suggestions = ref([
  'Top hits 2024',
  'Rock classique',
  'Jazz moderne',
  'Électronique',
  'Pop française',
  'Hip-hop'
])

onMounted(async () => {
  handleVolumeChange(50)

  await nextTick()
  await checkFavoriteQuantity();

  if (playerElement.value) {
     animateToMode('mini');
  }

  setTimeout(() => {
    if (youtubePlayer.value) {
      if (!canPlay.value) {
        onYouTubeReady();
      }
    } else {
      console.warn('YouTube player ref does not exist after timeout')
    }
  }, 2000);
})
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 12vh;
  background-color: var(--color-white);
  border-radius: 10px 10px 0 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px 20px 10px;
  overflow: hidden;
  z-index: 50;
  display: flex;
  flex-direction: column;
}


.drag-handle {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 6px;
  /* background-color handled by bgColorSecondary class in template */
  border-radius: 9999px;
  cursor: grab;
  z-index: 100;
  user-select: none;
  transition: background-color 0.3s ease;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle:hover {
  background-color: var(--color-primary); /* Changed to primary for hover */
}

.full-player-content {
  overflow-y: auto;
  flex: 1;
  padding-top: 10px;
  min-height: 0;
  background-color: var(--color-white);
}

.coverImage {
  border-radius: 8px;
}

.playButton {
  /* background-color handled by bgColorPrimary class in template */
  border-radius: 100%;
  height: 40px;
  width: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.musicControls {
  /* color handled by textColorSecondary class in template */
  cursor: pointer;
  transition: color 0.3s ease;
}

.musicControls:hover {
  color: var(--color-primary);
}

.likeButton {
  /* color handled by textColorSecondary class in template */
  cursor: pointer;
}

.threedots {
  /* color handled by textColorSecondary class in template */
  cursor: pointer;
}

.full-progress-section {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
}

.track-progress-slider {
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  border-radius: 10px;
  cursor: pointer;
}

.track-progress-slider::-webkit-slider-track {
  width: 100%;
  height: 6px;
  background: var(--color-black);
  border-radius: 10px;
  border: none;
}

.track-progress-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  background: var(--color-black);
  border-radius: 10px;
  border: none;
}

.track-progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin-top: -6px;
}

.track-progress-slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.track-progress-slider::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) var(--progress-percentage),
    var(--color-black) var(--progress-percentage),
    var(--color-black) 100%
  );
  height: 6px;
  border-radius: 10px;
}

.track-progress-slider::-moz-range-progress {
  background: var(--color-primary);
  height: 6px;
  border-radius: 10px;
}

.track-progress-slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0,0,0), 0.2);
}

.track-progress-slider:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0,0,0), 0.2);
}

.control-icon {
  cursor: pointer;
  transition: color 0.3s ease;
}

.control-icon:hover {
    color: var(--color-primary);
}

.enhanced-controls .play-button-large {
    min-width: 64px;
    min-height: 64px;
    transition: background-color 0.3s ease;
}

.play-button-large:hover {
    background-color: var(--color-secondary);
}

.normalFont {
  font-family: var(--font-family);
}

.mini-player {
  min-height: 80px;
  box-sizing: border-box;
  padding: 0 20px;
}

.mini-player > div {
    flex-shrink: 0;
}

.mini-player .commands {
    flex-grow: 1;
    flex-basis: 0;
}

.mainButtons {
    align-items: center;
}

.rightControls {
    align-items: center;
}

@media (max-width: 768px) {
    .mini-player .commands {
        flex-direction: column;
        align-items: center;
    }
     .mini-player .currentMusicProgress {
        width: 100%;
        max-width: none;
        margin: 10px 0;
     }
     .mini-player .rightControls {
         width: 100%;
         justify-content: center;
     }
     .player {
        padding: 10px 10px 5px;
     }
      .mini-player {
        padding: 0 10px;
      }
}

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin-top: -6px;
}

.volume-slider::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.volume-slider::-webkit-slider-runnable-track {
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) var(--progress, 10%),
    var(--color-black) var(--progress, 10%),
    var(--color-black) 100%
  );
  height: 6px;
  border-radius: 10px;
}

.volume-slider::-moz-range-progress {
  background: var(--color-primary);
  height: 6px;
  border-radius: 10px;
}

.volume-slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0,0,0), 0.2);
}

.volume-slider:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0,0,0), 0.2);
}

</style>
