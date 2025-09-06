<template>
    <div>
        <Navbar />
        <div class="module-container mt-8">
            <div class="module-content">
                <div class="hero-section mb-16">
                    <div class="hero-icon mb-6">
                        <Icon name="ri:music-line" size="400%" class="textColorTritary" />
                    </div>
                    <h1 class="megaFont textColorWhite mb-4">Module Lecteur Musical</h1>
                    <p class="largeFont textColorWhite mb-6 opacity-90">
                        Écoutez votre musique en continu et organisez vos collections musicales
                    </p>
                    <div class="hero-badges">
                        <span class="badge">
                            <Icon name="ri:headphone-line" />
                            Streaming haute qualité
                        </span>
                        <span class="badge">
                            <Icon name="ri:equalizer-line" />
                            Égaliseur personnalisé
                        </span>
                        <span class="badge">
                            <Icon name="ri:share-forward-line" />
                            Partage de playlists
                        </span>
                    </div>
                </div>

                <section class="player-demo-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Lecteur Musical Intégré</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Une interface élégante et intuitive pour une expérience musicale immersive
                        </p>
                    </div>
                    <div class="player-demo">
                        <div class="music-player">
                            <div class="album-cover">
                                <div class="cover-image">
                                    <Icon name="ri:disc-line" size="400%" class="textColorTritary" />
                                </div>
                            </div>
                            <div class="player-info">
                                <div class="track-info">
                                    <h3 class="mediumFont textColorWhite">Dream Sequence</h3>
                                    <p class="smallFont textColorWhite opacity-70">SyncSpace Audio</p>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-filled"></div>
                                </div>
                                <div class="time-info">
                                    <span class="time-current">2:15</span>
                                    <span class="time-total">4:32</span>
                                </div>
                                <div class="player-controls">
                                    <button class="control-btn">
                                        <Icon name="ri:skip-back-fill" class="textColorWhite" />
                                    </button>
                                    <button class="control-btn play-btn">
                                        <Icon name="ri:pause-fill" class="textColorWhite" />
                                    </button>
                                    <button class="control-btn">
                                        <Icon name="ri:skip-forward-fill" class="textColorWhite" />
                                    </button>
                                </div>
                                <div class="player-options">
                                    <button class="option-btn">
                                        <Icon name="ri:repeat-one-line" class="textColorWhite opacity-50" />
                                    </button>
                                    <button class="option-btn">
                                        <Icon name="ri:shuffle-line" class="textColorTritary" />
                                    </button>
                                    <div class="volume-control">
                                        <Icon name="ri:volume-up-line" class="textColorWhite" />
                                        <div class="volume-bar">
                                            <div class="volume-filled"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="playlist">
                            <div class="playlist-header">
                                <h3 class="mediumFont textColorWhite">Ma Playlist</h3>
                                <div class="playlist-actions">
                                    <button class="action-btn">
                                        <Icon name="ri:add-line" class="textColorWhite" />
                                    </button>
                                    <button class="action-btn">
                                        <Icon name="ri:more-2-line" class="textColorWhite" />
                                    </button>
                                </div>
                            </div>
                            <div class="track-list">
                                <div class="track-item active">
                                    <div class="track-number">1</div>
                                    <div class="track-details">
                                        <span class="track-name">Dream Sequence</span>
                                        <span class="track-artist">SyncSpace Audio</span>
                                    </div>
                                    <div class="track-duration">4:32</div>
                                </div>
                                <div class="track-item">
                                    <div class="track-number">2</div>
                                    <div class="track-details">
                                        <span class="track-name">Digital Horizon</span>
                                        <span class="track-artist">Byte Composers</span>
                                    </div>
                                    <div class="track-duration">3:47</div>
                                </div>
                                <div class="track-item">
                                    <div class="track-number">3</div>
                                    <div class="track-details">
                                        <span class="track-name">Ambient Flow</span>
                                        <span class="track-artist">Code Harmony</span>
                                    </div>
                                    <div class="track-duration">5:12</div>
                                </div>
                                <div class="track-item">
                                    <div class="track-number">4</div>
                                    <div class="track-details">
                                        <span class="track-name">Productive Beats</span>
                                        <span class="track-artist">Dev Soundtracks</span>
                                    </div>
                                    <div class="track-duration">4:05</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="features-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Fonctionnalités Principales</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card" v-for="feature in mainFeatures" :key="feature.id">
                            <div class="feature-icon">
                                <Icon :name="feature.icon" size="200%" class="textColorTritary" />
                            </div>
                            <h3 class="mediumFont textColorWhite mb-3">{{ feature.title }}</h3>
                            <p class="normalFont textColorWhite opacity-80 mb-4">{{ feature.description }}</p>
                            <ul class="feature-benefits">
                                <li v-for="benefit in feature.benefits" :key="benefit" class="benefit-item">
                                    <Icon name="ri:check-line" class="textColorTritary" />
                                    <span class="smallFont textColorWhite">{{ benefit }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section class="audio-quality-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Qualité Audio Exceptionnelle</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Une expérience d'écoute immersive avec une qualité sonore irréprochable
                        </p>
                    </div>
                    <div class="quality-content">
                        <div class="quality-visual">
                            <div class="equalizer">
                                <div class="eq-bar" v-for="n in 8" :key="n"
                                    :style="`height: ${30 + Math.random() * 60}px`"></div>
                            </div>
                            <div class="quality-labels">
                                <span class="quality-label">32Hz</span>
                                <span class="quality-label">64Hz</span>
                                <span class="quality-label">125Hz</span>
                                <span class="quality-label">250Hz</span>
                                <span class="quality-label">500Hz</span>
                                <span class="quality-label">1kHz</span>
                                <span class="quality-label">4kHz</span>
                                <span class="quality-label">16kHz</span>
                            </div>
                        </div>
                        <div class="quality-features">
                            <div class="quality-item">
                                <Icon name="ri:hd-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Audio Haute Définition</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Streaming jusqu'à 24-bit/96kHz pour une expérience audiophile
                                    </p>
                                </div>
                            </div>
                            <div class="quality-item">
                                <Icon name="ri:equalizer-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Égaliseur Personnalisé</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Ajustez les niveaux audio selon vos préférences avec 8 bandes de fréquence
                                    </p>
                                </div>
                            </div>
                            <div class="quality-item">
                                <Icon name="ri:sound-module-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Préréglages Acoustiques</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Profils audio optimisés pour différents genres musicaux
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="library-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Bibliothèque Musicale Intelligente</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Organisez et découvrez votre musique de manière intuitive
                        </p>
                    </div>
                    <div class="library-grid">
                        <div class="library-card">
                            <div class="library-icon">
                                <Icon name="ri:folder-music-line" size="250%" class="textColorTritary" />
                            </div>
                            <h3 class="mediumFont textColorWhite mb-2">Organisation Automatique</h3>
                            <p class="smallFont textColorWhite opacity-80">
                                Vos fichiers musicaux sont automatiquement triés par artiste, album et genre
                            </p>
                        </div>
                        <div class="library-card">
                            <div class="library-icon">
                                <Icon name="ri:search-eye-line" size="250%" class="textColorTritary" />
                            </div>
                            <h3 class="mediumFont textColorWhite mb-2">Recherche Avancée</h3>
                            <p class="smallFont textColorWhite opacity-80">
                                Trouvez rapidement n'importe quel titre, artiste ou album dans votre collection
                            </p>
                        </div>
                        <div class="library-card">
                            <div class="library-icon">
                                <Icon name="ri:file-list-3-line" size="250%" class="textColorTritary" />
                            </div>
                            <h3 class="mediumFont textColorWhite mb-2">Playlists Personnalisées</h3>
                            <p class="smallFont textColorWhite opacity-80">
                                Créez des collections thématiques pour toutes vos humeurs et activités
                            </p>
                        </div>
                        <div class="library-card">
                            <div class="library-icon">
                                <Icon name="ri:heart-pulse-line" size="250%" class="textColorTritary" />
                            </div>
                            <h3 class="mediumFont textColorWhite mb-2">Recommandations</h3>
                            <p class="smallFont textColorWhite opacity-80">
                                Découvrez de nouveaux titres basés sur vos habitudes d'écoute
                            </p>
                        </div>
                    </div>
                </section>

                <section class="integration-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Intégration avec SyncSpace</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="integration-content">
                        <div class="integration-text">
                            <p class="normalFont textColorWhite mb-6">
                                Le module Lecteur Musical s'intègre parfaitement avec les autres modules
                                de SyncSpace pour une expérience multimédia complète.
                            </p>
                            <div class="integration-examples">
                                <div class="integration-item">
                                    <Icon name="ri:folder-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Drive</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Synchronisez et stockez votre collection musicale dans votre espace cloud
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:chat-3-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Chat</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Partagez vos morceaux préférés directement dans vos conversations
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:calendar-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Calendrier</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Programmez des playlists pour vos événements et réunions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="integration-visual">
                            <div class="modules-connection">
                                <div class="center-module">
                                    <Icon name="ri:music-line" size="200%" class="textColorTritary" />
                                    <span class="smallFont textColorWhite">Music</span>
                                </div>
                                <div class="connected-modules">
                                    <div class="module-node" v-for="module in connectedModules" :key="module.id">
                                        <div class="connection-line"></div>
                                        <div class="module-icon">
                                            <Icon :name="module.icon" class="textColorWhite" />
                                        </div>
                                        <span class="xs-font textColorWhite">{{ module.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="cta-section">
                    <div class="cta-content">
                        <Icon name="ri:music-2-line" size="300%" class="textColorTritary mb-6" />
                        <h2 class="largeFont textColorWhite mb-4">Prêt à Transformer Votre Expérience Musicale ?</h2>
                        <p class="normalFont textColorWhite opacity-90 mb-6">
                            Découvrez comment le module Lecteur Musical peut améliorer votre productivité et votre
                            plaisir
                        </p>
                        <div class="cta-buttons">
                            <NuxtLink to="/register" class="cta-btn primary">
                                <Icon name="ri:play-circle-line" />
                                Commencer l'écoute
                            </NuxtLink>
                            <NuxtLink to="/contact" class="cta-btn secondary">
                                <Icon name="ri:question-line" />
                                En savoir plus
                            </NuxtLink>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import { ref } from "vue";

const mainFeatures = ref([
    {
        id: 1,
        icon: "ri:play-list-line",
        title: "Playlists Intelligentes",
        description: "Créez et gérez des playlists dynamiques qui s'adaptent à vos goûts musicaux.",
        benefits: [
            "Organisation par thèmes",
            "Tri automatique",
            "Suggestions contextuelles",
            "Partage avec vos contacts"
        ]
    },
    {
        id: 2,
        icon: "ri:sound-module-line",
        title: "Qualité Audio Premium",
        description: "Profitez d'une qualité sonore exceptionnelle avec des options d'ajustement avancées.",
        benefits: [
            "Streaming haute définition",
            "Égaliseur personnalisable",
            "Préréglages par genre",
            "Support audio spatial"
        ]
    },
    {
        id: 3,
        icon: "ri:upload-cloud-line",
        title: "Bibliothèque Cloud",
        description: "Accédez à votre collection musicale depuis n'importe quel appareil grâce à la synchronisation cloud.",
        benefits: [
            "Stockage illimité",
            "Synchronisation multi-appareils",
            "Upload de collections complètes",
            "Support de tous les formats"
        ]
    },
    {
        id: 4,
        icon: "ri:heart-line",
        title: "Découverte Musicale",
        description: "Explorez de nouveaux artistes et titres grâce aux recommandations personnalisées.",
        benefits: [
            "Suggestions basées sur l'écoute",
            "Playlists thématiques",
            "Nouvelles sorties hebdomadaires",
            "Radio personnalisée"
        ]
    }
]);

const connectedModules = ref([
    { id: 1, name: "Drive", icon: "ri:folder-line" },
    { id: 2, name: "Chat", icon: "ri:chat-3-line" },
    { id: 3, name: "Calendrier", icon: "ri:calendar-line" },
    { id: 4, name: "Password", icon: "ri:key-line" }
]);
</script>

<style scoped>
.module-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    color: #fff;
}

.module-content {
    width: 100%;
    max-width: 1200px;
}

.hero-section {
    text-align: center;
    padding: 60px 0;
}

.hero-icon {
    display: flex;
    justify-content: center;
}

.hero-badges {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 127, 80, 0.2);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(255, 127, 80, 0.3);
    font-size: 14px;
    color: var(--color-white);
}

.section-header {
    text-align: center;
}

.section-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #ff7f50, #ff5722);
    margin: 0 auto 20px;
    border-radius: 2px;
}

.player-demo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 40px;
}

.music-player {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.album-cover {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.cover-image {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, rgba(255, 127, 80, 0.3), rgba(255, 87, 34, 0.3));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.track-info {
    text-align: center;
    margin-bottom: 20px;
}

.progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    position: relative;
    margin-bottom: 8px;
}

.progress-filled {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 50%;
    background: var(--color-tritary);
    border-radius: 2px;
}

.time-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--color-white);
    opacity: 0.7;
    margin-bottom: 20px;
}

.player-controls {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 20px;
}

.control-btn {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.play-btn {
    width: 56px;
    height: 56px;
    background: var(--color-tritary);
    border-color: var(--color-tritary);
}

.player-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.option-btn {
    background: transparent;
    border: none;
    cursor: pointer;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
}

.volume-bar {
    width: 80px;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    position: relative;
}

.volume-filled {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 70%;
    background: var(--color-white);
    opacity: 0.7;
    border-radius: 2px;
}

.playlist {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-actions {
    display: flex;
    gap: 12px;
}

.action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
}

.track-list {
    padding: 10px 0;
    flex: 1;
    overflow-y: auto;
}

.track-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 20px;
    transition: all 0.3s ease;
    cursor: pointer;
    border-left: 3px solid transparent;
}

.track-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.track-item.active {
    background: rgba(255, 127, 80, 0.1);
    border-left-color: var(--color-tritary);
}

.track-number {
    color: var(--color-white);
    opacity: 0.6;
    font-size: 14px;
    width: 24px;
    text-align: center;
}

.track-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.track-name {
    color: var(--color-white);
    font-size: 14px;
}

.track-artist {
    color: var(--color-white);
    opacity: 0.6;
    font-size: 12px;
}

.track-duration {
    color: var(--color-white);
    opacity: 0.6;
    font-size: 14px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.feature-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    text-align: center;
}

.feature-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 127, 80, 0.5);
    background: rgba(255, 255, 255, 0.08);
}

.feature-benefits {
    text-align: left;
    list-style: none;
    padding: 0;
}

.benefit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.quality-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    margin-top: 40px;
}

.quality-visual {
    padding: 30px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.equalizer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100px;
    padding: 0 20px;
    margin-bottom: 20px;
}

.eq-bar {
    width: 8px;
    background: linear-gradient(to top, var(--color-tritary) 0%, rgba(255, 127, 80, 0.4) 100%);
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
}

.quality-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
}

.quality-label {
    font-size: 10px;
    color: var(--color-white);
    opacity: 0.6;
    transform: rotate(-45deg);
    transform-origin: top left;
    white-space: nowrap;
}

.quality-features {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.quality-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.library-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.library-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    transition: all 0.3s ease;
}

.library-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 127, 80, 0.3);
}

.library-icon {
    margin-bottom: 20px;
}

.integration-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 60px;
    align-items: center;
    margin-top: 40px;
}

.integration-examples {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 30px;
}

.integration-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.modules-connection {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.center-module {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    background: rgba(255, 127, 80, 0.2);
    border-radius: 15px;
    border: 1px solid rgba(255, 127, 80, 0.3);
}

.connected-modules {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.module-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.module-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cta-section {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(135deg, rgba(255, 127, 80, 0.1), rgba(255, 87, 34, 0.1));
    border-radius: 20px;
    border: 1px solid rgba(255, 127, 80, 0.2);
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.cta-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.cta-btn.primary {
    background-color: #ff7f50;
    color: #fff;
}

.cta-btn.primary:hover {
    background-color: #ff5722;
    transform: translateY(-2px);
}

.cta-btn.secondary {
    background: transparent;
    color: var(--color-white);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-tritary);
}

@media (max-width: 768px) {
    .player-demo {
        grid-template-columns: 1fr;
    }

    .quality-content,
    .integration-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .features-grid,
    .library-grid {
        grid-template-columns: 1fr;
    }

    .connected-modules {
        grid-template-columns: 1fr;
    }
}
</style>
