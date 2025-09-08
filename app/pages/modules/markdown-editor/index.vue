<template>
    <div>
        <Navbar />
        <div class="module-container mt-8">
            <div class="module-content">
                <div class="hero-section mb-16">
                    <div class="hero-icon mb-6">
                        <Icon name="ri:markdown-line" size="400%" class="textColorTritary" />
                    </div>
                    <h1 class="megaFont textColorWhite mb-4">Module Markdown Editor</h1>
                    <p class="largeFont textColorWhite mb-6 opacity-90">
                        Créez et éditez des documents avec un formatage simple et puissant
                    </p>
                    <div class="hero-badges">
                        <span class="badge">
                            <Icon name="ri:align-left" />
                            Formatage intuitif
                        </span>
                        <span class="badge">
                            <Icon name="ri:spy-line" />
                            Prévisualisation en temps réel
                        </span>
                        <span class="badge">
                            <Icon name="ri:git-branch-line" />
                            Versioning automatique
                        </span>
                    </div>
                </div>

                <section class="editor-demo-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Éditeur Bi-Colonne</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Écrivez en Markdown et visualisez le résultat en temps réel
                        </p>
                    </div>
                    <div class="editor-demo">
                        <div class="markdown-editor">
                            <div class="editor-header">
                                <div class="editor-tools">
                                    <Icon name="ri:bold" class="textColorWhite" />
                                    <Icon name="ri:italic" class="textColorWhite" />
                                    <Icon name="ri:heading" class="textColorWhite" />
                                    <Icon name="ri:list-unordered" class="textColorWhite" />
                                    <Icon name="ri:list-ordered" class="textColorWhite" />
                                    <Icon name="ri:link" class="textColorWhite" />
                                    <Icon name="ri:image-line" class="textColorWhite" />
                                    <Icon name="ri:code-s-line" class="textColorWhite" />
                                </div>
                                <div class="editor-actions">
                                    <span class="editor-status">Édition</span>
                                </div>
                            </div>
                            <div class="editor-content">
                                <pre class="editor-code">
                                    # Bienvenue sur SyncSpace Markdown

                                    ## Un éditeur puissant et intuitif

                                    Avec **SyncSpace Markdown**, vous pouvez:
                                    - Créer des documents structurés
                                    - _Formater_ votre texte simplement
                                    - Insérer des [liens](https://syncspace.app)
                                    - Ajouter des images

                                    ## Collaboration en temps réel

                                    Travaillez à plusieurs sur le même document.

                                    ```javascript
                                    // Même du code avec coloration syntaxique
                                    function hello() {
                                    console.log("Hello SyncSpace!");
                                    }
                                    ```

                                    > Les citations sont également prises en charge
                                </pre>
                            </div>
                        </div>
                        <div class="markdown-preview">
                            <div class="preview-header">
                                <span class="preview-title">Aperçu en temps réel</span>
                                <div class="preview-actions">
                                    <Icon name="ri:fullscreen-line" class="textColorWhite" />
                                    <Icon name="ri:file-pdf-line" class="textColorWhite" />
                                </div>
                            </div>
                            <div class="preview-content">
                                <div class="rendered-markdown">
                                    <h1>Bienvenue sur SyncSpace Markdown</h1>
                                    <h2>Un éditeur puissant et intuitif</h2>
                                    <p>Avec <strong>SyncSpace Markdown</strong>, vous pouvez:</p>
                                    <ul>
                                        <li>Créer des documents structurés</li>
                                        <li><em>Formater</em> votre texte simplement</li>
                                        <li>Insérer des <a href="#" class="textColorTritary">liens</a></li>
                                        <li>Ajouter des images</li>
                                    </ul>
                                    <h2>Collaboration en temps réel</h2>
                                    <p>Travaillez à plusieurs sur le même document.</p>
                                    <div class="code-block">
                                        <code>
                                            <span class="code-comment">// Même du code avec coloration
                                                syntaxique</span><br>
                                            <span class="code-keyword">function</span> <span
                                                class="code-function">hello</span>() {<br>
                                            &nbsp;&nbsp;<span class="code-object">console</span>.<span
                                                class="code-property">log</span>(<span class="code-string">"Hello
                                                SyncSpace!"</span>);<br>
                                            }
                                        </code>
                                    </div>
                                    <blockquote>
                                        <p>Les citations sont également prises en charge</p>
                                    </blockquote>
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

                <section class="export-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Exportations Multiples</h2>
                        <div class="section-divider"></div>
                        <p class="normalFont textColorWhite opacity-80">
                            Convertissez vos documents Markdown en différents formats
                        </p>
                    </div>
                    <div class="export-formats">
                        <div class="format-grid">
                            <div class="format-card">
                                <div class="format-icon">
                                    <Icon name="ri:file-pdf-line" size="300%" class="textColorTritary" />
                                </div>
                                <h3 class="mediumFont textColorWhite mb-2">PDF</h3>
                                <p class="smallFont textColorWhite opacity-80">
                                    Documents portables optimisés pour l'impression et le partage
                                </p>
                            </div>
                            <div class="format-card">
                                <div class="format-icon">
                                    <Icon name="ri:html5-line" size="300%" class="textColorTritary" />
                                </div>
                                <h3 class="mediumFont textColorWhite mb-2">HTML</h3>
                                <p class="smallFont textColorWhite opacity-80">
                                    Pages web entièrement stylisées pour une publication immédiate
                                </p>
                            </div>
                            <div class="format-card">
                                <div class="format-icon">
                                    <Icon name="ri:file-word-line" size="300%" class="textColorTritary" />
                                </div>
                                <h3 class="mediumFont textColorWhite mb-2">DOCX</h3>
                                <p class="smallFont textColorWhite opacity-80">
                                    Documents Word pour une compatibilité avec Microsoft Office
                                </p>
                            </div>
                            <div class="format-card">
                                <div class="format-icon">
                                    <Icon name="ri:presentation-line" size="300%" class="textColorTritary" />
                                </div>
                                <h3 class="mediumFont textColorWhite mb-2">Slides</h3>
                                <p class="smallFont textColorWhite opacity-80">
                                    Présentations automatiquement générées à partir de votre structure
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="collaboration-section mb-16">
                    <div class="section-header mb-8">
                        <h2 class="largeFont textColorWhite mb-4">Collaboration en Temps Réel</h2>
                        <div class="section-divider"></div>
                    </div>
                    <div class="collab-content">
                        <div class="collab-visual">
                            <div class="collab-editor">
                                <div class="collab-cursors">
                                    <div class="cursor cursor-1">
                                        <div class="cursor-flag">Marie</div>
                                    </div>
                                    <div class="cursor cursor-2">
                                        <div class="cursor-flag">Thomas</div>
                                    </div>
                                    <div class="cursor cursor-3">
                                        <div class="cursor-flag">Sophie</div>
                                    </div>
                                </div>
                                <div class="collab-text">
                                    <div class="text-line">Bienvenue dans l'éditeur collaboratif</div>
                                    <div class="text-line text-highlight-1">Ce paragraphe est édité par Marie</div>
                                    <div class="text-line">Plusieurs personnes peuvent travailler simultanément</div>
                                    <div class="text-line text-highlight-2">Thomas modifie cette section</div>
                                    <div class="text-line">Sans jamais perdre leurs modifications</div>
                                    <div class="text-line text-highlight-3">Sophie commente ici</div>
                                </div>
                            </div>
                        </div>
                        <div class="collab-features">
                            <div class="collab-item">
                                <Icon name="ri:user-voice-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Curseurs en Temps Réel</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Visualisez où travaillent vos collaborateurs en temps réel avec des
                                        curseurs colorés identifiés
                                    </p>
                                </div>
                            </div>
                            <div class="collab-item">
                                <Icon name="ri:chat-check-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Commentaires Intégrés</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Ajoutez des commentaires directement dans le document pour
                                        discuter de sections spécifiques
                                    </p>
                                </div>
                            </div>
                            <div class="collab-item">
                                <Icon name="ri:git-merge-line" class="textColorTritary" />
                                <div>
                                    <h4 class="mediumFont textColorWhite mb-2">Fusion Automatique</h4>
                                    <p class="smallFont textColorWhite opacity-80">
                                        Les changements sont automatiquement fusionnés sans conflits,
                                        même en cas d'édition simultanée
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
                                Le module Markdown s'intègre parfaitement avec tous les autres modules de SyncSpace
                                pour une expérience de création sans friction.
                            </p>
                            <div class="integration-examples">
                                <div class="integration-item">
                                    <Icon name="ri:folder-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Drive</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Sauvegarde automatique de vos documents dans votre espace cloud
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:chat-3-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Chat</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Partagez et discutez de vos documents directement dans vos conversations
                                        </p>
                                    </div>
                                </div>
                                <div class="integration-item">
                                    <Icon name="ri:calendar-line" class="textColorTritary" />
                                    <div>
                                        <h4 class="mediumFont textColorWhite">Calendrier</h4>
                                        <p class="smallFont textColorWhite opacity-70">
                                            Associez des documents aux événements pour une meilleure organisation
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="integration-visual">
                            <div class="modules-connection">
                                <div class="center-module">
                                    <Icon name="ri:markdown-line" size="200%" class="textColorTritary" />
                                    <span class="smallFont textColorWhite">Markdown</span>
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
                        <Icon name="ri:markdown-line" size="300%" class="textColorTritary mb-6" />
                        <h2 class="largeFont textColorWhite mb-4">Prêt à Créer des Documents Puissants ?</h2>
                        <p class="normalFont textColorWhite opacity-90 mb-6">
                            Découvrez comment le module Markdown peut transformer votre processus d'écriture
                        </p>
                        <div class="cta-buttons">
                            <NuxtLink to="/register" class="cta-btn primary">
                                <Icon name="ri:edit-line" />
                                Commencer à rédiger
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
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import Footer from "~/components/shared/Footer.vue";
import { ref } from "vue";

const mainFeatures = ref([
    {
        id: 1,
        icon: "ri:markdown-line",
        title: "Syntaxe Markdown",
        description: "Formatez vos documents avec une syntaxe simple et lisible qui se transforme en HTML structuré.",
        benefits: [
            "Apprentissage rapide",
            "Édition efficace",
            "Portabilité maximale",
            "Rendu HTML propre"
        ]
    },
    {
        id: 2,
        icon: "ri:layout-2-line",
        title: "Éditeur Bi-Colonne",
        description: "Écrivez votre Markdown à gauche et visualisez instantanément le résultat à droite.",
        benefits: [
            "Prévisualisation en temps réel",
            "Mode plein écran disponible",
            "Thèmes personnalisables",
            "Mise en page adaptative"
        ]
    },
    {
        id: 3,
        icon: "ri:tools-line",
        title: "Outils Avancés",
        description: "Profitez d'outils puissants qui facilitent la création de documents complexes.",
        benefits: [
            "Tableaux interactifs",
            "Support MathJax pour équations",
            "Diagrammes et graphiques",
            "Table des matières automatique"
        ]
    },
    {
        id: 4,
        icon: "ri:git-repository-line",
        title: "Versioning Automatique",
        description: "Gardez une trace de toutes les modifications de vos documents avec un historique complet.",
        benefits: [
            "Historique des versions",
            "Restauration à tout moment",
            "Comparaison des modifications",
            "Annotations sur les versions"
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

.editor-demo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 40px;
}

.markdown-editor,
.markdown-preview {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: 400px;
    display: flex;
    flex-direction: column;
}

.editor-header,
.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-tools,
.preview-actions {
    display: flex;
    gap: 16px;
}

.editor-status,
.preview-title {
    font-size: 14px;
    color: var(--color-white);
    opacity: 0.8;
}

.editor-content,
.preview-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.editor-code {
    font-family: 'Courier New', monospace;
    color: var(--color-white);
    opacity: 0.9;
    line-height: 1.5;
    white-space: pre-wrap;
}

.rendered-markdown {
    color: var(--color-white);
    line-height: 1.6;
}

.rendered-markdown h1 {
    font-size: 1.8em;
    margin-bottom: 0.8em;
    color: var(--color-white);
}

.rendered-markdown h2 {
    font-size: 1.5em;
    margin-bottom: 0.6em;
    margin-top: 1em;
    color: var(--color-white);
}

.rendered-markdown p {
    margin-bottom: 1em;
    color: var(--color-white);
    opacity: 0.9;
}

.rendered-markdown ul {
    list-style-type: disc;
    padding-left: 2em;
    margin-bottom: 1em;
}

.rendered-markdown li {
    margin-bottom: 0.5em;
    color: var(--color-white);
    opacity: 0.9;
}

.rendered-markdown a {
    text-decoration: underline;
}

.code-block {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 1em;
    font-family: 'Courier New', monospace;
    overflow-x: auto;
}

.code-comment {
    color: #6A9955;
}

.code-keyword {
    color: #C586C0;
}

.code-function {
    color: #DCDCAA;
}

.code-string {
    color: #CE9178;
}

.code-object {
    color: #4EC9B0;
}

.code-property {
    color: #9CDCFE;
}

.rendered-markdown blockquote {
    border-left: 3px solid var(--color-tritary);
    padding-left: 15px;
    margin-left: 0;
    color: var(--color-white);
    opacity: 0.8;
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

.format-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.format-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    transition: all 0.3s ease;
}

.format-card:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 127, 80, 0.3);
}

.format-icon {
    margin-bottom: 20px;
}

.collab-content {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 40px;
    align-items: center;
    margin-top: 40px;
}

.collab-editor {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 15px;
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    position: relative;
    min-height: 300px;
}

.collab-cursors {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.cursor {
    position: absolute;
    width: 2px;
    height: 20px;
}

.cursor-flag {
    position: absolute;
    top: -20px;
    left: 0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    color: #fff;
}

.cursor-1 {
    background-color: #FF5722;
    top: 80px;
    left: 100px;
}

.cursor-1 .cursor-flag {
    background-color: #FF5722;
}

.cursor-2 {
    background-color: #2196F3;
    top: 140px;
    left: 180px;
}

.cursor-2 .cursor-flag {
    background-color: #2196F3;
}

.cursor-3 {
    background-color: #4CAF50;
    top: 200px;
    left: 140px;
}

.cursor-3 .cursor-flag {
    background-color: #4CAF50;
}

.collab-text {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.text-line {
    line-height: 1.5;
    padding: 5px;
    border-radius: 4px;
    color: var(--color-white);
}

.text-highlight-1 {
    background: rgba(255, 87, 34, 0.2);
    border-left: 3px solid #FF5722;
}

.text-highlight-2 {
    background: rgba(33, 150, 243, 0.2);
    border-left: 3px solid #2196F3;
}

.text-highlight-3 {
    background: rgba(76, 175, 80, 0.2);
    border-left: 3px solid #4CAF50;
}

.collab-features {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.collab-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
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
    .editor-demo {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .features-grid,
    .format-grid {
        grid-template-columns: 1fr;
    }

    .collab-content,
    .integration-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .connected-modules {
        grid-template-columns: 1fr;
    }
}
</style>
