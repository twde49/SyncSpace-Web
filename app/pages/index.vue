<template>
    <div class="min-h-screen bgColorBlack">
        <div class="h-[100vh]">
            <Navbar />
            <Hero />
        </div>

        <!-- Section Problématique -->
        <section class="py-16 px-6 max-w-6xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="omegaFont textColorWhite mb-4">
                    Fini la <span class="textColorPrimary">fragmentation</span>
                </h2>
                <p class="largeFont textColorWhite max-w-2xl mx-auto">
                    L'environnement de travail moderne est saturé par une prolifération d'applications spécialisées.
                    Cette multiplication crée un écosystème numérique fragmenté qui vous fait perdre du temps et de
                    l'argent.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <div
                    class="bgColorWhite globalRadius p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div class="w-16 h-16 bgColorCategoryQuaternary globalRadius flex items-center justify-center mb-6">
                        <Icon name="ph:clock" class="w-8 h-8 textColorWhite" />
                    </div>
                    <h3 class="largeFont textColorBlack mb-4">Perte de productivité</h3>
                    <p class="normalFont textColorBlack">Le basculement constant entre applications fait perdre du temps
                        et du contexte précieux.</p>
                </div>

                <div
                    class="bgColorWhite globalRadius p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div class="w-16 h-16 bgColorCategoryQuinary globalRadius flex items-center justify-center mb-6">
                        <Icon name="ph:shield-warning" class="w-8 h-8 textColorBlack" />
                    </div>
                    <h3 class="largeFont textColorBlack mb-4">Risques de sécurité</h3>
                    <p class="normalFont textColorBlack">La multiplication des identifiants et points d'accès augmente
                        dangereusement la surface d'attaque.</p>
                </div>

                <div
                    class="bgColorWhite globalRadius p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div class="w-16 h-16 bgColorCategoryPrimary globalRadius flex items-center justify-center mb-6">
                        <Icon name="ph:users-three" class="w-8 h-8 textColorWhite" />
                    </div>
                    <h3 class="largeFont textColorBlack mb-4">Collaboration dégradée</h3>
                    <p class="normalFont textColorBlack">L'information silotée rend le travail d'équipe inefficace et
                        complexe.</p>
                </div>
            </div>
        </section>

        <!-- Section Solution -->
        <section class="py-16 px-6 bgColorWhite">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="omegaFont textColorBlack mb-4">
                        Une seule plateforme, <span class="textColorSecondary">tout centralisé</span>
                    </h2>
                    <p class="largeFont textColorBlack max-w-2xl mx-auto">
                        SyncSpace réunit tous vos outils essentiels dans une interface unique, sécurisée et modulaire.
                    </p>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Gestionnaire de mots de passe -->
                    <div
                        class="group bgColorBlack globalRadius p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div
                            class="w-16 h-16 bgColorTritary globalRadius flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="ph:key" class="w-8 h-8 textColorWhite" />
                        </div>
                        <h3 class="largeFont textColorWhite mb-4">Gestionnaire de mots de passe</h3>
                        <p class="normalFont textColorWhite mb-4">Coffre-fort sécurisé avec chiffrement AES-256 et
                            PBKDF2. Générez et partagez vos mots de passe en toute sécurité.</p>
                        <div class="miniFont textColorTritary">✓ Chiffrement AES-256 • ✓ Partage sécurisé</div>
                    </div>

                    <!-- Stockage de fichiers -->
                    <div
                        class="group bgColorBlack globalRadius p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div
                            class="w-16 h-16 bgColorCategoryPrimary globalRadius flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="ph:file-text" class="w-8 h-8 textColorWhite" />
                        </div>
                        <h3 class="largeFont textColorWhite mb-4">Espace de stockage</h3>
                        <p class="normalFont textColorWhite mb-4">Stockez, organisez et partagez vos fichiers avec
                            contrôle total des permissions et prévisualisation intégrée.</p>
                        <div class="miniFont textColorCategoryPrimary">✓ Partage sécurisé • ✓ Prévisualisation</div>
                    </div>

                    <!-- Messagerie -->
                    <div
                        class="group bgColorBlack globalRadius p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div
                            class="w-16 h-16 bgColorCategoryTritary globalRadius flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="ph:chat-circle-text" class="w-8 h-8 textColorBlack" />
                        </div>
                        <h3 class="largeFont textColorWhite mb-4">Messagerie temps réel</h3>
                        <p class="normalFont textColorWhite mb-4">Chat instantané avec messages vocaux, partage de
                            médias et intégration native avec tous les modules.</p>
                        <div class="miniFont textColorCategoryTritary">✓ WebSocket • ✓ Messages vocaux</div>
                    </div>

                    <!-- Calendrier -->
                    <div
                        class="group bgColorBlack globalRadius p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div
                            class="w-16 h-16 bgColorPrimary globalRadius flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="ph:calendar" class="w-8 h-8 textColorBlack" />
                        </div>
                        <h3 class="largeFont textColorWhite mb-4">Calendrier intelligent</h3>
                        <p class="normalFont textColorWhite mb-4">Organisez vos événements avec rappels personnalisés et
                            synchronisation avec vos calendriers externes.</p>
                        <div class="miniFont textColorPrimary">✓ Rappels • ✓ Synchronisation</div>
                    </div>

                    <!-- Lecteur de musique -->
                    <div
                        class="group bgColorBlack globalRadius p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div
                            class="w-16 h-16 bgColorCategoryQuaternary globalRadius flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="ph:music-note" class="w-8 h-8 textColorWhite" />
                        </div>
                        <h3 class="largeFont textColorWhite mb-4">Lecteur de musique</h3>
                        <p class="normalFont textColorWhite mb-4">Écoutez votre musique favorite avec playlists
                            personnalisées et suggestions basées sur vos goûts.</p>
                        <div class="miniFont textColorCategoryQuaternary">✓ Playlists • ✓ Streaming</div>
                    </div>

                    <!-- Conversion de fichiers -->
                    <div
                        class="group bgColorBlack globalRadius p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div
                            class="w-16 h-16 bgColorSecondary globalRadius flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon name="ph:arrows-clockwise" class="w-8 h-8 textColorWhite" />
                        </div>
                        <h3 class="largeFont textColorWhite mb-4">Conversion de fichiers</h3>
                        <p class="normalFont textColorWhite mb-4">Convertissez vos fichiers entre différents formats
                            directement dans l'application.</p>
                        <div class="miniFont textColorSecondary">✓ Multi-formats • ✓ Rapide</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Personas -->
        <section class="py-16 px-6">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="omegaFont textColorWhite mb-4">
                        Conçu pour <span class="textColorTritary">les professionnels</span>
                    </h2>
                </div>

                <div class="grid md:grid-cols-2 gap-12">
                    <!-- Freelance développeur -->
                    <div class="bgColorWhite/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                        <div class="flex items-center mb-6">
                            <div class="w-16 h-16 bgColorCategoryPrimary globalRadius flex items-center justify-center">
                                <Icon name="ph:code" class="w-8 h-8 textColorWhite" />
                            </div>
                            <div class="ml-4">
                                <h3 class="largeFont textColorWhite">Le freelance développeur</h3>
                                <p class="normalFont textColorTritary">Développeur indépendant</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <h4 class="normalFont textColorWhite mb-2">Besoins :</h4>
                                <p class="normalFont textColorWhite">Gérer les mots de passe clients, stocker des
                                    projets, suivre les deadlines et communiquer de manière sécurisée.</p>
                            </div>
                            <div>
                                <h4 class="normalFont textColorWhite mb-2">Frustrations actuelles :</h4>
                                <p class="normalFont textColorWhite">Multiples abonnements coûteux et informations
                                    éparpillées qui font perdre du temps précieux.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Cheffe de projet PME -->
                    <div class="bgColorWhite/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                        <div class="flex items-center mb-6">
                            <div class="w-16 h-16 bgColorCategoryTritary globalRadius flex items-center justify-center">
                                <Icon name="ph:users-three" class="w-8 h-8 textColorBlack" />
                            </div>
                            <div class="ml-4">
                                <h3 class="largeFont textColorWhite">La cheffe de projet PME</h3>
                                <p class="normalFont textColorCategoryTritary">Manager d'équipe</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <h4 class="normalFont textColorWhite mb-2">Besoins :</h4>
                                <p class="normalFont textColorWhite">Coordonner son équipe, partager des fichiers
                                    sécurisés, planifier des réunions et centraliser la communication.</p>
                            </div>
                            <div>
                                <h4 class="normalFont textColorWhite mb-2">Frustrations actuelles :</h4>
                                <p class="normalFont textColorWhite">Les outils comme ClickUp sont trop complexes et
                                    chers pour son équipe de taille moyenne.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Statistiques / Bénéfices -->
        <section class="py-16 px-6 bgColorWhite/5">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="omegaFont textColorWhite mb-4">
                        Des résultats <span class="textColorCategoryQuinary">mesurables</span>
                    </h2>
                </div>

                <div class="hero-stats">
                    <div class="stat-item">
                        <span class="textColorTritary">25%</span>
                        <span class="textColorWhite">Réduction du temps de basculement entre applications</span>
                    </div>
                    <div class="stat-item">
                        <span class="textColorCategoryPrimary">99.9%</span>
                        <span class="textColorWhite"> Taux de disponibilité garanti</span>
                    </div>
                    <div class="stat-item">
                        <span class="textColorCategoryTritary">&lt;3s</span>
                        <span class="textColorWhite"> Temps de chargement initial de l'application</span>
                    </div>
                    <div class="stat-item">
                        <span class="textColorCategoryQuinary">AES-256</span>
                        <span class="textColorWhite"> Chiffrement de niveau militaire</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section CTA -->
        <section class="py-20 px-6">
            <div class="cta-section">
                <h2 class="section-header textColorWhite mb-6">
                    Prêt à <span class="textColorTritary">synchroniser</span> votre workflow ?
                </h2>
                <p class="largeFont textColorWhite mb-12">
                    Rejoignez les professionnels qui ont déjà simplifié leur quotidien avec SyncSpace.
                </p>

                <div class="cta-buttons">
                    <button class="cta-btn primary">
                        <Icon name="ph:rocket" class="mr-2" />
                        Commencer gratuitement
                    </button>
                    <button class="cta-btn secondary">
                        <Icon name="ph:compass" class="mr-2" />
                        Voir la démonstration
                    </button>
                </div>
            </div>
        </section>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import Hero from "~/components/notLogged/Hero.vue";
import Footer from "~/components/notLogged/Footer.vue";

</script>

<style scoped>
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

.float {
    animation: float 6s ease-in-out infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.bg-gradient-animate {
    background: linear-gradient(-45deg, #1e293b, #7c3aed, #ec4899, #1e293b);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #7c3aed, #ec4899);
    border-radius: 4px;
}

.section-header {
    font: var(--text-style-omega);
}

.section-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    margin: 2rem 0;
}

.hero-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin: 2rem auto;
    max-width: 1000px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-radius: var(--global-radius);
    min-width: 220px;
}

.stat-item span:first-of-type {
    font: var(--text-style-mega);
    margin-bottom: 0.5rem;
}

.cta-section {
    max-width: 4xl;
    margin: 0 auto;
    text-align: center;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: var(--global-radius);
    backdrop-filter: blur(10px);
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.cta-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    border-radius: var(--global-radius);
    font: var(--text-style-normal);
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    min-width: 200px;
}

.cta-btn.primary {
    background-color: var(--color-tritary);
    color: var(--color-white);
    border: none;
}

.cta-btn.primary:hover {
    background-color: var(--color-secondary);
    transform: translateY(-2px);
}

.cta-btn.secondary {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: var(--color-white);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-btn.secondary:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .hero-stats {
        flex-direction: column;
        width: 90%;
    }

    .cta-buttons {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .stat-item {
        width: 100%;
    }
}
</style>
