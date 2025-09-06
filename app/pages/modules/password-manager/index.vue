<template>
    <div>
        <Navbar />
        <div class="module-container mt-8">
            <div class="module-content">
                <div class="hero-section mb-16">
                    <div class="hero-icon mb-6">
                        <Icon name="ri:key-line" size="400%" class="textColorTritary" />
                    </div>
                    <h1 class="megaFont textColorWhite mb-4">Module Gestionnaire de Mots de Passe</h1>
                    <p class="largeFont textColorWhite mb-6 opacity-90">
                        Sécurisez, organisez et accédez facilement à vos identifiants
                    </p>
                    <div class="hero-badges">
                        <span class="badge">
                            <Icon name="ri:shield-check-line" />
                            Chiffrement AES-256
                        </span>
                        <span class="badge">
                            <Icon name="ri:share-forward-line" />
                            Partage sécurisé
                        </span>
                        <span class="badge">
                            <Icon name="ri:check-double-line" />
                            Audit de sécurité
                        </span>
                    </div>
                </div>

                <section class="password-demo-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Gestionnaire Sécurisé</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Une interface intuitive pour gérer tous vos identifiants en toute sécurité
                        </p>
                    </div>
                    <div class="password-demo">
                        <div class="password-vault">
                            <div class="vault-header">
                                <div class="vault-search">
                                    <Icon name="ri:search-line" class="textColorWhite opacity-50" />
                                    <input type="text" placeholder="Rechercher..." />
                                </div>
                                <button class="add-password-btn">
                                    <Icon name="ri:add-line" class="textColorWhite" />
                                    Ajouter
                                </button>
                            </div>
                            <div class="vault-categories">
                                <div class="category active">
                                    <Icon name="ri:global-line" class="textColorTritary" />
                                    <span>Sites Web</span>
                                    <span class="count">12</span>
                                </div>
                                <div class="category">
                                    <Icon name="ri:bank-card-line" class="textColorWhite" />
                                    <span>Cartes Bancaires</span>
                                    <span class="count">3</span>
                                </div>
                                <div class="category">
                                    <Icon name="ri:file-text-line" class="textColorWhite" />
                                    <span>Notes Sécurisées</span>
                                    <span class="count">5</span>
                                </div>
                                <div class="category">
                                    <Icon name="ri:user-line" class="textColorWhite" />
                                    <span>Identités</span>
                                    <span class="count">2</span>
                                </div>
                            </div>
                            <div class="vault-items">
                                <div class="password-item">
                                    <div class="site-icon">
                                        <Icon name="ri:facebook-circle-fill" class="social-icon" />
                                    </div>
                                    <div class="password-details">
                                        <span class="site-name">Facebook</span>
                                        <span class="username">user@example.com</span>
                                    </div>
                                    <div class="password-actions">
                                        <button class="action-btn">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                        <button class="action-btn">
                                            <Icon name="ri:eye-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                </div>
                                <div class="password-item">
                                    <div class="site-icon">
                                        <Icon name="ri:amazon-fill" class="social-icon" />
                                    </div>
                                    <div class="password-details">
                                        <span class="site-name">Amazon</span>
                                        <span class="username">john.doe@example.com</span>
                                    </div>
                                    <div class="password-actions">
                                        <button class="action-btn">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                        <button class="action-btn">
                                            <Icon name="ri:eye-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                </div>
                                <div class="password-item">
                                    <div class="site-icon">
                                        <Icon name="ri:google-fill" class="social-icon" />
                                    </div>
                                    <div class="password-details">
                                        <span class="site-name">Google</span>
                                        <span class="username">user@gmail.com</span>
                                    </div>
                                    <div class="password-actions">
                                        <button class="action-btn">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                        <button class="action-btn">
                                            <Icon name="ri:eye-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                </div>
                                <div class="password-item">
                                    <div class="site-icon">
                                        <Icon name="ri:twitter-fill" class="social-icon" />
                                    </div>
                                    <div class="password-details">
                                        <span class="site-name">Twitter</span>
                                        <span class="username">@username</span>
                                    </div>
                                    <div class="password-actions">
                                        <button class="action-btn">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                        <button class="action-btn">
                                            <Icon name="ri:eye-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="password-details-pane">
                            <div class="details-header">
                                <div class="site-details">
                                    <div class="large-icon">
                                        <Icon name="ri:facebook-circle-fill" size="300%" class="social-icon" />
                                    </div>
                                    <div>
                                        <h3 class="mediumFont textColorWhite">Facebook</h3>
                                        <NuxtLink to="#" class="site-url textColorTritary">www.facebook.com</NuxtLink>
                                    </div>
                                </div>
                                <div class="details-actions">
                                    <button class="action-btn">
                                        <Icon name="ri:edit-line" class="textColorWhite" />
                                    </button>
                                    <button class="action-btn">
                                        <Icon name="ri:delete-bin-line" class="textColorWhite" />
                                    </button>
                                </div>
                            </div>
                            <div class="details-content">
                                <div class="detail-field">
                                    <label>Identifiant</label>
                                    <div class="field-value">
                                        <input type="text" value="user@example.com" readonly />
                                        <button class="field-action">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                </div>
                                <div class="detail-field">
                                    <label>Mot de passe</label>
                                    <div class="field-value">
                                        <input type="password" value="●●●●●●●●●●●●" readonly />
                                        <button class="field-action">
                                            <Icon name="ri:eye-line" class="textColorWhite" />
                                        </button>
                                        <button class="field-action">
                                            <Icon name="ri:clipboard-line" class="textColorWhite" />
                                        </button>
                                    </div>
                                </div>
                                <div class="detail-field">
                                    <label>Notes</label>
                                    <div class="field-value">
                                        <textarea readonly>Compte personnel</textarea>
                                    </div>
                                </div>
                                <div class="security-status">
                                    <div class="status-header">
                                        <h4 class="smallFont textColorWhite">Statut de sécurité</h4>
                                        <span class="security-badge medium">Moyen</span>
                                    </div>
                                    <div class="status-details">
                                        <div class="status-item warning">
                                            <Icon name="ri:error-warning-line" class="textColorTritary" />
                                            <span>Mot de passe réutilisé sur d'autres sites</span>
                                        </div>
                                        <div class="status-item ok">
                                            <Icon name="ri:checkbox-circle-line" class="textColorTritary" />
                                            <span>Longueur suffisante (12 caractères)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="details-footer">
                                <span class="last-update">Dernière mise à jour: 12 mai 2023</span>
                                <button class="generate-btn">
                                    <Icon name="ri:refresh-line" class="textColorWhite" />
                                    Générer un mot de passe
                                </button>
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

                <section class="security-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Sécurité de Niveau Militaire</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Vos données sensibles sont protégées par les technologies de chiffrement les plus avancées
                        </p>
                    </div>
                    <div class="security-content">
                        <div class="security-visual">
                            <div class="security-layers">
                                <div class="layer layer-1">
                                    <span class="layer-label">Mot de passe maître</span>
                                </div>
                                <div class="layer layer-2">
                                    <span class="layer-label">Dérivation de clé PBKDF2</span>
                                </div>
                                <div class="layer layer-3">
                                    <span class="layer-label">Chiffrement AES-256</span>
                                </div>
                                <div class="layer layer-4">
                                    <span class="layer-label">Données chiffrées</span>
                                </div>
                            </div>
                        </div>
                        <div class="security-features">
                            <div class="security-item">
                                <Icon name="ri:lock-password-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Chiffrement de Bout en Bout</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Vos données sont chiffrées localement avant d'être stockées. Même nous ne
                                        pouvons
                                        pas y accéder.
                                    </p>
                                </div>
                            </div>
                            <div class="security-item">
                                <Icon name="ri:key-2-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Mot de Passe Maître Unique</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Un seul mot de passe à retenir pour sécuriser l'ensemble de votre coffre-fort
                                        numérique.
                                    </p>
                                </div>
                            </div>
                            <div class="security-item">
                                <Icon name="ri:fingerprint-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Authentification Biométrique</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Utilisez votre empreinte digitale ou reconnaissance faciale pour un accès rapide
                                        et sécurisé.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="generator-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Générateur de Mots de Passe</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Créez des mots de passe forts et uniques en un seul clic
                        </p>
                    </div>
                    <div class="generator-demo">
                        <div class="generator-card">
                            <div class="generated-password">
                                <input type="text" value="rT9!Kb#p2xVz@L7c" readonly />
                                <button class="copy-btn">
                                    <Icon name="ri:clipboard-line" class="textColorWhite" />
                                </button>
                                <button class="refresh-btn">
                                    <Icon name="ri:refresh-line" class="textColorWhite" />
                                </button>
                            </div>
                            <div class="generator-options">
                                <div class="option-row">
                                    <label>Longueur</label>
                                    <div class="range-control">
                                        <input type="range" min="8" max="32" value="16" />
                                        <span class="range-value">16</span>
                                    </div>
                                </div>
                                <div class="option-row">
                                    <label>Inclure majuscules</label>
                                    <div class="toggle-switch">
                                        <div class="toggle-handle active"></div>
                                    </div>
                                </div>
                                <div class="option-row">
                                    <label>Inclure chiffres</label>
                                    <div class="toggle-switch">
                                        <div class="toggle-handle active"></div>
                                    </div>
                                </div>
                                <div class="option-row">
                                    <label>Inclure symboles</label>
                                    <div class="toggle-switch">
                                        <div class="toggle-handle active"></div>
                                    </div>
                                </div>
                                <div class="option-row">
                                    <label>Éviter les caractères ambigus</label>
                                    <div class="toggle-switch">
                                        <div class="toggle-handle active"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="password-strength">
                                <div class="strength-label">Force du mot de passe</div>
                                <div class="strength-meter">
                                    <div class="strength-segment filled"></div>
                                    <div class="strength-segment filled"></div>
                                    <div class="strength-segment filled"></div>
                                    <div class="strength-segment filled"></div>
                                    <div class="strength-segment"></div>
                                </div>
                                <div class="strength-text">Très fort</div>
                            </div>
                            <button class="generate-password-btn">
                                <Icon name="ri:refresh-line" class="textColorWhite" />
                                Générer un nouveau mot de passe
                            </button>
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
                                Le module Gestionnaire de Mots de Passe s'intègre parfaitement avec les autres
                                modules de SyncSpace pour une expérience utilisateur fluide.
                            </p>
                            <div class="integration-examples">
                                <div class="integration-item">
                                    <Icon name="ri:chat-3-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Chat</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Partagez des identifiants de manière sécurisée avec vos collaborateurs
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:folder-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Drive</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Sauvegardez automatiquement votre coffre-fort dans votre espace sécurisé
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:global-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Navigateur</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Remplissage automatique des formulaires web grâce à l'extension
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="integration-visual">
                            <div class="modules-connection">
                                <div class="center-module">
                                    <Icon name="ri:key-line" size="200%" class="textColorTritary" />
                                    <span class="smallFont textColorWhite">Password</span>
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
                        <Icon name="ri:shield-keyhole-line" size="300%" class="textColorTritary mb-6" />
                        <h2 class="largeFont textColorWhite mb-4">Prêt à Sécuriser Vos Identifiants ?</h2>
                        <p class="normalFont textColorWhite opacity-90 mb-6">
                            Découvrez comment le module Gestionnaire de Mots de Passe peut simplifier et sécuriser votre
                            vie numérique
                        </p>
                        <div class="cta-buttons">
                            <NuxtLink to="/register" class="cta-btn primary">
                                <Icon name="ri:shield-check-line" />
                                Commencer à sécuriser
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
        icon: "ri:lock-line",
        title: "Stockage Sécurisé",
        description: "Stockez tous vos mots de passe, identifiants, cartes bancaires et notes sensibles en toute sécurité.",
        benefits: [
            "Chiffrement AES-256",
            "Zéro connaissance",
            "Protection par mot de passe maître",
            "Authentification à deux facteurs"
        ]
    },
    {
        id: 2,
        icon: "ri:shake-hands-line",
        title: "Partage Sécurisé",
        description: "Partagez des identifiants avec des collègues ou des membres de votre famille en toute sécurité.",
        benefits: [
            "Droits d'accès personnalisables",
            "Liens de partage temporaires",
            "Historique des partages",
            "Révocation instantanée"
        ]
    },
    {
        id: 3,
        icon: "ri:shield-check-line",
        title: "Audit de Sécurité",
        description: "Analysez vos mots de passe pour détecter les vulnérabilités et améliorez votre sécurité.",
        benefits: [
            "Détection des mots de passe faibles",
            "Alerte de mots de passe réutilisés",
            "Surveillance des fuites de données",
            "Recommandations personnalisées"
        ]
    },
    {
        id: 4,
        icon: "ri:refresh-line",
        title: "Générateur de Mots de Passe",
        description: "Créez des mots de passe forts et uniques pour chacun de vos comptes.",
        benefits: [
            "Options de personnalisation",
            "Mots de passe prononçables",
            "Phrases secrètes mémorisables",
            "Conformité aux politiques de sécurité"
        ]
    }
]);

const connectedModules = ref([
    { id: 1, name: "Chat", icon: "ri:chat-3-line" },
    { id: 2, name: "Drive", icon: "ri:folder-line" },
    { id: 3, name: "Navigateur", icon: "ri:global-line" },
    { id: 4, name: "Calendrier", icon: "ri:calendar-line" }
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

.password-demo {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 30px;
    margin-top: 40px;
}

.password-vault {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    height: 500px;
}

.vault-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.vault-search {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 8px 12px;
    flex: 1;
    margin-right: 16px;
}

.vault-search input {
    background: transparent;
    border: none;
    color: var(--color-white);
    margin-left: 8px;
    flex: 1;
    outline: none;
}

.vault-search input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.add-password-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--color-tritary);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    font-size: 14px;
}

.vault-categories {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
    overflow-x: auto;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    font-size: 14px;
    color: var(--color-white);
}

.category.active {
    background: rgba(255, 127, 80, 0.2);
    border: 1px solid rgba(255, 127, 80, 0.3);
}

.count {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    color: var(--color-white);
}

.vault-items {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
}

.password-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.password-item:hover {
    background: rgba(255, 255, 255, 0.08);
}

.site-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.social-icon {
    color: #4267B2;
    font-size: 24px;
}

.password-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.site-name {
    font-size: 16px;
    color: var(--color-white);
}

.username {
    font-size: 13px;
    color: var(--color-white);
    opacity: 0.7;
}

.password-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;
}

.action-btn:hover {
    opacity: 1;
}

.password-details-pane {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    height: 500px;
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.site-details {
    display: flex;
    align-items: center;
    gap: 16px;
}

.large-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.site-url {
    font-size: 13px;
    text-decoration: none;
}

.details-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.detail-field {
    margin-bottom: 20px;
}

.detail-field label {
    display: block;
    font-size: 14px;
    color: var(--color-white);
    opacity: 0.7;
    margin-bottom: 8px;
}

.field-value {
    display: flex;
    gap: 8px;
}

.field-value input,
.field-value textarea {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--color-white);
    font-size: 14px;
    outline: none;
}

.field-value textarea {
    min-height: 80px;
    resize: vertical;
}

.field-action {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    padding: 0 12px;
    cursor: pointer;
}

.security-status {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
}

.status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.security-badge {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 20px;
}

.security-badge.medium {
    background: rgba(255, 152, 0, 0.2);
    color: #FFA000;
}

.status-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--color-white);
}

.status-item.warning {
    color: #FFA000;
}

.status-item.ok {
    color: #4CAF50;
}

.details-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.last-update {
    font-size: 12px;
    color: var(--color-white);
    opacity: 0.6;
}

.generate-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--color-tritary);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
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

.security-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    margin-top: 40px;
}

.security-visual {
    padding: 30px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.security-layers {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.layer {
    position: relative;
    padding: 16px;
    border-radius: 8px;
    color: var(--color-white);
    text-align: center;
}

.layer-1 {
    background: rgba(255, 127, 80, 0.3);
}

.layer-2 {
    background: rgba(255, 127, 80, 0.5);
}

.layer-3 {
    background: rgba(255, 127, 80, 0.7);
}

.layer-4 {
    background: rgba(255, 127, 80, 0.9);
}

.security-features {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.security-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.generator-demo {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.generator-card {
    width: 100%;
    max-width: 600px;
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.generated-password {
    display: flex;
    gap: 8px;
    margin-bottom: 30px;
}

.generated-password input {
    flex: 1;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: var(--color-tritary);
    font-size: 16px;
    font-family: monospace;
    outline: none;
    text-align: center;
}

.copy-btn,
.refresh-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    width: 48px;
    cursor: pointer;
}

.generator-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 30px;
}

.option-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.option-row label {
    color: var(--color-white);
    font-size: 14px;
}

.range-control {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 200px;
}

.range-control input {
    flex: 1;
}

.range-value {
    font-size: 14px;
    color: var(--color-white);
    width: 30px;
    text-align: center;
}

.toggle-switch {
    width: 44px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
}

.toggle-handle {
    width: 20px;
    height: 20px;
    background: var(--color-white);
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.3s ease;
}

.toggle-handle.active {
    left: calc(100% - 22px);
    background: var(--color-tritary);
}

.password-strength {
    margin-bottom: 30px;
}

.strength-label {
    color: var(--color-white);
    font-size: 14px;
    margin-bottom: 8px;
}

.strength-meter {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.strength-segment {
    height: 8px;
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

.strength-segment.filled {
    background: #4CAF50;
}

.strength-text {
    text-align: right;
    color: #4CAF50;
    font-size: 14px;
}

.generate-password-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background: var(--color-tritary);
    border: none;
    border-radius: 8px;
    padding: 12px;
    color: white;
    cursor: pointer;
    font-size: 16px;
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
    .password-demo {
        grid-template-columns: 1fr;
    }

    .security-content,
    .integration-content {
        grid-template-columns: 1fr;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .connected-modules {
        grid-template-columns: 1fr;
    }
}
</style>
