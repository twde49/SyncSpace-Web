<template>
    <div>
        <Navbar />
        <div class="flex justify-center items-center px-4 sm:px-6 md:px-8 mt-8">
            <form class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl" @submit.prevent="sendMessage">
                <h2 class="megaFont textColorWhite text-center">Contactez SyncSpace</h2>
                <p class="normalFont textColorWhite mt-1 text-center">
                    Une question, une suggestion ou besoin d'aide?
                    <br>
                    <span class="textColorTritary">Nous sommes là pour vous accompagner</span>
                </p>

                <div class="mt-8 sm:mt-12">
                    <input v-model="firstName" type="text" placeholder="Prénom"
                        class="form-input w-full textColorBlack rounded-md p-2 mb-3" />
                </div>

                <div>
                    <input v-model="lastName" type="text" placeholder="Nom"
                        class="form-input w-full textColorBlack rounded-md p-2 mb-3" />
                </div>

                <div>
                    <input v-model="email" type="email" placeholder="Email"
                        class="form-input w-full textColorBlack rounded-md p-2 mb-3" />
                </div>

                <div>
                    <select v-model="subject" class="form-input w-full textColorBlack rounded-md p-2 mb-3 bg-white">
                        <option value="" disabled>Choisissez un sujet</option>
                        <option value="support">Support technique</option>
                        <option value="billing">Facturation</option>
                        <option value="feature">Demande de fonctionnalité</option>
                        <option value="bug">Signaler un bug</option>
                        <option value="other">Autre</option>
                    </select>
                </div>

                <div>
                    <textarea v-model="message" placeholder="Votre message..."
                        class="form-textarea w-full textColorBlack rounded-md p-2 mb-3" rows="5"></textarea>
                </div>

                <button :disabled="isLoading || !isValidForm()" type="submit"
                    class="send-message-btn w-full py-3 rounded-md mt-6">
                    {{ isLoading ? 'Envoi en cours...' : 'Envoyer le message' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import { ref } from "vue";
import "vue3-toastify/dist/index.css";
import { useRuntimeConfig } from "#app";

const { $toast } = useNuxtApp();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const isLoading = ref(false);

const config = useRuntimeConfig();

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidForm = () => {
    if (!firstName.value || !lastName.value || !email.value || !subject.value || !message.value) return false;
    if (!isValidEmail(email.value)) return false;
    if (message.value.length < 10) return false;
    return true;
};

const sendMessage = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
        const response = await fetch(`${config.public.apiUrl}contact/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                subject: subject.value,
                message: message.value,
            }),
        });

        if (!response.ok) {
            if (response.status >= 500) {
                $toast.error("Erreur serveur. Veuillez réessayer plus tard.");
            } else {
                $toast.error(`Erreur inattendue: ${response.status}`);
            }
            return;
        }

        $toast.success("Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.");

        firstName.value = "";
        lastName.value = "";
        email.value = "";
        subject.value = "";
        message.value = "";

    } catch (error) {
        console.error(error);
        $toast.error("Une erreur est survenue lors de l'envoi du message.");
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.form-input,
.form-textarea {
    background-color: var(--color-white);
    border: 1px solid #ccc;
    font-family: inherit;
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

.form-input::placeholder,
.form-textarea::placeholder {
    color: var(--color-black);
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #ff7f50;
    box-shadow: none;
}

.send-message-btn {
    background-color: #ff7f50;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.send-message-btn:hover {
    background-color: #ff5722;
}

.send-message-btn:disabled {
    background-color: #ff9079;
    cursor: not-allowed;
}
</style>
