<template>
    <div>
        <Navbar />
        <div class="module-container mt-8">
            <div class="module-content">
                <div class="hero-section mb-16">
                    <div class="hero-icon mb-6">
                        <Icon name="ri:folder-line" size="400%" class="textColorTritary" />
                    </div>
                    <h1 class="megaFont textColorWhite mb-4">Module Drive</h1>
                    <p class="largeFont textColorWhite mb-6 opacity-90">
                        Stockez, partagez et collaborez sur vos fichiers en toute sécurité
                    </p>
                    <div class="hero-badges">
                        <span class="badge">
                            <Icon name="ri:shield-check-line" />
                            Stockage sécurisé
                        </span>
                        <span class="badge">
                            <Icon name="ri:share-line" />
                            Partage facile
                        </span>
                        <span class="badge">
                            <Icon name="ri:group-line" />
                            Collaboration en temps réel
                        </span>
                    </div>
                </div>

                <section class="storage-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Stockage Cloud Intelligent</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Un espace de stockage organisé qui s'adapte à vos besoins
                        </p>
                    </div>
                    <div class="storage-demo">
                        <div class="file-explorer">
                            <div class="explorer-header">
                                <div class="explorer-controls">
                                    <Icon name="ri:arrow-left-line" class="textColorWhite" />
                                    <Icon name="ri:arrow-right-line" class="textColorWhite" />
                                    <Icon name="ri:refresh-line" class="textColorWhite" />
                                </div>
                                <div class="explorer-path">
                                    <Icon name="ri:home-line" class="textColorWhite" />
                                    <span class="separator">/</span>
                                    <span class="path-part">Documents</span>
                                    <span class="separator">/</span>
                                    <span class="path-part">Projets</span>
                                </div>
                                <div class="explorer-actions">
                                    <Icon name="ri:search-line" class="textColorWhite" />
                                    <Icon name="ri:upload-2-line" class="textColorTritary" />
                                </div>
                            </div>
                            <div class="explorer-content">
                                <div class="explorer-grid">
                                    <div class="file-item folder">
                                        <div class="file-icon">
                                            <Icon name="ri:folder-fill" class="textColorTritary" />
                                        </div>
                                        <span class="file-name">Marketing</span>
                                    </div>
                                    <div class="file-item folder">
                                        <div class="file-icon">
                                            <Icon name="ri:folder-fill" class="textColorTritary" />
                                        </div>
                                        <span class="file-name">Design</span>
                                    </div>
                                    <div class="file-item doc">
                                        <div class="file-icon">
                                            <Icon name="ri:file-text-fill" class="textColorWhite" />
                                        </div>
                                        <span class="file-name">Roadmap.docx</span>
                                    </div>
                                    <div class="file-item image">
                                        <div class="file-icon">
                                            <Icon name="ri:image-fill" class="textColorWhite" />
                                        </div>
                                        <span class="file-name">Logo.png</span>
                                    </div>
                                    <div class="file-item sheet">
                                        <div class="file-icon">
                                            <Icon name="ri:file-excel-fill" class="textColorWhite" />
                                        </div>
                                        <span class="file-name">Budget.xlsx</span>
                                    </div>
                                    <div class="file-item presentation">
                                        <div class="file-icon">
                                            <Icon name="ri:file-ppt-fill" class="textColorWhite" />
                                        </div>
                                        <span class="file-name">Presentation.pptx</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="storage-features">
                            <h3 class="mediumFont textColorWhite mb-4">Organisation Intelligente</h3>
                            <div class="feature-list">
                                <div class="feature-item">
                                    <Icon name="ri:folder-add-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="smallFont textColorWhite font-semibold">Classement Automatique</h4>
                                        <p class="xs-font textColorWhite opacity-70">Les fichiers sont classés
                                            automatiquement selon leur type</p>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <Icon name="ri:search-eye-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="smallFont textColorWhite font-semibold">Recherche Avancée</h4>
                                        <p class="xs-font textColorWhite opacity-70">Retrouvez vos fichiers en quelques
                                            secondes avec la recherche par mot-clé</p>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <Icon name="ri:tag-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="smallFont textColorWhite font-semibold">Tags Personnalisés</h4>
                                        <p class="xs-font textColorWhite opacity-70">Organisez vos fichiers avec des
                                            étiquettes sur mesure</p>
                                    </div>
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

                <section class="sharing-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Partage Simplifié</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Partagez n'importe quel fichier ou dossier en quelques clics
                        </p>
                    </div>
                    <div class="sharing-demo">
                        <div class="share-modal">
                            <div class="modal-header">
                                <h3 class="mediumFont textColorWhite">Partager "Roadmap.docx"</h3>
                                <Icon name="ri:close-line" class="textColorWhite" />
                            </div>
                            <div class="modal-content">
                                <div class="link-share">
                                    <div class="link-field">
                                        <input type="text" value="https://syncspace.app/s/roadmap-X7Js9k" readonly />
                                        <button class="copy-btn">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                    <div class="link-permissions">
                                        <select>
                                            <option>Peut consulter</option>
                                            <option>Peut éditer</option>
                                            <option>Peut administrer</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="people-share">
                                    <h4 class="smallFont textColorWhite mb-3">Partager avec</h4>
                                    <div class="share-user-input">
                                        <input type="text" placeholder="Nom, email ou groupe" />
                                        <button class="add-btn">
                                            <Icon name="ri:user-add-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                    <div class="shared-users">
                                        <div class="shared-user">
                                            <div class="user-avatar">
                                                <Icon name="ri:user-line" class="textColorWhite" />
                                            </div>
                                            <div class="user-info">
                                                <span class="smallFont textColorWhite">Laura Dupont</span>
                                                <span class="xs-font textColorWhite opacity-70">laura@example.com</span>
                                            </div>
                                            <select class="user-permission">
                                                <option>Éditeur</option>
                                                <option>Lecteur</option>
                                                <option>Admin</option>
                                            </select>
                                        </div>
                                        <div class="shared-user">
                                            <div class="user-avatar">
                                                <Icon name="ri:user-line" class="textColorWhite" />
                                            </div>
                                            <div class="user-info">
                                                <span class="smallFont textColorWhite">Marc Bernard</span>
                                                <span class="xs-font textColorWhite opacity-70">marc@example.com</span>
                                            </div>
                                            <select class="user-permission">
                                                <option>Éditeur</option>
                                                <option>Lecteur</option>
                                                <option>Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="share-actions">
                                    <button class="cancel-btn">Annuler</button>
                                    <button class="share-btn">
                                        <Icon name="ri:share-line" />
                                        Partager
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="sharing-features">
                            <div class="sharing-item">
                                <Icon name="ri:link-m" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Liens de Partage</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Créez des liens partagés avec contrôle des permissions pour chaque fichier ou
                                        dossier
                                    </p>
                                </div>
                            </div>
                            <div class="sharing-item">
                                <Icon name="ri:timer-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Accès Temporaires</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Définissez une durée d'expiration pour chaque partage pour plus de sécurité
                                    </p>
                                </div>
                            </div>
                            <div class="sharing-item">
                                <Icon name="ri:shield-keyhole-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Protection par Mot de Passe</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Ajoutez une couche supplémentaire de sécurité avec des mots de passe pour vos
                                        liens
                                    </p>
                                </div>
                            </div>
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
                                Le module Drive s'intègre parfaitement avec tous les autres modules de SyncSpace
                                pour une expérience de travail fluide et productive.
                            </p>
                            <div class="integration-examples">
                                <div class="integration-item">
                                    <Icon name="ri:chat-3-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Messagerie</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Partagez des fichiers directement dans vos conversations
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:edit-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Markdown Editor</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Créez et éditez vos documents dans l'éditeur intégré
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:calendar-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Calendrier</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Joignez des fichiers à vos événements pour un partage contextualisé
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="integration-visual">
                            <div class="modules-connection">
                                <div class="center-module">
                                    <Icon name="ri:folder-line" size="200%" class="textColorTritary" />
                                    <span class="smallFont textColorWhite">Drive</span>
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

                <section class="security-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Sécurité et Confidentialité</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="security-content">
                        <div class="security-visual">
                            <div class="security-shields">
                                <div class="shield-item">
                                    <div class="shield-icon">
                                        <Icon name="ri:lock-line" size="150%" class="textColorTritary" />
                                    </div>
                                    <div class="shield-text">
                                        <span class="smallFont textColorWhite">Chiffrement des données</span>
                                    </div>
                                </div>
                                <div class="shield-item">
                                    <div class="shield-icon">
                                        <Icon name="ri:eye-off-line" size="150%" class="textColorTritary" />
                                    </div>
                                    <div class="shield-text">
                                        <span class="smallFont textColorWhite">Protection de la vie privée</span>
                                    </div>
                                </div>
                                <div class="shield-item">
                                    <div class="shield-icon">
                                        <Icon name="ri:shield-check-line" size="150%" class="textColorTritary" />
                                    </div>
                                    <div class="shield-text">
                                        <span class="smallFont textColorWhite">Conformité RGPD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="security-features">
                            <div class="security-item">
                                <Icon name="ri:lock-password-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Chiffrement AES 256-bit</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Vos fichiers sont chiffrés pendant leur transfert et leur stockage
                                        pour garantir une confidentialité totale.
                                    </p>
                                </div>
                            </div>
                            <div class="security-item">
                                <Icon name="ri:history-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Historique des Versions</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Gardez une trace de toutes les modifications et restaurez
                                        n'importe quelle version antérieure si nécessaire.
                                    </p>
                                </div>
                            </div>
                            <div class="security-item">
                                <Icon name="ri:login-circle-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Journal d'Accès</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Consultez qui a visualisé, édité ou partagé chacun de vos fichiers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="stats-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Performances</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number textColorTritary megaFont">100 Go</div>
                            <div class="stat-label normalFont textColorWhite">Stockage par utilisateur</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number textColorTritary megaFont">10 Go</div>
                            <div class="stat-label normalFont textColorWhite">Limite par fichier</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number textColorTritary megaFont">99.9%</div>
                            <div class="stat-label normalFont textColorWhite">Disponibilité</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number textColorTritary megaFont">30 jours</div>
                            <div class="stat-label normalFont textColorWhite">Récupération fichiers supprimés</div>
                        </div>
                    </div>
                </section>

                <section class="cta-section">
                    <div class="cta-content">
                        <Icon name="ri:folder-shield-line" size="300%" class="textColorTritary mb-6" />
                        <h2 class="largeFont textColorWhite mb-4">Prêt à Stocker vos Fichiers en Toute Sécurité ?</h2>
                        <p class="normalFont textColorWhite opacity-90 mb-6">
                            Découvrez comment le module Drive peut transformer votre gestion documentaire
                        </p>
                        <div class="cta-buttons">
                            <NuxtLink to="/register" class="cta-btn primary">
                                <Icon name="ri:upload-cloud-line" />
                                Commencer à uploader
                            </NuxtLink>
                            <NuxtLink to="/contact" class="cta-btn secondary">
                                <Icon name="ri:question-line" />
                                Questions sur le stockage
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
        icon: "ri:upload-cloud-line",
        title: "Upload Simplifié",
        description: "Téléchargez vos fichiers par simple glisser-déposer ou sélection dans l'explorateur.",
        benefits: [
            "Glisser-déposer intuitif",
            "Upload de dossiers complets",
            "Sélections multiples",
            "Progression en temps réel"
        ]
    },
    {
        id: 2,
        icon: "ri:device-recover-line",
        title: "Synchronisation Multi-Appareils",
        description: "Accédez à vos fichiers depuis tous vos appareils avec une synchronisation intelligente.",
        benefits: [
            "Applications desktop & mobile",
            "Synchronisation selective",
            "Mode hors-ligne",
            "Résolution de conflits automatique"
        ]
    },
    {
        id: 3,
        icon: "ri:team-line",
        title: "Collaboration en Temps Réel",
        description: "Travaillez à plusieurs sur les mêmes documents sans jamais perdre vos modifications.",
        benefits: [
            "Édition collaborative",
            "Commentaires intégrés",
            "Notification des changements",
            "Historique des versions"
        ]
    },
    {
        id: 4,
        icon: "ri:file-search-line",
        title: "Recherche Avancée",
        description: "Retrouvez n'importe quel fichier en quelques secondes grâce à notre moteur de recherche intelligent.",
        benefits: [
            "Recherche full-text",
            "Filtres par type et date",
            "Reconnaissance OCR",
            "Recherche par tags personnalisés"
        ]
    }
]);

const connectedModules = ref([
    { id: 1, name: "Chat", icon: "ri:chat-3-line" },
    { id: 2, name: "Markdown", icon: "ri:markdown-line" },
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

.storage-demo {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: flex-start;
}

.file-explorer {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.explorer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.explorer-controls {
    display: flex;
    gap: 16px;
}

.explorer-path {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--color-white);
}

.explorer-actions {
    display: flex;
    gap: 16px;
}

.explorer-content {
    padding: 20px;
}

.explorer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
}

.file-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
}

.file-item:hover {
    background: rgba(255, 127, 80, 0.2);
}

.file-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-name {
    font-size: 12px;
    color: var(--color-white);
    text-align: center;
    word-break: break-word;
}

.storage-features {
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
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

.sharing-demo {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: flex-start;
}

.share-modal {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.link-share {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.link-field {
    display: flex;
    gap: 8px;
}

.link-field input {
    flex: 1;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: var(--color-white);
    font-size: 14px;
}

.copy-btn {
    padding: 0 12px;
    background: rgba(255, 127, 80, 0.3);
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.link-permissions select,
.user-permission {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: var(--color-white);
    width: 100%;
    font-size: 14px;
}

.people-share {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.share-user-input {
    display: flex;
    gap: 8px;
}

.share-user-input input {
    flex: 1;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: var(--color-white);
    font-size: 14px;
}

.add-btn {
    padding: 0 12px;
    background: rgba(255, 127, 80, 0.3);
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.shared-users {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.shared-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.user-avatar {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.user-permission {
    width: 120px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: var(--color-white);
    font-size: 12px;
}

.share-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}

.cancel-btn {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: var(--color-white);
    cursor: pointer;
    font-size: 14px;
}

.share-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--color-tritary);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-size: 14px;
}

.sharing-features {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.sharing-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.security-shields {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
}

.shield-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.shield-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 127, 80, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 127, 80, 0.3);
}

.shield-text {
    text-align: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
}

.stat-card {
    text-align: center;
    padding: 30px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
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

    .storage-demo,
    .sharing-demo,
    .security-content,
    .integration-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .features-grid,
    .tech-grid,
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .connected-modules {
        grid-template-columns: 1fr;
    }
}
</style>
