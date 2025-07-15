<template>
  <div class="hero">
    <div ref="heroText" class="hero-tagline">
      Votre espace unique pour gérer vos
      <span class="accent-word">{{ displayedText }}</span>
    </div>
    <p class="subtitle">
      Activez uniquement les outils dont vous avez besoin. Profitez d’une
      expérience sur mesure et d’une interface intuitive.
    </p>
    <div class="button-part">
      <button class="start-button">
        <a href="login">Commencer maintenant</a>
      </button>
      <button class="discover-button">
        <a href="about">Découvrir SyncSpace</a>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const words = ["musiques", "documents", "tâches", "contacts", "idées"];
const displayedText = ref("");
let index = 0;

const animateText = (newWord: string) => {
	const tl = gsap.timeline();
	const splitText = newWord.split("");

	tl.to(displayedText, {
		duration: 0.5,
		textContent: "",
		onUpdate: () => {
			displayedText.value = "";
		},
	});

	for (const letter of splitText) {
		tl.to(
			{},
			{
				duration: 0.1,
				onComplete: () => {
					displayedText.value += letter;
				},
			},
		);
	}
};

const addButtonAnimations = () => {
	const startButton = document.querySelector(".start-button");
	const discoverButton = document.querySelector(".discover-button");

	for (const button of [startButton, discoverButton]) {
		button?.addEventListener("mouseenter", () => {
			gsap.to(button, {
				scale: 1.1,
				duration: 0.3,
				ease: "power1.out",
			});
		});

		button?.addEventListener("mouseleave", () => {
			gsap.to(button, {
				scale: 1,
				duration: 0.3,
				ease: "power1.out",
			});
		});

		button?.addEventListener("click", () => {
			gsap.to(button, {
				scale: 0.9,
				duration: 0.1,
				ease: "power1.inOut",
				onComplete: () => {
					gsap.to(button, { scale: 1, duration: 0.2, ease: "power1.out" });
				},
			});
		});
	}
};

onMounted(() => {
	animateText(words[index]);

	setInterval(() => {
		index = (index + 1) % words.length;
		animateText(words[index]);
	}, 3000);

	addButtonAnimations();
});
</script>

<style scoped>
.accent-word {
  color: var(--color-primary);
}

.hero-tagline {
  color: var(--color-white);
  font: var(--text-style-omega);
  margin-top: 10vh;
  text-align: center;
  width: 60vw;
  margin-left: auto;
  margin-right: auto;
  white-space: pre-wrap;
  height: 20vh;
}

.subtitle {
  color: var(--color-white);
  font: var(--text-style-mega);
  text-align: center;
  margin-top: 10vh;
  width: 70vw;
  margin-left: auto;
  margin-right: auto;
}

.button-part {
  width: 65vw;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-around;
  margin-top: 10vh;
}

.start-button,
.discover-button {
  font: var(--text-style-mega);
  padding: 15px 15px;
  border-radius: var(--global-radius);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button {
  color: var(--color-white);
  background-color: var(--color-secondary);
}

.discover-button {
  color: var(--color-black);
  background-color: var(--color-white);
}
</style>
