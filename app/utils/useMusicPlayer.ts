import useAuthFetch from '@/composables/useAuthFetch';
import { useUserStore } from '@/stores/userStore';
import gsap from 'gsap';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import type { Track } from '~/types/Track';

export function useMusicPlayer() {
  const userStore = useUserStore();
  const playlist = ref<Track[]>([]);

  const currentTrackIndex = ref(0);
  const isPlaying = ref(false);
  const progress = ref(0);
  const duration = ref(0);
  const favoriteQuantity = ref<number>(0);
  const currentYoutubeId = computed(() => {
    if (
      playlist.value.length > 0 &&
      currentTrackIndex.value < playlist.value.length
    ) {
      return playlist.value[currentTrackIndex.value].youtubeId;
    }
    return 'dQw4w9WgXcQ';
  });

  const youtubePlayer = ref<any | null>(null);
  provide('youtubePlayerRef', youtubePlayer);
  const playerElement = ref<HTMLElement | null>(null);
  const dragHandle = ref<HTMLElement | null>(null);
  const onMountedMusicLoaded = ref<boolean>(false);

  const activeTab = ref<'search' | 'queue' | 'library'>('queue');
  const searchQuery = ref('');
  const searchResults = ref<Track[]>([]);
  const isSearching = ref(false);

  const musicPlayer = computed(() => {
    if (
      playlist.value.length > 0 &&
      currentTrackIndex.value < playlist.value.length
    ) {
      return playlist.value[currentTrackIndex.value];
    }
    return {
      youtubeId: 'dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      coverUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    };
  });

  const coverUrl = computed(() => {
    return `https://img.youtube.com/vi/${currentYoutubeId.value}/hqdefault.jpg`;
  });

  const playerMode = ref<'hidden' | 'mini' | 'full'>('mini');

  const HEIGHTS = {
    hidden: 0,
    mini: 0,
    full: 0,
  };

  const isDragging = ref(false);
  const startY = ref(0);
  const startHeight = ref(0);

  const animateToMode = (newMode: 'hidden' | 'mini' | 'full') => {
    if (!playerElement.value) return;

    const targetHeight = HEIGHTS[newMode];

    gsap.to(playerElement.value, {
      height: targetHeight,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        playerMode.value = newMode;
      },
    });
  };

  const togglePlayerMode = () => {
    if (playerMode.value === 'hidden') animateToMode('mini');
    else if (playerMode.value === 'mini') animateToMode('full');
    else animateToMode('hidden');
  };

  const updateHeightsOnResize = () => {
    if (process.client) {
      HEIGHTS.mini = window.innerHeight * 0.12;
      HEIGHTS.full = window.innerHeight * 0.9;
      if (playerElement.value) {
        if (playerMode.value !== 'hidden') {
          gsap.set(playerElement.value, { height: HEIGHTS[playerMode.value] });
        }
      }
    }
  };

  onMounted(() => {
    if (process.client) {
      updateHeightsOnResize();
      window.addEventListener('resize', updateHeightsOnResize);
      if (playerElement.value && playerMode.value !== 'hidden') {
        gsap.set(playerElement.value, { height: HEIGHTS[playerMode.value] });
      }
    }
  });

  onBeforeUnmount(() => {
    if (process.client) {
      window.removeEventListener('resize', updateHeightsOnResize);
    }
  });

  const startDrag = (event: MouseEvent | TouchEvent) => {
    if (!playerElement.value) return;

    isDragging.value = true;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    startY.value = clientY;
    startHeight.value = playerElement.value.offsetHeight;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', endDrag);

    event.preventDefault();
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !playerElement.value) return;

    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    const deltaY = startY.value - clientY;
    let newHeight = startHeight.value + deltaY;

    newHeight = Math.min(Math.max(newHeight, 0), HEIGHTS.full);

    gsap.set(playerElement.value, { height: newHeight });
  };

  const endDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !playerElement.value || !process.client) return;

    isDragging.value = false;
    const clientY =
      event instanceof MouseEvent
        ? event.clientY
        : event.changedTouches[0].clientY;
    const deltaY = startY.value - clientY;
    const currentHeight = playerElement.value.offsetHeight;
    const viewportHeight = window.innerHeight;

    const thresholdHidden = viewportHeight * 0.05;
    const thresholdFull = viewportHeight * 0.75;

    let newMode: 'hidden' | 'mini' | 'full';

    if (currentHeight < thresholdHidden) {
      newMode = 'hidden';
    } else if (currentHeight < thresholdFull) {
      if (deltaY > 0) {
        newMode = 'full';
      } else if (deltaY < 0) {
        newMode = 'mini';
      } else {
        newMode =
          Math.abs(currentHeight - HEIGHTS.mini) <
          Math.abs(currentHeight - HEIGHTS.full)
            ? 'mini'
            : 'full';
      }
    } else {
      newMode = 'full';
    }

    animateToMode(newMode);

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', endDrag);
  };

  const isLoadingRecommendation = ref(false);
  const canPlay = ref(false);
  const isLoadingNextTrack = ref(false);

  watch(
    () => userStore.currentTrack,
    newTrack => {
      if (newTrack && playlist.value.length === 0) {
        initializePlaylist();
      } else if (
        newTrack &&
        playlist.value.length > 0 &&
        currentTrackIndex.value < playlist.value.length &&
        playlist.value[currentTrackIndex.value].youtubeId !== newTrack.youtubeId
      ) {
        initializePlaylist();
      }
    },
    { immediate: true },
  );

  watch(currentTrackIndex, () => {
    progress.value = 0;
    duration.value = 0;
    canPlay.value = false;
    isLoadingNextTrack.value = false;

    if (
      youtubePlayer.value &&
      playlist.value.length > 0 &&
      currentTrackIndex.value < playlist.value.length
    ) {
      youtubePlayer.value.loadVideoById(
        playlist.value[currentTrackIndex.value].youtubeId,
      );
    }

    if (
      playlist.value.length > 0 &&
      currentTrackIndex.value < playlist.value.length
    ) {
      const currentTrack = playlist.value[currentTrackIndex.value];
      if (currentTrack) {
        setCurrentMusicToUser({
          youtubeId: currentTrack.youtubeId,
          title: currentTrack.title,
          artist: (currentTrack.artist || '').replace(/VEVO/gi, ''),
          coverUrl:
            currentTrack.coverUrl ||
            `https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`,
        });
      }
    }
  });

  function onYouTubeReady() {
    if (
      youtubePlayer.value &&
      playlist.value.length > 0 &&
      currentTrackIndex.value < playlist.value.length
    ) {
      const videoId = playlist.value[currentTrackIndex.value].youtubeId;
      // youtubePlayer.value.loadVideoById(videoId); // Disabled autoplay

      setTimeout(() => {
        canPlay.value = true;
      }, 500);
    } else {
      canPlay.value = true;
    }
  }

  function play() {
    if (!canPlay.value || !youtubePlayer.value) return;
    if (onMountedMusicLoaded.value === false) {
      const videoId = playlist.value[currentTrackIndex.value].youtubeId;
      youtubePlayer.value.loadVideoById(videoId);
      onMountedMusicLoaded.value = true;
    }
    if (youtubePlayer.value && !isPlaying.value) {
      try {
        youtubePlayer.value.playVideo();
      } catch {
        youtubePlayer.value.play();
      }
      isPlaying.value = true;
      startProgressTimer();
    }
  }

  function pause() {
    console.log(youtubePlayer.value, isPlaying.value);
    console.log(youtubePlayer.value && isPlaying.value);
    if (youtubePlayer.value && isPlaying.value) {
      isPlaying.value = false;
      youtubePlayer.value.pause();
      stopProgressTimer();
    }
  }

  function togglePlay() {
    if (isPlaying.value) pause();
    else play();
  }

  function previousTrack() {
    if (currentTrackIndex.value > 0) currentTrackIndex.value--;
  }

  function nextTrack() {
    if (isLoadingNextTrack.value) return;
    if (currentTrackIndex.value < playlist.value.length - 1) {
      progress.value = 0;
      duration.value = 0;
      stopProgressTimer();
      currentTrackIndex.value++;
      play();
    } else if (!isLoadingRecommendation.value) {
      isLoadingNextTrack.value = true;
      loadNextRecommendation();
    }
  }

  function selectTrack(index: number) {
    currentTrackIndex.value = index;
  }

  function removeFromPlaylist(index: number) {
    if (playlist.value.length <= 1) return;

    playlist.value.splice(index, 1);

    if (index < currentTrackIndex.value) {
      currentTrackIndex.value--;
    } else if (index === currentTrackIndex.value) {
      if (currentTrackIndex.value >= playlist.value.length) {
        currentTrackIndex.value = playlist.value.length - 1;
      }
    }
  }

  function addToPlaylist(track: Track) {
    const exists = playlist.value.some(t => t.youtubeId === track.youtubeId);
    if (!exists) {
      playlist.value.push(track);

      if (
        playlist.value.length === 1 ||
        (isPlaying.value &&
          currentTrackIndex.value === playlist.value.length - 2)
      ) {
        currentTrackIndex.value = playlist.value.length - 1;
      }
    }
  }

  let searchTimeout: NodeJS.Timeout | null = null;

  const performSearch = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      isSearching.value = false;
      return;
    }

    isSearching.value = true;

    searchTimeout = setTimeout(async () => {
      try {
        const params = {
          query: searchQuery.value,
        };
        const response = await useAuthFetch('music/youtube/search', {
          params,
        });
        const rawResults = response.data?.value;
        searchResults.value = (Array.isArray(rawResults) ? rawResults : []).map(
          (item: any) => ({
            youtubeId: item.videoId,
            title: item.title
              .replace(/official video/gi, '')
              .replace(/official music video/gi, '')
              .replace(/lyrics?/gi, '')
              .replace(/[()]/g, '')
              .replace(/[[\]]/g, '')
              .replace(/[{}]/g, '')
              .replace('&#39', ''),
            artist: item.channelTitle.replace(/vevo/gi, ''),
            coverUrl: item.thumbnail,
          }),
        );
      } catch (error) {
        console.error('Search error:', error);
        searchResults.value = [];
      } finally {
        isSearching.value = false;
        searchTimeout = null;
      }
    }, 500);
  };

  function likeTrack(track: Track) {
    try {
      const params = {
        track: track,
      };

      useAuthFetch(`track/like`, {
        method: 'POST',
        body: params,
      });
      checkFavoriteQuantity();
    } catch (error) {
      console.error(error);
    }
  }

  const checkFavoriteQuantity = async () => {
    try {
      const response = await useAuthFetch('music/favorites/quantity');

      favoriteQuantity.value = (response.data.value as { quantity: number })
        ?.quantity as number;
    } catch (err) {
      console.error(
        'An unexpected error occurred while checking favorite quantity:',
        err,
      );
    }
  };

  function handleVolumeChange(newVolume: number) {
    youtubePlayer.value?.setVolume(newVolume);
  }

  let progressTimer: number | null = null;
  const offsetDouble = ref<number>(0);

  async function loadNextRecommendation() {
    console.log('loadNextRecommendation: Function started.');
    if (isLoadingRecommendation.value) {
      console.log(
        'loadNextRecommendation: Already loading recommendation, returning.',
      );
      return;
    }
    isLoadingRecommendation.value = true;
    console.log('loadNextRecommendation: isLoadingRecommendation set to true.');

    try {
      console.log(
        `loadNextRecommendation: Playlist length: ${playlist.value.length}, Current track index: ${currentTrackIndex.value}`,
      );
      if (
        playlist.value.length === 0 ||
        currentTrackIndex.value >= playlist.value.length
      ) {
        console.error(
          'loadNextRecommendation: Cannot load recommendation: playlist is empty or current track index is out of bounds.',
        );
        isLoadingRecommendation.value = false;
        isLoadingNextTrack.value = false;
        return;
      }

      const currentTrack = playlist.value[currentTrackIndex.value];
      console.log('loadNextRecommendation: Current track:', currentTrack);
      const { artist, title } = currentTrack;
      if (!artist || !title) {
        console.error(
          'loadNextRecommendation: Current track is missing artist or title, cannot fetch recommendation.',
        );
        isLoadingRecommendation.value = false;
        isLoadingNextTrack.value = false;
        return;
      }

      const recommendationUrl = `recommendations?artist=${encodeURIComponent(artist.replace(/\s/g, ''))}&track=${encodeURIComponent(title.toLowerCase())}&offset=${offsetDouble.value}`;
      console.log(
        'loadNextRecommendation: Fetching recommendation from URL:',
        recommendationUrl,
      );
      const response = await useAuthFetch(recommendationUrl);

      const recommendation = response.data.value as Track;
      console.log(
        'loadNextRecommendation: Received recommendation:',
        recommendation,
      );

      if (!recommendation) {
        console.log('loadNextRecommendation: No new recommendation received.');
        isLoadingNextTrack.value = false;
        isLoadingRecommendation.value = false;
        return;
      }

      const exists = playlist.value.some(
        track => track.youtubeId === recommendation.youtubeId,
      );
      console.log(
        `loadNextRecommendation: Recommendation already exists in playlist: ${exists}`,
      );
      if (exists) {
        offsetDouble.value++;
        console.log(
          `loadNextRecommendation: Incrementing offsetDouble to ${offsetDouble.value} and retrying.`,
        );
        loadNextRecommendation();
      } else {
        playlist.value.push({
          youtubeId: recommendation.youtubeId,
          title: recommendation.title,
          artist: recommendation.artist.replace(/VEVO/gi, ''),
          coverUrl: recommendation.coverUrl ?? '',
        });
        console.log(
          'loadNextRecommendation: New track added to playlist:',
          recommendation,
        );
        setCurrentMusicToUser(recommendation);
        console.log(
          'loadNextRecommendation: Set current music to user with new recommendation.',
        );

        currentTrackIndex.value = playlist.value.length - 1;
        offsetDouble.value = 0;
        console.log(
          `loadNextRecommendation: Updated currentTrackIndex to ${currentTrackIndex.value} and reset offsetDouble to ${offsetDouble.value}.`,
        );
      }
    } catch (error) {
      console.error(
        'loadNextRecommendation: Error loading recommendations',
        error,
      );
    } finally {
      isLoadingRecommendation.value = false;
      isLoadingNextTrack.value = false;
      console.log(
        'loadNextRecommendation: isLoadingRecommendation and isLoadingNextTrack set to false (finally block).',
      );
    }
  }

  function startProgressTimer() {
    stopProgressTimer();
    if (process.client) {
      progressTimer = window.setInterval(async () => {
        if (
          youtubePlayer.value &&
          playlist.value.length > 0 &&
          currentTrackIndex.value < playlist.value.length
        ) {
          try {
            const currentTime = await youtubePlayer.value.getCurrentTime();
            const totalDuration = await youtubePlayer.value.getDuration();
            if (totalDuration > 0) {
              progress.value = Math.floor(currentTime);
              duration.value = Math.floor(totalDuration);

              if (
                currentTime + 1 >= totalDuration &&
                !isLoadingRecommendation.value &&
                !isLoadingNextTrack.value
              ) {
                nextTrack();
              }
            }
          } catch (error) {
            console.error('Error getting player time:', error);
            stopProgressTimer();
          }
        }
      }, 1000);
    }
  }

  function stopProgressTimer() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function seek(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTime = Number(target.value);
    progress.value = newTime;
    youtubePlayer.value?.seekTo(newTime);
  }

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }

  async function setCurrentMusicToUser(track: Track) {
    if (!track) return;
    try {
      const trackData = {
        youtubeId: track.youtubeId,
        title: track.title,
        artist: (track.artist || '').replace(/VEVO/gi, ''),
        coverUrl:
          track.coverUrl ||
          `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`,
      };

      await useAuthFetch('settings/update-current-track', {
        method: 'POST',
        body: trackData,
      });

      userStore.setCurrentTrack(trackData);
    } catch (error) {
      console.error('Error setting current music:', error);
    }
  }
  function initializePlaylist() {
    if (userStore.currentTrack) {
      const track = {
        youtubeId: userStore.currentTrack.youtubeId,
        title: userStore.currentTrack.title,
        artist: (userStore.currentTrack.artist || '').replace(/VEVO/gi, ''),
        coverUrl:
          userStore.currentTrack.coverUrl ||
          `https://img.youtube.com/vi/${userStore.currentTrack.youtubeId}/hqdefault.jpg`,
      };

      playlist.value = [track];
      currentTrackIndex.value = 0;

      if (youtubePlayer.value) {
        youtubePlayer.value.loadVideoById(track.youtubeId);

        canPlay.value = false;
        setTimeout(() => {
          canPlay.value = true;
        }, 300);
      }
    }
  }

  onMounted(async () => {
    userStore.loadUserFromCookies();

    if (process.client) {
      updateHeightsOnResize();
    }

    if (!userStore.currentTrack) {
      playlist.value = [
        {
          youtubeId: 'dQw4w9WgXcQ',
          title: 'Never Gonna Give You Up',
          coverUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          artist: 'Rick Astley',
        },
      ];
    }

    await nextTick(async () => {
      try {
        const response = await useAuthFetch('settings/current-track', {
          method: 'GET',
        });
        const currentTrack = response.data.value as Track;

        if (currentTrack?.youtubeId) {
          userStore.setCurrentTrack(currentTrack);

          playlist.value = [
            {
              youtubeId: currentTrack.youtubeId,
              title: currentTrack.title,
              artist: currentTrack.artist || '',
              coverUrl:
                currentTrack.coverUrl ||
                `https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`,
            },
          ];
          currentTrackIndex.value = 0;

          if (youtubePlayer.value) {
            youtubePlayer.value.loadVideoById(currentTrack.youtubeId);
          }
        } else if (userStore.currentTrack) {
          initializePlaylist();
        }
      } catch (error) {
        console.error('Error fetching current track:', error);
        if (userStore.currentTrack) {
          initializePlaylist();
        }
      }
    });
  });

  return {
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
    isSearching,
    musicPlayer,
    coverUrl,
    playerMode,
    HEIGHTS,
    isDragging,
    startY,
    startHeight,
    isLoadingRecommendation,
    canPlay,
    isLoadingNextTrack,
    animateToMode,
    togglePlayerMode,
    updateHeightsOnResize,
    startDrag,
    onDrag,
    endDrag,
    onYouTubeReady,
    play,
    pause,
    togglePlay,
    previousTrack,
    nextTrack,
    selectTrack,
    removeFromPlaylist,
    addToPlaylist,
    performSearch,
    likeTrack,
    handleVolumeChange,
    seek,
    formatTime,
    loadNextRecommendation,
    initializePlaylist,
    favoriteQuantity,
    checkFavoriteQuantity,
  };
}
