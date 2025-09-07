<template>
    <div ref="playerElement" class="player flex flex-col" :class="{
        'flex-row': playerMode === 'mini',
        'flex-col': playerMode === 'full'
    }">
        <div ref="dragHandle" class="drag-handle mx-auto mb-1 w-12 h-1.5 rounded bgColorSecondary cursor-pointer"
            @click="togglePlayerMode" @mousedown="startDrag" @touchstart="startDrag"></div>

        <div v-if="playerMode === 'full' && musicPlayer !== undefined"
            class="full-player-content flex-1 overflow-hidden">
            <div class="full-player-layout flex h-full">
                <div class="bgColorWhite w-2/5 p-6 flex flex-col">
                    <div class="flex-1 flex flex-col justify-center items-center text-center bgColorWhite">
                        <div class="current-cover mb-6">
                            <img :src="coverUrl" alt="Album Cover"
                                class="w-64 h-64 rounded-2xl shadow-2xl object-cover mx-auto" />
                        </div>

                        <div class="track-info mb-8">
                            <h1 class="text-3xl font-bold textColorBlack mb-2">{{ musicPlayer.title }}</h1>
                            <h2 class="text-xl textColorTritary mb-1">{{ musicPlayer.artist }}</h2>
                        </div>

                        <div class="full-progress-section w-full max-w-md mb-6">
                            <input type="range" class="track-progress-slider w-full" :value="progress" :max="duration"
                                @input="seek"
                                :style="{ '--progress-percentage': (progress / duration * 100 || 0) + '%' }" />
                            <div class="flex justify-between text-sm textColorBlack mt-2">
                                <span>{{ formatTime(progress) }}</span>
                                <span>{{ formatTime(duration) }}</span>
                            </div>
                        </div>

                        <div class="enhanced-controls flex items-center justify-center space-x-6">
                            <Icon name="ph:shuffle" class="control-icon textColorSecondary" size="24px" />
                            <Icon name="ph:skip-back-fill" class="control-icon textColorSecondary" size="32px"
                                @click="previousTrack" />
                            <button
                                class="play-button-large flex justify-center items-center w-16 h-16 bgColorPrimary rounded-full transition duration-300 shadow-lg"
                                @click.stop="togglePlay();">
                                <Icon :name="isPlaying ? 'ph:pause-bold' : 'ph:play-fill'" class="textColorWhite"
                                    size="24px" />
                            </button>
                            <Icon name="ph:skip-forward-fill" class="control-icon textColorSecondary" size="32px"
                                @click="nextTrack" />
                            <Icon name="ph:repeat" class="control-icon textColorSecondary" size="24px" />
                        </div>
                    </div>
                </div>

                <div class="right-panel w-3/5 flex flex-col globalRadius">
                    <div class="tab-headers mb-3 globalRadius flex bgColorBlack">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'tab-header px-6 py-4 normalFont transition-colors duration-200',
                            activeTab === tab.id
                                ? 'textColorSecondary border-b-2 border-[var(--color-secondary)] bgColorWhite'
                                : 'textColorWhite hover:textColorPrimary hover:bgColorWhite'
                        ]">
                            {{ tab.name }}
                        </button>
                    </div>

                    <div class="tab-content globalRadius flex-1 overflow-hidden bgColorBlack">
                        <div v-if="activeTab === 'library'" class="tab-panel h-full overflow-y-auto p-6">
                            <div v-if="isLoading" class="loading-state text-center py-8">
                                <Icon name="ph:circle-notch" class="textColorSecondary mx-auto mb-4 animate-spin"
                                    size="48px" />
                                <p class="normalFont textColorWhite">Chargement des données...</p>
                            </div>
                            <template v-else>
                                <div v-if="activeLibrarySection === 'categories'" class="library-section">
                                    <h3 class="largeFont mb-4 textColorWhite">Ma Bibliothèque</h3>
                                    <div class="library-categories space-y-3">
                                        <div class="category-item flex items-center p-3 rounded-lg bgColorBlack cursor-pointer hover:border-[var(--color-secondary)] border border-transparent"
                                            @click="displayRecentTracks()">
                                            <Icon name="ph:music-notes-fill" class="textColorSecondary mr-3"
                                                size="20px" />
                                            <span class="normalFont textColorWhite">Titres récents</span>
                                            <span class="ml-auto normalFont textColorTritary">{{ playlist.length
                                                }}</span>
                                        </div>
                                        <div class="category-item flex items-center p-3 rounded-lg bgColorBlack cursor-pointer hover:border-[var(--color-secondary)] border border-transparent"
                                            @click="displayFavoriteTracks()">
                                            <Icon name="ph:heart-fill" class="textColorPrimary mr-3" size="20px" />
                                            <span class="normalFont textColorWhite">Favoris</span>
                                            <span class="ml-auto normalFont textColorTritary">{{ favoriteQuantity
                                                }}</span>
                                        </div>
                                        <div class="category-item flex items-center p-3 rounded-lg bgColorBlack cursor-pointer hover:border-[var(--color-secondary)] border border-transparent"
                                            @click="displayMyPlaylists()">
                                            <Icon name="ph:playlist-fill" class="textColorCategoryTritary mr-3"
                                                size="20px" />
                                            <span class="normalFont textColorWhite">Mes Playlists</span>
                                            <span class="ml-auto normalFont textColorTritary">{{ playlistQuantity
                                                }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="activeLibrarySection === 'recent'" class="library-recent-tracks">
                                    <div class="flex justify-between items-center mb-6">
                                        <h3 class="largeFont textColorWhite">Titres récents</h3>
                                        <button
                                            class="miniFont textColorPrimary hover:textColorSecondary transition-colors duration-200 flex justify-center items-center"
                                            @click="goToLibraryCategories">
                                            <Icon name="ph:arrow-left" class="mr-1" size="24px" />
                                            Retour
                                            à la bibliothèque
                                        </button>
                                    </div>
                                    <div class="playlist-items space-y-2">
                                        <div v-for="(track, index) in playlist" :key="index" :class="[
                                            'playlist-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200',
                                            index === currentTrackIndex
                                                ? 'bg-opacity-20 bgColorSecondary border border-[var(--color-secondary)]'
                                                : 'bg-opacity-10 hover:bg-opacity-20 bgColorBlack hover:bgColorSecondary border border-transparent hover:border-[var(--color-secondary)]'
                                        ]" @click="currentTrackIndex = index">
                                            <div class="track-number w-8 text-center">
                                                <span v-if="index === currentTrackIndex && isPlaying"
                                                    class="textColorPrimary">
                                                    <Icon name="ph:play-fill" size="16px" />
                                                </span>
                                                <span v-else class="textColorWhite miniFont">{{ index + 1 }}</span>
                                            </div>
                                            <img :src="`https://img.youtube.com/vi/${track.youtubeId}/default.jpg`"
                                                alt="Track cover"
                                                class="w-12 h-12 rounded-lg mr-4 object-cover border border-[var(--color-secondary)]" />
                                            <div class="track-details flex-1 min-w-0">
                                                <div class="track-name normalFont textColorWhite truncate">{{
                                                    track.title }}</div>
                                                <div class="track-artist miniFont textColorTritary truncate">{{
                                                    track.artist }}</div>
                                            </div>
                                            <div class="track-actions flex items-center space-x-2">
                                                <Icon
                                                    :name="favoriteTracks.some(favorite => favorite.track.youtubeId === track.youtubeId) ? 'ph:heart-fill' : 'ph:heart'"
                                                    class="textColorWhite hover:textColorPrimary cursor-pointer transition-colors duration-200"
                                                    size="18px" @click.stop="likeTrack(track)" />
                                                <Icon name="ph:dots-three-vertical"
                                                    class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                                                    size="32px" @click.stop="openTrackOptionsMenu(track, $event)" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="playlist.length === 0"
                                        class="empty-state text-center py-8 textColorTritary">
                                        <Icon name="ph:music-note-bold" class="mx-auto mb-4" size="48px" />
                                        <p class="normalFont">Aucun titre récent dans la file d'attente.</p>
                                    </div>
                                </div>

                                <div v-else-if="activeLibrarySection === 'favorites'" class="library-favorites-tracks">
                                    <div class="flex justify-between items-center mb-6">
                                        <h3 class="largeFont textColorWhite">Favoris</h3>
                                        <button
                                            class="miniFont textColorPrimary hover:textColorSecondary transition-colors duration-200 flex justify-center items-center"
                                            @click="goToLibraryCategories">
                                            <Icon name="ph:arrow-left" class="mr-1" size="16px" /> Retour
                                            à la bibliothèque
                                        </button>
                                    </div>
                                    <div class="playlist-items space-y-2">
                                        <div v-for="(favoriteTrack, index) in favoriteTracks" :key="index"
                                            class="playlist-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 bg-opacity-10 hover:bg-opacity-20 bgColorBlack hover:bgColorSecondary border border-transparent hover:border-[var(--color-secondary)]"
                                            @click="addToPlaylist(favoriteTrack.track)">
                                            <div class="track-number w-8 text-center">
                                                <span class="textColorWhite miniFont">{{ index + 1 }}</span>
                                            </div>
                                            <img :src="`https://img.youtube.com/vi/${favoriteTrack.track.youtubeId}/default.jpg`"
                                                alt="Track cover"
                                                class="w-12 h-12 rounded-lg mr-4 object-cover border border-[var(--color-secondary)]" />
                                            <div class="track-details flex-1 min-w-0">
                                                <div class="track-name normalFont textColorWhite truncate">{{
                                                    favoriteTrack.track.title }}</div>
                                                <div class="track-artist miniFont textColorTritary truncate">{{
                                                    favoriteTrack.track.artist }}</div>
                                            </div>
                                            <div class="track-actions flex items-center space-x-2">
                                                <Icon name="ph:heart-fill" class="textColorPrimary cursor-pointer"
                                                    size="18px" @click.stop="likeTrack(favoriteTrack.track)" />
                                                <Icon name="ph:dots-three-vertical"
                                                    class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                                                    size="32px"
                                                    @click.stop="openTrackOptionsMenu(favoriteTrack.track, $event)" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="favoriteTracks.length === 0"
                                        class="empty-state text-center py-8 textColorTritary">
                                        <Icon name="ph:heart-fill" class="textColorPrimary mx-auto mb-4" size="48px" />
                                        <p class="normalFont">Vous n'avez pas encore de favoris.</p>
                                    </div>
                                </div>

                                <div v-else-if="activeLibrarySection === 'playlist-tracks'"
                                    class="library-playlist-tracks">
                                    <div class="flex justify-between items-center mb-6">
                                        <h3 class="largeFont textColorWhite">{{ selectedPlaylist?.name }}
                                        </h3>
                                        <button
                                            class="flex justify-center items-center miniFont textColorPrimary hover:textColorSecondary transition-colors duration-200"
                                            @click="activeLibrarySection = 'playlists'">
                                            <Icon name="ph:arrow-left" class="mr-1" size="16px" /> Retour
                                            aux playlists
                                        </button>
                                    </div>
                                    <div v-if="playlistTracks.length === 0 && !isLoading"
                                        class="empty-state text-center py-8 textColorTritary">
                                        <Icon name="ph:music-note" class="mx-auto mb-4" size="48px" />
                                        <p class="normalFont">Cette playlist ne contient pas encore de
                                            musiques.</p>
                                    </div>
                                    <div v-else-if="isLoading" class="empty-state text-center py-8 textColorTritary">
                                        <p class="normalFont">Chargement des musiques...</p>
                                    </div>
                                    <div class="playlist-items space-y-2">
                                        <div v-for="(track, index) in playlistTracks" :key="track.youtubeId"
                                            class="playlist-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 bg-opacity-10 hover:bg-opacity-20 bgColorBlack hover:bgColorSecondary border border-transparent hover:border-[var(--color-secondary)]"
                                            @click="addToPlaylist(track)">
                                            <div class="track-number w-8 text-center">
                                                <span class="textColorWhite miniFont">{{ index + 1 }}</span>
                                            </div>
                                            <img :src="track.coverUrl || `https://img.youtube.com/vi/${track.youtubeId}/default.jpg`"
                                                alt="Track Cover" class="w-12 h-12 rounded mr-3 object-cover" />
                                            <div class="track-details flex-1 min-w-0">
                                                <div class="track-name normalFont textColorWhite truncate">
                                                    {{ track.title }}</div>
                                                <div class="track-artist miniFont textColorTritary truncate">
                                                    {{ track.artist }}</div>
                                            </div>
                                            <div class="track-actions flex items-center space-x-4">
                                                <Icon
                                                    :name="favoriteTracks.some(favorite => favorite.track.youtubeId === track.youtubeId) ? 'ph:heart-fill' : 'ph:heart'"
                                                    class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                                                    size="20px" @click.stop="likeTrack(track)" />
                                                <Icon name="ph:dots-three-vertical"
                                                    class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                                                    size="32px" @click.stop="openTrackOptionsMenu(track, $event)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="activeLibrarySection === 'playlists'" class="library-playlists">
                                    <div class="flex justify-between items-center mb-6">
                                        <div class="flex items-center">
                                            <h3 class="largeFont textColorWhite">Mes Playlists</h3>
                                        </div>
                                        <button
                                            class="miniFont textColorPrimary hover:textColorSecondary transition-colors duration-200 flex justify-center items-center"
                                            @click="goToLibraryCategories">
                                            <Icon name="ph:arrow-left" class="mr-1" size="16px" /> Retour
                                            à la bibliothèque
                                        </button>
                                    </div>
                                    <div v-if="playlists.length === 0"
                                        class="empty-state text-center py-8 textColorTritary">
                                        <Icon name="ph:playlist-bold" class="mx-auto mb-4" size="48px" />
                                        <p class="normalFont mb-3">Vous n'avez pas encore créé de playlists.</p>
                                        <div class="flex justify-center scale-125">
                                            <PlaylistForm @playlist-created="fetchPlaylists" />
                                        </div>
                                    </div>
                                    <div v-else class="playlist-items space-y-2">
                                        <div v-for="(playlistItem, index) in playlists" :key="playlistItem.id"
                                            class="playlist-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 bg-opacity-10 hover:bg-opacity-20 bgColorBlack hover:bgColorSecondary"
                                            @click="openPlaylist(playlistItem)">
                                            <div class="playlist-number w-8 text-center">
                                                <span class="textColorWhite miniFont">{{ index + 1 }}</span>
                                            </div>
                                            <Icon name="ph:playlist-bold" class="textColorCategoryTritary mr-3"
                                                size="32px" />
                                            <div class="playlist-details flex-1 min-w-0">
                                                <div class="playlist-name normalFont textColorWhite truncate">{{
                                                    playlistItem.name }}</div>
                                                <div class="playlist-track-count miniFont textColorTritary truncate">{{
                                                    playlistItem.tracks.length }} titres</div>
                                            </div>
                                            <div class="playlist-actions flex items-center space-x-2">
                                                <Icon name="ph:dots-three-vertical"
                                                    class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                                                    size="32px"
                                                    @click.stop="openPlaylistOptionsMenu(playlistItem, $event)" />
                                            </div>
                                        </div>
                                        <div class="ml-3 scale-90 flex justify-center items-center">
                                            <PlaylistForm v-if="playlists.length > 0"
                                                @playlist-created="fetchPlaylists" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div v-if="activeTab === 'queue'" class="tab-panel h-full overflow-y-auto p-6">
                            <div class="playlist-header flex justify-between items-center mb-6">
                                <h3 class="largeFont textColorWhite">File d'attente</h3>
                                <button
                                    class="miniFont textColorPrimary hover:textColorSecondary transition-colors duration-200">
                                    Effacer tout
                                </button>
                            </div>

                            <div class="playlist-items space-y-2">
                                <div v-for="(track, index) in playlist" :key="index" :class="[
                                    'playlist-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200',
                                    index === currentTrackIndex
                                        ? 'bg-opacity-20 bgColorSecondary border border-[var(--color-secondary)]'
                                        : 'bg-opacity-10 hover:bg-opacity-20 bgColorBlack hover:bgColorSecondary border border-transparent hover:border-[var(--color-secondary)]'
                                ]" @click="currentTrackIndex = index">
                                    <div class="track-number w-8 text-center">
                                        <span v-if="index === currentTrackIndex && isPlaying" class="textColorPrimary">
                                            <Icon name="solar:play-bold" size="16px" />
                                        </span>
                                        <span v-else class="textColorWhite miniFont">{{ index + 1 }}</span>
                                    </div>

                                    <img :src="`https://img.youtube.com/vi/${track.youtubeId}/default.jpg`"
                                        alt="Track cover"
                                        class="w-12 h-12 rounded-lg mr-4 object-cover border border-[var(--color-secondary)]" />

                                    <div class="track-details flex-1 min-w-0">
                                        <div class="track-name normalFont textColorWhite truncate">{{ track.title }}
                                        </div>
                                        <div class="track-artist miniFont textColorTritary truncate">{{ track.artist }}
                                        </div>
                                    </div>

                                    <div class="track-actions flex items-center space-x-2">
                                        <Icon
                                            :name="favoriteTracks.some(favorite => favorite.track.youtubeId === track.youtubeId) ? 'solar:heart-fill' : 'solar:heart'"
                                            class="textColorWhite hover:textColorPrimary cursor-pointer transition-colors duration-200"
                                            size="18px" @click.stop="likeTrack(track)" />
                                        <Icon name="entypo:dots-three-vertical"
                                            class="textColorWhite hover:textColorSecondary cursor-pointer transition-colors duration-200"
                                            size="32px" @click.stop="openTrackOptionsMenu(track, $event)" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="activeTab === 'search'" class="tab-panel h-full overflow-y-auto p-6">
                            <div class="search-section">
                                <h3 class="largeFont mb-4 textColorWhite">Rechercher</h3>

                                <div class="search-input-container mb-6">
                                    <div class="relative">
                                        <Icon name="ph:magnifying-glass"
                                            class="absolute left-3 top-1/2 transform -translate-y-1/2 textColorSecondary"
                                            size="20px" />
                                        <input v-model="searchQuery" type="text"
                                            placeholder="Rechercher des titres, artistes, albums..."
                                            class="w-full pl-10 pr-4 py-3 border border-[var(--color-secondary)] bgColorBlack textColorWhite rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                                            @input="performSearch()" />
                                    </div>
                                </div>

                                <div v-if="isLoading" class="loading-state text-center py-8">
                                    <Icon name="ph:circle-notch" class="textColorSecondary mx-auto mb-4 animate-spin"
                                        size="48px" />
                                    <p class="normalFont textColorWhite">Recherche en cours...</p>
                                </div>

                                <div v-else-if="searchResults.length > 0" class="search-results">
                                    <h4 class="normalFont mb-3 textColorWhite">Résultats</h4>
                                    <div class="search-items space-y-2">
                                        <div v-for="(result, index) in searchResults" :key="index"
                                            class="search-item flex items-center p-3 rounded-lg bgColorBlack border border-[var(--color-secondary)] hover:border-[var(--color-primary)] cursor-pointer transition-all duration-200">
                                            <img :src="`https://img.youtube.com/vi/${result.youtubeId}/default.jpg`"
                                                alt="Track cover"
                                                class="w-12 h-12 rounded-lg mr-4 object-cover border border-[var(--color-tritary)]" />
                                            <div class="result-details flex-1 min-w-0">
                                                <div class="result-name normalFont textColorWhite truncate">{{
                                                    result.title }}</div>
                                                <div class="result-artist miniFont textColorTritary truncate">{{
                                                    result.artist }}</div>
                                            </div>
                                            <button
                                                class="add-button px-3 py-1 miniFont bgColorPrimary textColorWhite rounded-lg hover:bgColorSecondary transition-colors duration-200"
                                                @click="addToPlaylist(result)">
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div v-else-if="searchQuery" class="empty-search text-center py-8">
                                    <Icon name="ph:magnifying-glass" class="textColorSecondary mx-auto mb-4"
                                        size="48px" />
                                    <p class="normalFont textColorWhite">Aucun résultat trouvé</p>
                                </div>

                                <div v-else class="search-suggestions">
                                    <h4 class="normalFont mb-3 textColorWhite">Suggestions</h4>
                                    <div class="suggestion-tags flex flex-wrap gap-2">
                                        <span v-for="suggestion in suggestions" :key="suggestion"
                                            class="suggestion-tag px-3 py-2 bgColorBlack border border-[var(--color-secondary)] rounded-full miniFont textColorWhite cursor-pointer hover:bgColorSecondary transition-all duration-200"
                                            @click="() => { searchQuery = suggestion; performSearch(); }">
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

        <div v-show="playerMode !== 'hidden' && playerMode !== 'full'" v-if="musicPlayer !== undefined"
            class="mini-player flex flex-row items-center w-full px-4" style="flex: none">
            <div class="cover w-16 h-16 mr-4 flex-shrink-0">
                <img class="coverImage w-full h-full object-cover" :src="coverUrl" alt="current music cover" />
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
                    <Icon name="ph:skip-back-fill" class="musicControls textColorSecondary" size="200%"
                        @click="previousTrack" />
                    <span
                        class="playButton flex justify-center items-center p-2.5 bgColorPrimary rounded-full transition duration-300"
                        @click.stop="togglePlay">
                        <Icon :name="isPlaying ? 'ph:pause-fill' : 'ph:play-fill'" style="color: var(--color-white)" />
                    </span>
                    <Icon name="ph:skip-forward-fill" class="musicControls textColorSecondary" size="200%"
                        @click="nextTrack" />
                    <Icon class="likeButton textColorSecondary hover:textColorPrimary transition duration-300"
                        :name="favoriteTracks.some(favorite => favorite.track.youtubeId === musicPlayer?.youtubeId) ? 'ph:heart-fill' : 'ph:heart'"
                        size="200%" @click="likeTrack(musicPlayer)" />
                </div>

                <div class="currentMusicProgress flex items-center space-x-4 flex-grow mx-2">
                    <input type="range" class="track-progress-slider flex-1" :value="progress" :max="duration"
                        @input="seek" :style="{ '--progress-percentage': (progress / duration * 100 || 0) + '%' }" />
                    <div class="time text-sm textColorBlack whitespace-nowrap">
                        {{ formatTime(progress) }}/{{ formatTime(duration) }}
                    </div>
                </div>

                <div class="rightControls flex items-center space-x-4">
                    <VolumeControl @volume-change="handleVolumeChange" />
                    <div class="threeDotsMenu relative" ref="menuRef">
                        <Icon ref="threeDotsRef" name="ph:dots-three-vertical" size="32px"
                            class="threedots textColorSecondary hover:textColorPrimary transition duration-300"
                            @click="isMenuOpen = !isMenuOpen" />
                        <Teleport to="body">
                            <div v-if="isMenuOpen"
                                class="dropdown-menu fixed w-52 bgColorBlack border-2 border-[var(--color-secondary)] rounded-lg shadow-lg z-50 py-2 animate-fadeIn">
                                <div class="px-4 py-3 normalFont textColorWhite hover:bgColorSecondary hover:bg-opacity-20 cursor-pointer transition-colors duration-200 flex items-center gap-3"
                                    @click="openPlaylistModal">
                                    <Icon name="ph:list-plus" size="20px" class="textColorPrimary" />
                                    <span>Ajouter à une playlist</span>
                                </div>
                            </div>
                        </Teleport>
                    </div>
                </div>
            </div>
        </div>

        <YouTubeAudioPlayer ref="youtubePlayer" :youtubeId="currentYoutubeId" @ready="onYouTubeReady" />
    </div>

    <Teleport to="body">
        <div v-if="showPlaylistModal"
            class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                class="bgColorBlack rounded-lg border-2 border-[var(--color-secondary)] shadow-xl w-full max-w-md mx-4 animate-modal-fade-in">
                <div class="p-5 border-b-2 border-[var(--color-secondary)] flex justify-between items-center">
                    <h2 class="largeFont textColorWhite">Ajouter à une playlist</h2>
                    <button @click="showPlaylistModal = false"
                        class="textColorSecondary hover:textColorPrimary transition-colors">
                        <Icon name="ph:x-square" size="24px" />
                    </button>
                </div>
                <div v-if="addingTrackStatus === 'success'"
                    class="py-10 px-8 flex flex-col items-center justify-center">
                    <Icon name="ph:check-circle" class="textColorCategoryTritary mb-5" size="64px" />
                    <p class="textColorWhite normalFont text-center">Titre ajouté à la playlist avec succès!</p>
                </div>
                <div v-else-if="isLoadingPlaylists || addingTrackStatus === 'loading'"
                    class="flex justify-center items-center p-8">
                    <div class="loader"></div>
                </div>
                <div v-else-if="userPlaylists.length === 0" class="p-4 py-8 text-center">
                    <p class="textColorTritary normalFont">Vous n'avez pas encore créé de playlist</p>
                    <div v-if="showNewPlaylistInput" class="mt-4">
                        <input v-model="newPlaylistName"
                            class="w-full p-2 mb-3 bgColorBlack border-2 border-[var(--color-secondary)] rounded-lg textColorWhite"
                            placeholder="Nom de la playlist" @keyup.enter="createNewPlaylist" />
                        <div class="flex space-x-2">
                            <button @click="createNewPlaylist"
                                class="px-4 py-2 bgColorPrimary textColorWhite rounded-lg hover:bgColorSecondary transition-colors normalFont">
                                Créer
                            </button>
                            <button @click="showNewPlaylistInput = false"
                                class="px-4 py-2 bgColorTritary textColorWhite rounded-lg hover:bgColorSecondary transition-colors normalFont">
                                Annuler
                            </button>
                        </div>
                    </div>
                    <button v-else @click="showNewPlaylistInput = true"
                        class="mt-4 px-4 py-2 bgColorPrimary textColorWhite rounded-lg hover:bgColorSecondary transition-colors normalFont">
                        Créer une playlist
                    </button>
                </div>
                <div v-else class="p-5">
                    <div class="max-h-80 overflow-y-auto custom-scrollbar">
                        <div v-for="(playlist, i) in userPlaylists" :key="i"
                            class="playlist-item flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bgColorSecondary hover:bg-opacity-20 border-2 border-transparent hover:border-[var(--color-secondary)] mb-3"
                            :class="{ 'opacity-50 pointer-events-none': addingTrackStatus === 'loading' }"
                            @click="addTrackToPlaylist(playlist.id)">
                            <div
                                class="w-12 h-12 rounded-lg bgColorBlack border-2 border-[var(--color-secondary)] flex items-center justify-center mr-4">
                                <Icon name="ph:playlist" class="textColorPrimary" size="24px" />
                            </div>
                            <div>
                                <div class="textColorWhite normalFont font-medium">{{ playlist.name }}</div>
                                <div class="miniFont textColorTritary mt-1">{{ playlist.tracks ? playlist.tracks.length
                                    : 0
                                }}
                                    titres</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="addingTrackStatus === 'error'"
                        class="mt-5 p-4 bgColorCategoryQuaternary bg-opacity-20 border-2 border-[var(--color-category-quaternary)] rounded-lg">
                        <p class="textColorCategoryQuaternary miniFont">Une erreur est survenue. Veuillez réessayer.</p>
                    </div>
                </div>
                <div class="p-5 border-t-2 border-[var(--color-secondary)] flex justify-end"
                    v-if="addingTrackStatus !== 'success' && addingTrackStatus !== 'loading'">
                    <button @click="showPlaylistModal = false"
                        class="px-6 py-2 textColorWhite bgColorTritary rounded-lg hover:bgColorSecondary transition-colors normalFont">
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="showTrackOptionsMenu && selectedTrackForMenu" ref="trackOptionsMenuRef"
            class="dropdown-menu fixed w-52 bgColorBlack border-2 border-[var(--color-secondary)] rounded-lg shadow-lg z-50 py-2 animate-fadeIn">
            <div class="px-4 py-3 normalFont textColorWhite hover:bgColorSecondary hover:bg-opacity-20 cursor-pointer transition-colors duration-200 flex items-center gap-3"
                @click="openPlaylistModalForTrack(selectedTrackForMenu)">
                <Icon name="ph:list-plus" size="20px" class="textColorPrimary" />
                <span>Ajouter à une playlist</span>
            </div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="showPlaylistOptionsMenu && selectedPlaylistForMenu" ref="playlistOptionsMenuRef"
            class="dropdown-menu fixed w-52 bgColorBlack border-2 border-[var(--color-secondary)] rounded-lg shadow-lg z-50 py-2 animate-fadeIn">
            <div class="px-4 py-3 normalFont textColorWhite hover:bgColorSecondary hover:bg-opacity-20 cursor-pointer transition-colors duration-200 flex items-center gap-3"
                @click="editPlaylist(selectedPlaylistForMenu)">
                <Icon name="ph:pencil-simple" size="20px" class="textColorPrimary" />
                <span>Modifier</span>
            </div>
            <div class="px-4 py-3 normalFont textColorWhite hover:bgColorCategoryQuaternary hover:bg-opacity-20 cursor-pointer transition-colors duration-200 flex items-center gap-3"
                @click="openRemovePlaylistModal(selectedPlaylistForMenu)">
                <Icon name="ph:trash" size="20px" class="textColorCategoryQuaternary" />
                <span>Supprimer</span>
            </div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="showRemovePlaylistModal"
            class="z999 fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                class="z999 bgColorBlack rounded-lg border-2 border-[var(--color-secondary)] shadow-xl w-full max-w-md mx-4 animate-modal-fade-in">
                <div class="p-5 border-b-2 border-[var(--color-secondary)] flex justify-between items-center">
                    <h2 class="largeFont textColorWhite">Supprimer la playlist</h2>
                    <button @click="showRemovePlaylistModal = false"
                        class="textColorSecondary hover:textColorPrimary transition-colors">
                        <Icon name="ph:x-square" size="24px" />
                    </button>
                </div>
                <div v-if="deletePlaylistStatus === 'success'"
                    class="py-10 px-8 flex flex-col items-center justify-center">
                    <Icon name="ph:check-circle" class="textColorCategoryTritary mb-5" size="64px" />
                    <p class="textColorWhite normalFont text-center">Playlist supprimée avec succès!</p>
                </div>
                <div v-else-if="deletePlaylistStatus === 'loading'" class="flex justify-center items-center p-8">
                    <div class="loader"></div>
                </div>
                <div v-else class="p-5">
                    <p class="textColorWhite normalFont mb-6 text-center">
                        Êtes-vous sûr de vouloir supprimer la playlist "<span class="font-semibold">{{
                            playlistToDelete?.name }}</span>" ?
                        Cette action est irréversible.
                    </p>
                    <div v-if="deletePlaylistStatus === 'error'"
                        class="mt-5 p-4 bgColorCategoryQuaternary bg-opacity-20 border-2 border-[var(--color-category-quaternary)] rounded-lg">
                        <p class="textColorCategoryQuaternary miniFont">Une erreur est survenue lors de la suppression.
                            Veuillez réessayer.</p>
                    </div>
                </div>
                <div class="p-5 border-t-2 border-[var(--color-secondary)] flex justify-end gap-3"
                    v-if="deletePlaylistStatus !== 'success' && deletePlaylistStatus !== 'loading'">
                    <button @click="showRemovePlaylistModal = false"
                        class="px-6 py-2 textColorWhite bgColorTritary rounded-lg hover:bgColorSecondary transition-colors normalFont">
                        Annuler
                    </button>
                    <button @click="confirmDeletePlaylist"
                        class="px-6 py-2 textColorWhite bg-red-600 rounded-lg hover:bg-red-700 transition-colors normalFont">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

    <Teleport to="body">
        <div v-if="showEditPlaylistModal"
            class="z999 fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                class="z999 bgColorBlack rounded-lg border-2 border-[var(--color-secondary)] shadow-xl w-full max-w-md mx-4 animate-modal-fade-in">
                <div class="p-5 border-b-2 border-[var(--color-secondary)] flex justify-between items-center">
                    <h2 class="largeFont textColorWhite">Modifier la playlist</h2>
                    <button @click="closeEditPlaylistModal"
                        class="textColorSecondary hover:textColorPrimary transition-colors">
                        <Icon name="ph:x-square" size="24px" />
                    </button>
                </div>
                <div v-if="editPlaylistStatus === 'success'"
                    class="py-10 px-8 flex flex-col items-center justify-center">
                    <Icon name="ph:check-circle" class="textColorCategoryTritary mb-5" size="64px" />
                    <p class="textColorWhite normalFont text-center">Playlist modifiée avec succès!</p>
                </div>
                <div v-else class="p-5">
                    <form @submit.prevent="confirmEditPlaylist" class="space-y-4">
                        <div class="form-group">
                            <label for="edit-playlist-name" class="textColorWhite block mb-2">Nom de la playlist</label>
                            <input id="edit-playlist-name" v-model="editingPlaylistName" type="text"
                                class="w-full p-2 rounded-md bg-[#1A1A1A] border-0 textColorWhite focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                                placeholder="Nouveau nom de la playlist" autofocus />
                            <p v-if="editPlaylistError" class="text-red-500 text-sm mt-1">{{ editPlaylistError }}</p>
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button type="button" @click="closeEditPlaylistModal"
                                class="px-4 py-2 rounded-md border-0 bg-[#2A2A2A] textColorWhite hover:bg-[#3A3A3A] transition-colors duration-200">
                                Annuler
                            </button>
                            <button type="submit"
                                class="px-4 py-2 rounded-md bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] textColorWhite hover:opacity-90 transition-opacity duration-200"
                                :disabled="isUpdatingPlaylist">
                                {{ isUpdatingPlaylist ? 'Modification...' : 'Modifier' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, type Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import VolumeControl from '~/components/dashboard/musicModule/VolumeControl.vue'
import YouTubeAudioPlayer from '~/components/dashboard/musicModule/YoutubeAudioPlayer.vue'
import type { Track } from '~/types/Track'
import useAuthFetch from '~/composables/useAuthFetch'


const isMenuOpen = ref(false)
const menuRef = ref(null)
const threeDotsRef = ref(null)

const showPlaylistModal = ref(false)
const newPlaylistName = ref('')
const showNewPlaylistInput = ref(false)

const userPlaylists = ref<typeof playlists.value>([])
const isLoadingPlaylists = ref(false)
const addingTrackStatus = ref<string | null>(null)

const showTrackOptionsMenu = ref(false);
const trackOptionsMenuRef = ref(null);
const trackMenuAnchorEl = ref<HTMLElement | null>(null);
const selectedTrackForMenu = ref<Track | null>(null);

const showPlaylistOptionsMenu = ref(false);
const playlistOptionsMenuRef = ref(null);
const playlistMenuAnchorEl = ref<HTMLElement | null>(null);
const selectedPlaylistForMenu = ref<typeof playlists.value[0] | null>(null);

const selectedTrackForModal = ref<Track | null>(null);

const showRemovePlaylistModal = ref(false);
const playlistToDelete = ref<typeof playlists.value[0] | null>(null);
const deletePlaylistStatus = ref<string | null>(null);

const showEditPlaylistModal = ref(false);
const editingPlaylistName = ref('');
const editPlaylistError = ref('');
const isUpdatingPlaylist = ref(false);
const editPlaylistStatus = ref<string | null>(null);


onClickOutside(menuRef, () => {
    isMenuOpen.value = false
})

onClickOutside(trackOptionsMenuRef, () => {
    showTrackOptionsMenu.value = false;
    selectedTrackForMenu.value = null;
    trackMenuAnchorEl.value = null;
});

onClickOutside(playlistOptionsMenuRef, () => {
    showPlaylistOptionsMenu.value = false;
    selectedPlaylistForMenu.value = null;
    playlistMenuAnchorEl.value = null;
});


const updateDropdownPosition = () => {
    if (isMenuOpen.value && threeDotsRef.value) {
        nextTick(() => {
            const menuElement = document.querySelector('.dropdown-menu') as HTMLElement
            if (menuElement && threeDotsRef.value) {
                const rect = (threeDotsRef.value as { $el: HTMLElement }).$el.getBoundingClientRect()
                menuElement.style.right = `${window.innerWidth - rect.right}px`
                menuElement.style.bottom = `${window.innerHeight - rect.top + 10}px`
            }
        })
    }
}

const updateTrackOptionsMenuPosition = () => {
    if (showTrackOptionsMenu.value && trackMenuAnchorEl.value) {
        nextTick(() => {
            const menuElement = trackOptionsMenuRef.value as unknown as HTMLElement;
            if (menuElement) {
                const rect = trackMenuAnchorEl.value?.getBoundingClientRect();
                if (rect) {
                    menuElement.style.right = `${window.innerWidth - rect.right}px`;

                    let topPosition = rect.bottom + 5;
                    if (topPosition + menuElement.offsetHeight > window.innerHeight) {
                        topPosition = rect.top - menuElement.offsetHeight - 5;
                        if (topPosition < 0) {
                            topPosition = 0;
                        }
                    }
                    menuElement.style.top = `${topPosition}px`;
                }
            }
        });
    }
};

const updatePlaylistOptionsMenuPosition = () => {
    if (showPlaylistOptionsMenu.value && playlistMenuAnchorEl.value) {
        nextTick(() => {
            const menuElement = playlistOptionsMenuRef.value as unknown as HTMLElement;
            if (menuElement) {
                const rect = playlistMenuAnchorEl.value?.getBoundingClientRect();
                if (rect) {
                    menuElement.style.right = `${window.innerWidth - rect.right}px`;
                    let topPosition = rect.bottom + 5;
                    if (topPosition + menuElement.offsetHeight > window.innerHeight) {
                        topPosition = rect.top - menuElement.offsetHeight - 5;
                        if (topPosition < 0) {
                            topPosition = 0;
                        }
                    }
                    menuElement.style.top = `${topPosition}px`;
                }

            }
        });
    }
};

watch(isMenuOpen, updateDropdownPosition)
watch(showTrackOptionsMenu, updateTrackOptionsMenuPosition);
watch(showPlaylistOptionsMenu, updatePlaylistOptionsMenuPosition);


const openPlaylistModal = async () => {
    isMenuOpen.value = false;
    selectedTrackForModal.value = musicPlayer.value ?? null;
    showPlaylistModal.value = true;
    await fetchUserPlaylists();
};

const openTrackOptionsMenu = (track: Track, event: MouseEvent) => {
    selectedTrackForMenu.value = track;
    trackMenuAnchorEl.value = event.currentTarget as HTMLElement;
    showTrackOptionsMenu.value = true;
    isMenuOpen.value = false;
    showPlaylistOptionsMenu.value = false;
};

const openPlaylistOptionsMenu = (playlistItem: typeof playlists.value[0], event: MouseEvent) => {
    selectedPlaylistForMenu.value = playlistItem;
    playlistMenuAnchorEl.value = event.currentTarget as HTMLElement;
    showPlaylistOptionsMenu.value = true;
    isMenuOpen.value = false;
    showTrackOptionsMenu.value = false;
};


const editPlaylist = (playlistItem: typeof playlists.value[0] | null) => {
    if (!playlistItem) return;
    selectedPlaylistForMenu.value = playlistItem;
    editingPlaylistName.value = playlistItem.name;
    editPlaylistError.value = '';
    isUpdatingPlaylist.value = false;
    editPlaylistStatus.value = null;
    showPlaylistOptionsMenu.value = false;
    showEditPlaylistModal.value = true;
};

const closeEditPlaylistModal = () => {
    showEditPlaylistModal.value = false;
    selectedPlaylistForMenu.value = null;
    editingPlaylistName.value = '';
    editPlaylistError.value = '';
    isUpdatingPlaylist.value = false;
    editPlaylistStatus.value = null;
};

const confirmEditPlaylist = async () => {
    if (!selectedPlaylistForMenu.value) return;
    if (!editingPlaylistName.value.trim()) {
        editPlaylistError.value = 'Veuillez entrer un nom de playlist';
        return;
    }

    editPlaylistError.value = '';
    isUpdatingPlaylist.value = true;
    editPlaylistStatus.value = 'loading';

    try {
        await updatePlaylist(selectedPlaylistForMenu.value.id, editingPlaylistName.value.trim());
        editPlaylistStatus.value = 'success';
        await fetchPlaylists();
        setTimeout(() => {
            closeEditPlaylistModal();
        }, 1500);
    } catch (error) {
        console.error('Error updating playlist:', error);
        editPlaylistError.value = 'Échec de la mise à jour de la playlist. Veuillez réessayer.';
        editPlaylistStatus.value = 'error';
    } finally {
        isUpdatingPlaylist.value = false;
    }
};


const openRemovePlaylistModal = (playlistItem: typeof playlists.value[0] | null) => {
    if (!playlistItem) return;
    playlistToDelete.value = playlistItem;
    showPlaylistOptionsMenu.value = false;
    showRemovePlaylistModal.value = true;
    deletePlaylistStatus.value = null;
};

const confirmDeletePlaylist = async () => {
    if (!playlistToDelete.value) return;

    deletePlaylistStatus.value = 'loading';
    try {
        await useAuthFetch(`music/playlist/remove/${playlistToDelete.value.id}`, {
            method: 'DELETE',
        });
        deletePlaylistStatus.value = 'success';
        await fetchPlaylists();
        await checkPlaylistQuantity();
        setTimeout(() => {
            showRemovePlaylistModal.value = false;
            playlistToDelete.value = null;
            deletePlaylistStatus.value = null;
        }, 1500);
    } catch (error) {
        console.error('Error deleting playlist:', error);
        deletePlaylistStatus.value = 'error';
    }
};


const openPlaylistModalForTrack = async (track: Track) => {
    selectedTrackForModal.value = track;
    showTrackOptionsMenu.value = false;
    showPlaylistModal.value = true;
    await fetchUserPlaylists();
};

const fetchUserPlaylists = async () => {
    isLoadingPlaylists.value = true
    addingTrackStatus.value = null

    try {
        await fetchPlaylists()
        userPlaylists.value = playlists.value
    } catch (error) {
        console.error('Error fetching playlists:', error)
    } finally {
        isLoadingPlaylists.value = false
    }
}

const createNewPlaylist = async () => {
    if (!newPlaylistName.value) {
        return
    }

    try {
        await createPlaylist(newPlaylistName.value)
        newPlaylistName.value = ''
        showNewPlaylistInput.value = false
        await fetchUserPlaylists()
    } catch (error) {
        console.error('Error creating playlist:', error)
    }
}

const addTrackToPlaylist = async (playlistId: string) => {
    const trackToAdd = selectedTrackForModal.value;
    if (!trackToAdd || !trackToAdd.youtubeId) {
        console.error('Aucun titre sélectionné pour ajouter à la playlist')
        return
    }

    addingTrackStatus.value = 'loading'

    try {
        await useAuthFetch(`music/playlist/add-track?${Date.now()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playlistId: playlistId,
                trackId: trackToAdd.youtubeId
            })
        })

        addingTrackStatus.value = 'success'

        setTimeout(() => {
            showPlaylistModal.value = false
            addingTrackStatus.value = null
            selectedTrackForModal.value = null;
        }, 1500)

    } catch (error) {
        console.error('Error adding track to playlist:', error)
        addingTrackStatus.value = 'error'
    }
}

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
    likeTrack,
    handleVolumeChange,
    formatTime,
    seek,
    favoriteTracks,
    favoriteQuantity,
    fetchFavoriteTracks,
    playlists,
    fetchPlaylists,
    getPlaylistTracks,
    createPlaylist,
    updatePlaylist,
    playlistQuantity,
    checkFavoriteQuantity,
    checkPlaylistQuantity,
    isLoading,
    performSearch,
    addToPlaylist
} = useMusicPlayer();

import { useMusicPlayer } from '~/utils/useMusicPlayer'
import PlaylistForm from './PlaylistForm.vue'

const tabs = ref([
    {
        id: 'library',
        name: 'Bibliothèque',
    },
    {
        id: 'queue',
        name: 'File d\'attente',
    },
    {
        id: 'search',
        name: 'Rechercher',
    }
]) as Ref<Array<{ id: 'search' | 'queue' | 'library', name: string, icon: string }>>;

const activeLibrarySection = ref<'categories' | 'recent' | 'favorites' | 'playlists' | 'playlist-tracks'>('categories');

const goToLibraryCategories = async () => {
    activeLibrarySection.value = 'categories';
};

const displayRecentTracks = () => {
    activeLibrarySection.value = 'recent';
};

const displayFavoriteTracks = async () => {
    try {
        await fetchFavoriteTracks();
    } catch (error) {
        console.error('Error fetching favorite tracks:', error);
    } finally {
        activeLibrarySection.value = 'favorites';
    }
};

const displayMyPlaylists = async () => {
    try {
        await fetchPlaylists();
    } catch (error) {
        console.error('Error fetching playlists:', error);
    } finally {
        activeLibrarySection.value = 'playlists';
    }
};

const selectedPlaylist = ref<typeof playlists.value[0] | null>(null);
const playlistTracks = ref<Track[]>([]);

const openPlaylist = async (playlist: typeof playlists.value[0]) => {
    try {
        selectedPlaylist.value = playlist;
        playlistTracks.value = await getPlaylistTracks(playlist.id);
        activeLibrarySection.value = 'playlist-tracks';
    } catch (error) {
        console.error('Error opening playlist:', error);
    }
};

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
    await checkPlaylistQuantity();

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
    background-color: var(--color-primary);
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
    border-radius: 100%;
    height: 40px;
    width: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.musicControls {
    cursor: pointer;
    transition: color 0.3s ease;
}

.musicControls:hover {
    color: var(--color-primary);
}

.likeButton {
    cursor: pointer;
}

.threedots {
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-top: -6px;
}

.track-progress-slider::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.track-progress-slider::-webkit-slider-runnable-track {
    background: linear-gradient(to right,
            var(--color-primary) 0%,
            var(--color-primary) var(--progress-percentage),
            var(--color-black) var(--progress-percentage),
            var(--color-black) 100%);
    height: 6px;
    border-radius: 10px;
}

.track-progress-slider::-moz-range-progress {
    background: var(--color-primary);
    height: 6px;
    border-radius: 10px;
}

.track-progress-slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0, 0, 0), 0.2);
}

.track-progress-slider:focus::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0, 0, 0), 0.2);
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

.mini-player>div {
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
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.5);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin: 4px 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-secondary);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary);
}


.loader {
    border: 4px solid rgba(135, 137, 192, 0.3);
    border-radius: 50%;
    border-top: 4px solid var(--color-primary);
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.animate-modal-fade-in {
    animation: modalFadeIn 0.3s ease-out forwards;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(15px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-menu {
    min-width: 180px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    transform-origin: bottom right;
    pointer-events: auto;
    z-index: 999;
}
</style>
