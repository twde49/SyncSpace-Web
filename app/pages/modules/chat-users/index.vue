<template>
  <div>
    <Navbar />
    <div class="module-container mt-8">
      <div class="module-content">
        <div class="hero-section mb-16">
          <div class="hero-icon mb-6">
            <Icon name="ri:chat-3-line" size="400%" class="textColorTritary" />
          </div>
          <h1 class="megaFont textColorWhite mb-4">Module Messagerie</h1>
          <p class="largeFont textColorWhite mb-6 opacity-90">
            Communiquez en temps réel de manière sécurisée avec vos équipes
          </p>
          <div class="hero-badges">
            <span class="badge">
              <Icon name="ri:flashlight-line" />
              Temps réel
            </span>
            <span class="badge">
              <Icon name="ri:shield-check-line" />
              Chiffrement E2E
            </span>
            <span class="badge">
              <Icon name="ri:notification-line" />
              Notifications push
            </span>
          </div>
        </div>

        <section class="demo-section mb-16">
          <div class="section-header mb-8">
            <h2 class="largeFont textColorWhite mb-4">Communication Instantanée</h2>
            <div class="section-divider"></div>
            <p class="normalFont textColorWhite opacity-80">
              Découvrez la fluidité de notre système de messagerie basé sur WebSocket
            </p>
          </div>
          <div class="chat-demo">
            <div class="chat-window">
              <div class="chat-header">
                <div class="chat-user">
                  <div class="avatar">
                    <Icon name="ri:user-line" class="textColorWhite" />
                  </div>
                  <div class="user-info">
                    <span class="mediumFont textColorWhite">Équipe Projet Alpha</span>
                    <span class="status online">
                      <Icon name="ri:checkbox-blank-circle-fill" />
                      3 membres en ligne
                    </span>
                  </div>
                </div>
                <div class="chat-actions">
                  <Icon name="ri:more-line" class="textColorWhite" />
                </div>
              </div>
              <div class="chat-messages">
                <div
                  v-for="message in demoMessages"
                  :key="message.id"
                  :class="['message', message.type]"
                >
                  <div class="message-avatar" v-if="message.type === 'received'">
                    <Icon name="ri:user-line" />
                  </div>
                  <div class="message-content">
                    <div class="message-bubble">
                      <p>{{ message.text }}</p>
                    </div>
                    <div class="message-time">{{ message.time }}</div>
                  </div>
                </div>
              </div>
              <div class="chat-input">
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  class="message-input"
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                />
                <button class="send-btn" @click="sendMessage">
                  <Icon name="ri:send-plane-line" />
                </button>
              </div>
            </div>
            <div class="demo-features">
              <h3 class="mediumFont textColorWhite mb-4">Fonctionnalités en Temps Réel</h3>
              <div class="feature-list">
                <div class="feature-item">
                  <Icon name="ri:eye-line" class="textColorTritary" />
                  <div>
                    <h4 class="smallFont textColorWhite font-semibold">Indicateurs de lecture</h4>
                    <p class="xs-font textColorWhite opacity-70">Sachez quand vos messages sont lus</p>
                  </div>
                </div>
                <div class="feature-item">
                  <Icon name="ri:edit-line" class="textColorTritary" />
                  <div>
                    <h4 class="smallFont textColorWhite font-semibold">Indicateur de frappe</h4>
                    <p class="xs-font textColorWhite opacity-70">Voyez qui est en train d'écrire</p>
                  </div>
                </div>
                <div class="feature-item">
                  <Icon name="ri:notification-badge-line" class="textColorTritary" />
                  <div>
                    <h4 class="smallFont textColorWhite font-semibold">Notifications intelligentes</h4>
                    <p class="xs-font textColorWhite opacity-70">Alertes personnalisées selon le contexte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="features-section mb-16">
          <div class="section-header mb-8">
            <h2 class="largeFont textColorWhite mb-4">Fonctionnalités Avancées</h2>
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
            <h2 class="largeFont textColorWhite mb-4">Sécurité & Confidentialité</h2>
            <div class="section-divider"></div>
            <p class="normalFont textColorWhite opacity-80">
              Vos conversations sont protégées par les plus hauts standards de sécurité
            </p>
          </div>
          <div class="security-content">
            <div class="security-visual">
              <div class="encryption-demo">
                <div class="encryption-step">
                  <div class="step-icon">
                    <Icon name="ri:message-line" size="150%" class="textColorWhite" />
                  </div>
                  <div class="step-arrow">
                    <Icon name="ri:arrow-right-line" class="textColorTritary" />
                  </div>
                  <div class="step-description">
                    <span class="smallFont textColorWhite">Message original</span>
                  </div>
                </div>
                <div class="encryption-step">
                  <div class="step-icon">
                    <Icon name="ri:shield-keyhole-line" size="150%" class="textColorTritary" />
                  </div>
                  <div class="step-arrow">
                    <Icon name="ri:arrow-right-line" class="textColorTritary" />
                  </div>
                  <div class="step-description">
                    <span class="smallFont textColorWhite">Chiffrement E2E</span>
                  </div>
                </div>
                <div class="encryption-step">
                  <div class="step-icon">
                    <Icon name="ri:send-plane-line" size="150%" class="textColorWhite" />
                  </div>
                  <div class="step-description">
                    <span class="smallFont textColorWhite">Transmission sécurisée</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="security-features">
              <div class="security-item">
                <Icon name="ri:lock-line" class="textColorTritary" />
                <div>
                  <h4 class="mediumFont textColorWhite mb-2">Chiffrement End-to-End</h4>
                  <p class="smallFont textColorWhite opacity-80">
                    Seuls vous et vos destinataires pouvez lire vos messages.
                    Même nos serveurs ne peuvent pas les déchiffrer.
                  </p>
                </div>
              </div>
              <div class="security-item">
                <Icon name="ri:key-2-line" class="textColorTritary" />
                <div>
                  <h4 class="mediumFont textColorWhite mb-2">Clés de Session</h4>
                  <p class="smallFont textColorWhite opacity-80">
                    Chaque conversation utilise des clés uniques générées
                    automatiquement et renouvelées régulièrement.
                  </p>
                </div>
              </div>
              <div class="security-item">
                <Icon name="ri:user-forbid-line" class="textColorTritary" />
                <div>
                  <h4 class="mediumFont textColorWhite mb-2">Contrôle d'Accès</h4>
                  <p class="smallFont textColorWhite opacity-80">
                    Gestion fine des permissions et possibilité de révoquer
                    l'accès à tout moment.
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
                Le module Chat s'intègre parfaitement avec tous les autres modules de SyncSpace
                pour créer un environnement de travail vraiment unifié.
              </p>
              <div class="integration-examples">
                <div class="integration-item">
                  <Icon name="ri:calendar-event-line" class="textColorTritary" />
                  <div>
                    <h4 class="mediumFont textColorWhite">Calendrier</h4>
                    <p class="smallFont textColorWhite opacity-70">
                      Créez des événements directement depuis une conversation
                    </p>
                  </div>
                </div>
                <div class="integration-item">
                  <Icon name="ri:folder-shared-line" class="textColorTritary" />
                  <div>
                    <h4 class="mediumFont textColorWhite">Drive</h4>
                    <p class="smallFont textColorWhite opacity-70">
                      Partagez instantanément des fichiers dans vos discussions
                    </p>
                  </div>
                </div>
                <div class="integration-item">
                  <Icon name="ri:key-line" class="textColorTritary" />
                  <div>
                    <h4 class="mediumFont textColorWhite">Password Manager</h4>
                    <p class="smallFont textColorWhite opacity-70">
                      Partagez des identifiants de manière sécurisée
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="integration-visual">
              <div class="modules-connection">
                <div class="center-module">
                  <Icon name="ri:chat-3-line" size="200%" class="textColorTritary" />
                  <span class="smallFont textColorWhite">Chat</span>
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

        <section class="technical-section mb-16">
          <div class="section-header mb-8">
            <h2 class="largeFont textColorWhite mb-4">Architecture Technique</h2>
            <div class="section-divider"></div>
          </div>
          <div class="tech-grid">
            <div class="tech-card">
              <Icon name="ri:wireless-charging-line" size="150%" class="textColorTritary mb-4" />
              <h3 class="mediumFont textColorWhite mb-3">WebSocket</h3>
              <ul class="tech-list">
                <li>Communication bidirectionnelle</li>
                <li>Latence ultra-faible</li>
                <li>Reconnexion automatique</li>
                <li>Gestion des déconnexions</li>
              </ul>
            </div>
            <div class="tech-card">
              <Icon name="ri:server-line" size="150%" class="textColorTritary mb-4" />
              <h3 class="mediumFont textColorWhite mb-3">Backend</h3>
              <ul class="tech-list">
                <li>Node.js pour le temps réel</li>
                <li>Symfony pour les API REST</li>
                <li>Redis pour le cache</li>
                <li>PostgreSQL pour persistance</li>
              </ul>
            </div>
            <div class="tech-card">
              <Icon name="ri:smartphone-line" size="150%" class="textColorTritary mb-4" />
              <h3 class="mediumFont textColorWhite mb-3">Notifications</h3>
              <ul class="tech-list">
                <li>Push notifications natives</li>
                <li>Notifications desktop</li>
                <li>Sons personnalisables</li>
                <li>Mode silencieux intelligent</li>
              </ul>
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
              <div class="stat-number textColorTritary megaFont">&lt;100ms</div>
              <div class="stat-label normalFont textColorWhite">Latence moyenne</div>
            </div>
            <div class="stat-card">
              <div class="stat-number textColorTritary megaFont">99.9%</div>
              <div class="stat-label normalFont textColorWhite">Temps de disponibilité</div>
            </div>
            <div class="stat-card">
              <div class="stat-number textColorTritary megaFont">∞</div>
              <div class="stat-label normalFont textColorWhite">Messages par jour</div>
            </div>
            <div class="stat-card">
              <div class="stat-number textColorTritary megaFont">256-bit</div>
              <div class="stat-label normalFont textColorWhite">Chiffrement AES</div>
            </div>
          </div>
        </section>

        <section class="cta-section">
          <div class="cta-content">
            <Icon name="ri:chat-heart-line" size="300%" class="textColorTritary mb-6" />
            <h2 class="largeFont textColorWhite mb-4">Prêt à Communiquer en Toute Sécurité ?</h2>
            <p class="normalFont textColorWhite opacity-90 mb-6">
              Découvrez la messagerie nouvelle génération qui respecte votre vie privée
            </p>
            <div class="cta-buttons">
                <NuxtLink to="/register" class="cta-btn primary">
                  <Icon name="ri:chat-new-line" />
                  Commencer à chatter
                </NuxtLink>
                <NuxtLink to="/contact" class="cta-btn secondary">
                  <Icon name="ri:question-line" />
                  Questions sur la sécurité
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

const newMessage = ref("");

const demoMessages = ref([
    {
        id: 1,
        type: "received",
        text: "Salut ! Tu as pu finaliser les maquettes pour le projet ?",
        time: "14:23"
    },
    {
        id: 2,
        type: "sent",
        text: "Oui, je viens de les uploader dans le Drive. Tu peux y jeter un œil !",
        time: "14:25"
    },
    {
        id: 3,
        type: "received",
        text: "Parfait ! On programme une réunion pour demain ?",
        time: "14:26"
    },
    {
        id: 4,
        type: "sent",
        text: "Bonne idée, je crée l'événement dans le calendrier partagé 📅",
        time: "14:27"
    }
]);

const mainFeatures = ref([
    {
        id: 1,
        icon: "ri:flashlight-line",
        title: "Temps Réel",
        description: "Communication instantanée basée sur WebSocket pour une expérience fluide et réactive.",
        benefits: [
            "Latence ultra-faible (<100ms)",
            "Indicateurs de lecture en temps réel",
            "Notifications de frappe instantanées",
            "Synchronisation multi-appareils"
        ]
    },
    {
        id: 2,
        icon: "ri:team-line",
        title: "Conversations Groupées",
        description: "Organisez vos équipes avec des conversations de groupe sécurisées et structurées.",
        benefits: [
            "Groupes illimités",
            "Gestion des rôles et permissions",
            "Conversations privées et publiques",
            "Archivage automatique"
        ]
    },
    {
        id: 3,
        icon: "ri:file-text-line",
        title: "Partage de Fichiers",
        description: "Partagez instantanément des documents, images et autres fichiers directement dans vos conversations.",
        benefits: [
            "Glisser-déposer intuitif",
            "Prévisualisation intégrée",
            "Stockage sécurisé",
            "Historique des partages"
        ]
    },
    {
        id: 4,
        icon: "ri:search-line",
        title: "Recherche Avancée",
        description: "Retrouvez facilement vos conversations et messages grâce à notre moteur de recherche intelligent.",
        benefits: [
            "Recherche full-text",
            "Filtres par date/utilisateur",
            "Recherche dans les fichiers",
            "Favoris et épinglés"
        ]
    }
]);

const connectedModules = ref([
    { id: 1, name: "Calendrier", icon: "ri:calendar-line" },
    { id: 2, name: "Drive", icon: "ri:folder-line" },
    { id: 3, name: "Passwords", icon: "ri:key-line" },
    { id: 4, name: "Music", icon: "ri:music-line" }
]);

const sendMessage = () => {
    if (newMessage.value.trim()) {
        demoMessages.value.push({
            id: Date.now(),
            type: "sent",
            text: newMessage.value,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        });
        newMessage.value = "";
    }
};
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

.chat-demo {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: flex-start;
}

.chat-window {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-user {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 40px;
    height: 40px;
    background: rgba(255, 127, 80, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-white);
    opacity: 0.7;
}

.status.online {
    color: #4ade80;
}

.chat-messages {
    padding: 20px;
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.message {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

.message.sent {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.message-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 70%;
}

.message.sent .message-content {
    align-items: flex-end;
}

.message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-white);
}

.message.sent .message-bubble {
    background: rgba(255, 127, 80, 0.8);
    color: #fff;
}

.message-time {
    font-size: 11px;
    color: var(--color-white);
    opacity: 0.5;
    padding: 0 8px;
}

.chat-input {
    display: flex;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    gap: 12px;
}

.message-input {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    color: var(--color-white);
    outline: none;
}

.message-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.send-btn {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #ff7f50, #ff5722);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.send-btn:hover {
    transform: scale(1.05);
}

.demo-features {
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

.security-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.encryption-demo {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.encryption-step {
    display: flex;
    align-items: center;
    gap: 20px;
}

.step-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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

.integration-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 60px;
    align-items: center;
}

.integration-examples {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.tech-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.tech-list {
    list-style: none;
    padding: 0;
    text-align: left;
}

.tech-list li {
    padding: 8px 0;
    color: var(--color-white);
    opacity: 0.8;
    font-size: 14px;
}

.tech-list li:before {
    content: "→";
    color: var(--color-tritary);
    margin-right: 8px;
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
    .chat-demo {
        grid-template-columns: 1fr;
        gap: 30px;
    }

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
