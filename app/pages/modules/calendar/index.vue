<template>
  <div>
    <Navbar />
    <div class="module-container mt-8">
      <div class="module-content">
        <!-- Hero Section -->
        <div class="hero-section mb-16">
          <div class="hero-icon mb-6">
            <Icon name="ri:calendar-line" size="400%" class="textColorTritary" />
          </div>
          <h1 class="megaFont textColorWhite mb-4">Module Calendrier</h1>
          <p class="largeFont textColorWhite mb-6 opacity-90">
            Organisez votre temps et ne manquez plus jamais un événement important
          </p>
          <div class="hero-badges">
            <span class="badge">
              <Icon name="ri:time-line" />
              Rappels intelligents
            </span>
            <span class="badge">
              <Icon name="ri:refresh-line" />
              Synchronisation externe
            </span>
            <span class="badge">
              <Icon name="ri:share-line" />
              Partage collaboratif
            </span>
          </div>
        </div>

        <!-- Main Features -->
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

        <!-- Views Section -->
        <section class="views-section mb-16">
          <div class="section-header mb-8">
            <h2 class="largeFont textColorWhite mb-4">Vues Multiples</h2>
            <div class="section-divider"></div>
            <p class="normalFont textColorWhite opacity-80">
              Adaptez l'affichage selon vos besoins et votre façon de travailler
            </p>
          </div>
          <div class="views-tabs">
            <button 
              v-for="view in calendarViews" 
              :key="view.id"
              @click="activeView = view.id"
              :class="['view-tab', { active: activeView === view.id }]"
            >
              <Icon :name="view.icon" />
              {{ view.name }}
            </button>
          </div>
          <div class="view-showcase">
            <div class="view-preview">
              <div class="calendar-mockup">
                <div class="calendar-header">
                  <div class="month-nav">
                    <Icon name="ri:arrow-left-s-line" class="textColorWhite" />
                    <span class="mediumFont textColorWhite">{{ getCurrentView().title }}</span>
                    <Icon name="ri:arrow-right-s-line" class="textColorWhite" />
                  </div>
                </div>
                <div class="calendar-grid">
                  <div 
                    v-for="day in getCurrentView().days" 
                    :key="day"
                    :class="['calendar-day', { 'has-event': Math.random() > 0.7 }]"
                  >
                    <span class="day-number">{{ day }}</span>
                    <div v-if="Math.random() > 0.8" class="event-dot"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="view-description">
              <h3 class="mediumFont textColorWhite mb-3">{{ getCurrentView().name }}</h3>
              <p class="normalFont textColorWhite opacity-80 mb-4">{{ getCurrentView().description }}</p>
              <div class="view-benefits">
                <div 
                  v-for="benefit in getCurrentView().benefits" 
                  :key="benefit"
                  class="benefit-tag"
                >
                  {{ benefit }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Integration Section -->
        <section class="integration-section mb-16">
          <div class="section-header mb-8">
            <h2 class="largeFont textColorWhite mb-4">Synchronisation & Intégrations</h2>
            <div class="section-divider"></div>
          </div>
          <div class="integration-content">
            <div class="integration-text">
              <p class="normalFont textColorWhite mb-6">
                Le module Calendrier se synchronise parfaitement avec vos calendriers existants 
                et s'intègre aux autres modules de SyncSpace pour une expérience unifiée.
              </p>
              <div class="sync-features">
                <div class="sync-item">
                  <Icon name="ri:google-line" class="textColorTritary" />
                  <div>
                    <h4 class="mediumFont textColorWhite">Google Calendar</h4>
                    <p class="smallFont textColorWhite opacity-70">Synchronisation bidirectionnelle en temps réel</p>
                  </div>
                </div>
                <div class="sync-item">
                  <Icon name="ri:microsoft-line" class="textColorTritary" />
                  <div>
                    <h4 class="mediumFont textColorWhite">Outlook</h4>
                    <p class="smallFont textColorWhite opacity-70">Import/export automatique des événements</p>
                  </div>
                </div>
                <div class="sync-item">
                  <Icon name="ri:chat-3-line" class="textColorTritary" />
                  <div>
                    <h4 class="mediumFont textColorWhite">Module Chat</h4>
                    <p class="smallFont textColorWhite opacity-70">Création d'événements depuis les conversations</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="integration-visual">
              <div class="sync-diagram">
                <div class="center-node">
                  <Icon name="ri:calendar-line" size="150%" class="textColorTritary" />
                  <span class="smallFont textColorWhite">Calendrier</span>
                </div>
                <div class="sync-nodes">
                  <div class="sync-node" v-for="i in 4" :key="i">
                    <Icon name="ri:arrow-left-right-line" class="textColorWhite opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Technical Details -->
        <section class="technical-section mb-16">
          <div class="section-header mb-8">
            <h2 class="largeFont textColorWhite mb-4">Spécifications Techniques</h2>
            <div class="section-divider"></div>
          </div>
          <div class="tech-grid">
            <div class="tech-card">
              <Icon name="ri:notification-line" size="150%" class="textColorTritary mb-4" />
              <h3 class="mediumFont textColorWhite mb-3">Notifications</h3>
              <ul class="tech-list">
                <li>WebSocket temps réel</li>
                <li>Notifications push</li>
                <li>Rappels personnalisables</li>
                <li>Alertes par email</li>
              </ul>
            </div>
            <div class="tech-card">
              <Icon name="ri:database-line" size="150%" class="textColorTritary mb-4" />
              <h3 class="mediumFont textColorWhite mb-3">Stockage</h3>
              <ul class="tech-list">
                <li>PostgreSQL</li>
                <li>Chiffrement des données</li>
                <li>Sauvegarde automatique</li>
                <li>Historique des modifications</li>
              </ul>
            </div>
            <div class="tech-card">
              <Icon name="ri:code-line" size="150%" class="textColorTritary mb-4" />
              <h3 class="mediumFont textColorWhite mb-3">API</h3>
              <ul class="tech-list">
                <li>REST API complète</li>
                <li>Authentification JWT</li>
                <li>Rate limiting</li>
                <li>Documentation OpenAPI</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
          <div class="cta-content">
            <Icon name="ri:calendar-check-line" size="300%" class="textColorTritary mb-6" />
            <h2 class="largeFont textColorWhite mb-4">Prêt à Organiser Votre Temps ?</h2>
            <p class="normalFont textColorWhite opacity-90 mb-6">
              Découvrez comment le module Calendrier peut transformer votre gestion du temps
            </p>
            <div class="cta-buttons">
              <a href="/register" class="cta-btn primary">
                <Icon name="ri:play-circle-line" />
                Essayer gratuitement
              </a>
              <a href="/contact" class="cta-btn secondary">
                <Icon name="ri:question-line" />
                Poser une question
              </a>
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

const activeView = ref(1);

const mainFeatures = ref([
  {
    id: 1,
    icon: "ri:eye-line",
    title: "Vue Interactive",
    description: "Naviguez facilement entre les vues mensuelle, hebdomadaire et quotidienne pour une gestion visuelle optimale.",
    benefits: [
      "Interface intuitive et responsive",
      "Navigation fluide entre les périodes",
      "Affichage personnalisable",
      "Zoom adaptatif selon le contexte"
    ]
  },
  {
    id: 2,
    icon: "ri:add-circle-line",
    title: "Création d'Événements",
    description: "Créez et modifiez vos événements en quelques clics avec toutes les informations nécessaires.",
    benefits: [
      "Formulaire simple et complet",
      "Gestion des participants",
      "Localisation intégrée",
      "Récurrence personnalisable"
    ]
  },
  {
    id: 3,
    icon: "ri:alarm-line",
    title: "Rappels Intelligents",
    description: "Des notifications personnalisées pour ne jamais manquer un rendez-vous important.",
    benefits: [
      "Rappels multiples par événement",
      "Notifications push en temps réel",
      "Alertes par email optionnelles",
      "Configuration granulaire"
    ]
  },
  {
    id: 4,
    icon: "ri:team-line",
    title: "Partage Collaboratif",
    description: "Partagez vos événements avec vos collègues et gérez facilement les réunions d'équipe.",
    benefits: [
      "Invitations automatiques",
      "Gestion des confirmations",
      "Calendriers partagés",
      "Synchronisation équipe"
    ]
  }
]);

const calendarViews = ref([
  {
    id: 1,
    name: "Mensuelle",
    icon: "ri:calendar-2-line",
    title: "Mars 2025",
    description: "Vue d'ensemble complète du mois pour planifier à long terme",
    benefits: ["Planification globale", "Vue d'ensemble", "Tendances mensuelles"],
    days: Array.from({length: 31}, (_, i) => i + 1)
  },
  {
    id: 2,
    name: "Hebdomadaire",
    icon: "ri:calendar-week-line",
    title: "Semaine 12, 2025",
    description: "Focus sur la semaine courante avec détails horaires",
    benefits: ["Planning détaillé", "Gestion horaire", "Optimisation semaine"],
    days: ["Lun 17", "Mar 18", "Mer 19", "Jeu 20", "Ven 21", "Sam 22", "Dim 23"]
  },
  {
    id: 3,
    name: "Quotidienne",
    icon: "ri:calendar-event-line",
    title: "Aujourd'hui - 17 Mars",
    description: "Concentration maximale sur la journée en cours",
    benefits: ["Focus journalier", "Détail minuté", "Productivité optimale"],
    days: ["9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h"]
  }
]);

const getCurrentView = () => {
  return calendarViews.value.find(view => view.id === activeView.value) || calendarViews.value[0];
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

/* Hero Section */
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

/* Section Headers */
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

/* Features Grid */
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

/* Views Section */
.views-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--color-white);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-tab:hover,
.view-tab.active {
  background: rgba(255, 127, 80, 0.2);
  border-color: var(--color-tritary);
  color: var(--color-tritary);
}

.view-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.calendar-mockup {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calendar-header {
  margin-bottom: 20px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  position: relative;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  background: rgba(255, 127, 80, 0.2);
}

.calendar-day.has-event {
  background: rgba(255, 127, 80, 0.3);
}

.day-number {
  font-size: 12px;
  color: var(--color-white);
}

.event-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 4px;
  height: 4px;
  background: var(--color-tritary);
  border-radius: 50%;
}

.benefit-tag {
  background: rgba(255, 127, 80, 0.2);
  color: var(--color-tritary);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
}

/* Integration Section */
.integration-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: center;
}

.sync-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sync-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sync-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.center-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(255, 127, 80, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(255, 127, 80, 0.3);
}

/* Technical Section */
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

/* CTA Section */
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

/* Responsive */
@media (max-width: 768px) {
  .hero-badges {
    flex-direction: column;
    align-items: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .view-showcase {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .integration-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .calendar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>