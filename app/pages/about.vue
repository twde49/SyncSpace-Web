<template>
    <div>
        <Navbar />
        <div class="about-container mt-8">
            <div class="about-content">
                <div class="hero-section mb-16">
                    <h1 class="megaFont textColorWhite mb-4">À Propos de SyncSpace</h1>
                    <p class="largeFont textColorWhite mb-6 opacity-90">
                        La solution modulaire qui révolutionne votre environnement de travail numérique
                    </p>
                </div>

                <section class="mission-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Notre Mission</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="mission-content">
                        <div class="mission-text">
                            <p class="normalFont textColorWhite mb-4">
                                L'environnement de travail moderne est saturé par une prolifération d'applications
                                spécialisées.
                                Cette fragmentation crée un écosystème numérique complexe qui génère des pertes de
                                productivité,
                                des risques de sécurité accrus et une collaboration dégradée.
                            </p>
                            <p class="normalFont textColorWhite mb-6">
                                <span class="textColorTritary font-semibold">SyncSpace</span> répond à cette
                                problématique en proposant
                                une plateforme modulaire unique qui centralise vos outils essentiels tout en
                                garantissant
                                sécurité et simplicité d'utilisation.
                            </p>
                            <div class="mission-goals">
                                <div class="goal-item">
                                    <Icon name="ph:target" class="textColorTritary" />
                                    <span class="textColorWhite">Réduire le temps de basculement entre applications de
                                        25%</span>
                                </div>
                                <div class="goal-item">
                                    <Icon name="ph:shield-check" class="textColorTritary" />
                                    <span class="textColorWhite">Centraliser la gestion sécurisée des données</span>
                                </div>
                                <div class="goal-item">
                                    <Icon name="ph:users-three" class="textColorTritary" />
                                    <span class="textColorWhite">Optimiser la collaboration en temps réel</span>
                                </div>
                            </div>
                        </div>
                        <div class="mission-visual">
                            <div class="feature-preview">
                                <Icon name="ph:plus-circle" size="200%" class="textColorTritary" />
                                <p class="miniFont textColorWhite text-center mt-4">Un seul espace, tous vos outils</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="modules-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Nos Modules</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Découvrez les fonctionnalités qui font de SyncSpace votre allié productivité
                        </p>
                    </div>
                    <div class="modules-grid">
                        <div class="module-card" v-for="module in modules" :key="module.id">
                            <div class="module-icon">
                                <Icon :name="module.icon" size="200%" class="textColorTritary" />
                            </div>
                            <h3 class="normalFont textColorWhite mb-2">{{ module.name }}</h3>
                            <p class="miniFont textColorWhite opacity-80 mb-4">{{ module.description }}</p>
                            <div class="module-features">
                                <span v-for="feature in module.features" :key="feature" class="feature-tag">
                                    {{ feature }}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="tech-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Technologies & Sécurité</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="tech-content">
                        <div class="tech-stack">
                            <div class="tech-category">
                                <h3 class="normalFont textColorTritary mb-4">Frontend</h3>
                                <div class="tech-items">
                                    <div class="tech-item">
                                        <Icon name="ph:browsers" />
                                        <span>Nuxt 4 / Vue.js</span>
                                    </div>
                                    <div class="tech-item">
                                        <Icon name="ph:code" />
                                        <span>TypeScript</span>
                                    </div>
                                    <div class="tech-item">
                                        <Icon name="ph:palette" />
                                        <span>TailwindCSS</span>
                                    </div>
                                </div>
                            </div>
                            <div class="tech-category">
                                <h3 class="normalFont textColorTritary mb-4">Backend</h3>
                                <div class="tech-items">
                                    <div class="tech-item">
                                        <Icon name="ph:database" />
                                        <span>Symfony 7.2</span>
                                    </div>
                                    <div class="tech-item">
                                        <Icon name="ph:cylinder" />
                                        <span>PostgreSQL</span>
                                    </div>
                                    <div class="tech-item">
                                        <Icon name="ph:arrows-clockwise" />
                                        <span>REST API</span>
                                    </div>
                                </div>
                            </div>
                            <div class="tech-category">
                                <h3 class="normalFont textColorTritary mb-4">Sécurité</h3>
                                <div class="tech-items">
                                    <div class="tech-item">
                                        <Icon name="ph:shield-check" />
                                        <span>Chiffrement AES-256</span>
                                    </div>
                                    <div class="tech-item">
                                        <Icon name="ph:arrows-clockwise" />
                                        <span>PBKDF2</span>
                                    </div>
                                    <div class="tech-item">
                                        <Icon name="ph:lock" />
                                        <span>JWT Authentication</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="roadmap-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Roadmap 2025</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="roadmap-timeline">
                        <div v-for="milestone in roadmap" :key="milestone.month" class="timeline-item"
                            :class="{ 'completed': milestone.completed }">
                            <div class="timeline-marker">
                                <Icon :name="milestone.completed ? 'ph:check' : 'ph:clock'"
                                    :class="milestone.completed ? 'textColorTritary' : 'textColorWhite'" />
                            </div>
                            <div class="timeline-content">
                                <h3 class="normalFont textColorWhite mb-2">{{ milestone.month }}</h3>
                                <p class="miniFont textColorWhite opacity-80">{{ milestone.description }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="team-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Notre Engagement</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="engagement-grid">
                        <div class="engagement-item">
                            <Icon name="ph:code" size="150%" class="textColorTritary mb-4" />
                            <h3 class="normalFont textColorWhite mb-2">Centré Utilisateur</h3>
                            <p class="miniFont textColorWhite opacity-80">
                                Chaque fonctionnalité est pensée pour améliorer votre expérience quotidienne
                            </p>
                        </div>
                        <div class="engagement-item">
                            <Icon name="ph:calendar" size="400%" class="textColorTritary" />
                            <h3 class="normalFont textColorWhite mb-2">Sécurité d'abord</h3>
                            <p class="miniFont textColorWhite opacity-80">
                                Vos données sont protégées par les plus hauts standards de sécurité et stockées en
                                France
                            </p>
                        </div>
                        <div class="engagement-item">
                            <Icon name="ph:users-three" size="200%" class="textColorTritary" />
                            <h3 class="normalFont textColorWhite mb-2">Innovation Continue</h3>
                            <p class="miniFont textColorWhite opacity-80">
                                Nous évoluons constamment pour répondre à vos besoins futurs
                            </p>
                        </div>
                    </div>
                </section>

                <section class="cta-section">
                    <div class="cta-content">
                        <h2 class="largeFont textColorWhite mb-4">Prêt à Synchroniser Votre Espace de Travail ?</h2>
                        <div class="cta-buttons">
                            <NuxtLink to="/register" class="cta-btn primary">
                                <Icon name="ph:share-network" />
                                Créer un compte
                            </NuxtLink>
                            <NuxtLink to="/contact" class="cta-btn secondary">
                                <Icon name="ph:clock" />
                                Nous contacter
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

const modules = ref([
    {
        id: 1,
        name: "Gestionnaire de Mots de Passe",
        description: "Coffre-fort sécurisé avec chiffrement AES-256 et génération automatique",
        icon: "ph:key",
        features: ["Chiffrement AES-256", "Générateur intégré", "Partage sécurisé"]
    },
    {
        id: 2,
        name: "Drive Personnel",
        description: "Stockage et partage de fichiers avec gestion fine des permissions",
        icon: "ph:folder-open",
        features: ["Stockage sécurisé", "Partage collaboratif", "Prévisualisation"]
    },
    {
        id: 3,
        name: "Calendrier",
        description: "Organisation d'événements avec rappels et synchronisation externe",
        icon: "ph:calendar",
        features: ["Vues multiples", "Rappels intelligents", "Sync externe"]
    },
    {
        id: 4,
        name: "Messagerie Temps Réel",
        description: "Communication instantanée sécurisée basée sur WebSocket",
        icon: "ph:chat-circle-text",
        features: ["Temps réel", "Chiffrement E2E", "Notifications push"]
    },
    {
        id: 5,
        name: "Lecteur de Musique",
        description: "Gestion de playlists et lecture en streaming intégrée",
        icon: "ph:music-note",
        features: ["Playlists custom", "Streaming"]
    },
    {
        id: 6,
        name: "Module Météo",
        description: "Prévisions météorologiques localisées et alertes personnalisées",
        icon: "ph:cloud-sun",
        features: ["Géolocalisation", "Alertes météo"]
    },
    {
        id: 7,
        name: "Bientôt plus de modules...",
        description: "De nouvelles fonctionnalités et intégrations sont en cours de développement pour enrichir votre espace de travail.",
        icon: "ph:plus-circle",
        features: ["En développement", "Surprises à venir"]
    }
]);

const roadmap = ref([
    {
        month: "Juillet 2025",
        description: "Deuxième beta, stabilisation modules",
        completed: true
    },
    {
        month: "Août 2025",
        description: "Correction retour beta et finitions",
        completed: true
    },
    {
        month: "Septembre 2025",
        description: "Déploiement initial du module de gestion de tâches",
        completed: false
    },
    {
        month: "Octobre 2025",
        description: "Intégration avancée du calendrier avec les outils tiers",
        completed: false
    },
    {
        month: "Novembre 2025",
        description: "Amélioration des performances du Drive et ajout du versioning",
        completed: false
    },
    {
        month: "Décembre 2025",
        description: "Lancement du module de notes collaboratives et de wiki interne",
        completed: false
    },
]);
</script>

<style scoped>
.about-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    color: #fff;
}

.about-content {
    width: 100%;
    max-width: 1200px;
}

.hero-section {
    text-align: center;
    padding: 60px 0;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 60px;
    margin-top: 40px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.stat-item span:first-of-type {
    font-size: 2rem;
    font-weight: bold;
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

.mission-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 60px;
    align-items: center;
}

.mission-goals {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.goal-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mission-visual {
    display: flex;
    justify-content: center;
}

.feature-preview {
    padding: 40px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    text-align: center;
    border: 1px solid rgba(255, 127, 80, 0.2);
}

.modules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.module-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.module-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 127, 80, 0.5);
    background: rgba(255, 255, 255, 0.08);
}

.module-icon {
    margin-bottom: 20px;
}

.module-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.feature-tag {
    background: rgba(255, 127, 80, 0.2);
    color: var(--color-tritary);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    border: 1px solid rgba(255, 127, 80, 0.3);
}

.tech-stack {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.tech-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.tech-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.05);
    padding: 12px 16px;
    border-radius: 8px;
    color: var(--color-white);
}

.roadmap-timeline {
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
    max-width: 600px;
    margin: 0 auto;
    padding-left: 0;
}

.roadmap-timeline::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #ff7f50, #ff5722);
}

.timeline-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-left: 40px;
}

.timeline-marker {
    position: absolute;
    left: -32px;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid;
}

.timeline-item.completed .timeline-marker {
    background: rgba(255, 127, 80, 0.2);
    border-color: var(--color-tritary);
}

.timeline-item:not(.completed) .timeline-marker {
    border-color: rgba(255, 255, 255, 0.3);
}

.engagement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    text-align: center;
}

.engagement-item {
    padding: 30px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
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
    .hero-stats {
        flex-direction: column;
        gap: 30px;
    }

    .mission-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .modules-grid {
        grid-template-columns: 1fr;
    }

    .tech-stack {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }


    .timeline-item {
        margin-left: 30px;
    }

    .timeline-marker {
        left: -22px;
    }
}
</style>
