<template>
    <div class="hero px-4 sm:px-6 md:px-8">
        <div ref="heroText"
            class="hero-tagline text-center mt-8 sm:mt-12 md:mt-16 lg:mt-20 mx-auto w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 h-20 sm:h-24 md:h-28">
            Votre espace unique pour gérer vos
            <span class="accent-word">{{ displayedText }}</span>
        </div>
        <p
            class="subtitle text-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 mx-auto w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2">
            Activez uniquement les outils dont vous avez besoin. Profitez d'une
            expérience sur mesure et d'une interface intuitive.
        </p>
        <div
            class="button-part flex flex-col sm:flex-row justify-center sm:justify-around items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-12 md:mt-16 lg:mt-20 mx-auto w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2">
            <button class="start-button w-full sm:w-auto">
                <a href="login" class="block py-3 px-6">Commencer maintenant</a>
            </button>
            <button class="discover-button w-full sm:w-auto mt-4 sm:mt-0">
                <a href="about" class="block py-3 px-6">Découvrir SyncSpace</a>
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
    animateText(words[index]!);

    setInterval(() => {
        index = (index + 1) % words.length;
        animateText(words[index]!);
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
    white-space: pre-wrap;
}

.subtitle {
    color: var(--color-white);
    font: var(--text-style-mega);
}

.start-button,
.discover-button {
    font: var(--text-style-mega);
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
