<template>
    <div>
        <Navbar />
        <div class="registration-container mt-8">
            <form class="registration-form" @submit.prevent="loginUser">
                <h2 class="megaFont textColorWhite">Connectez-vous à SyncSpace</h2>
                <p class="normalFont textColorWhite mt-1">
                    Pas encore de compte?
                    <NuxtLink to="/register" class="textColorTritary">Inscrivez-vous</NuxtLink>
                </p>
                <div class="form-group mb-3 mt-12">
                    <input v-model="email" type="email" placeholder="Email" class="form-input textColorBlack" />
                </div>
                <div class="form-group mb-3">
                    <input v-model="password" type="password" placeholder="Mot de passe"
                        class="form-input textColorBlack" />
                </div>
                <button :disabled="isLoading || !isValidForm()" type="submit" class="create-account-btn mt-6 w-full">
                    {{ isLoading ? 'Connexion...' : 'Se connecter' }}
                </button>
                <div class="divider-section">
                    <span class="divider-line"></span>
                    <span class="divider-text textColorWhite">ou</span>
                    <span class="divider-line"></span>
                </div>
                <div class="social-login textColorWhite">
                    <a :href="googleLoginUrl"
                        class="google-login-btn flex items-center justify-center space-x-2 w-full">
                        <Icon name="ri:google-fill" size="150%" />
                        <span>Google</span>
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/userStore";
import "vue3-toastify/dist/index.css";
import { useRuntimeConfig } from "#app";

const { $toast } = useNuxtApp();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const config = useRuntimeConfig();

const googleLoginUrl = `${config.public.apiUrl}auth/google`;

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidForm = () => {
    if (!email.value || !password.value) return false;
    if (!isValidEmail(email.value)) return false;
    if (password.value.length < 6) return false;
    return true;
};

const loginUser = async () => {
    if (isLoading.value) return;


    isLoading.value = true;
    try {
        const response = await fetch(`${config.public.apiUrl}login_check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email.value,
                password: password.value,
            }),
        });

        const data = await response.json();

        if (data.user.message == 'User not validated') {
            router.push(`/verificationCode/${data.user.userId}`);
            return;
        }

        if (!response.ok) {
            if (response.status === 401) {
                $toast.error("Identifiants incorrects. Veuillez réessayer.");
            } else if (response.status >= 500) {
                $toast.error("Erreur serveur. Veuillez réessayer plus tard.");
            } else {
                $toast.error(`Erreur inattendue: ${response.status}`);
            }
            return;
        }

        if (!data || !data.user || !data.token) {
            throw new Error("Réponse invalide du serveur.");
        }

        userStore.setUser({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.userEmail,
            token: data.token,
            masterPasswordSet: data.user.masterPasswordSet,
            parameters: {
                theme: data.user.parameters.theme,
                modulesLayout: data.user.parameters.modulesLayout,
                notificationsEnabled: data.user.parameters.notificationsEnabled,
                geolocationEnabled: data.user.parameters.geolocationEnabled,
            },
            currentTrack: data.user.currentTrack,
        });
        router.push("/dashboard");
    } catch (error) {
        console.error(error);
        $toast.error("Une erreur est survenue lors de la connexion.");
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    // Récupère le jeton et les données de l'utilisateur des paramètres d'URL (s'ils existent)
    const token = route.query.token as string | undefined;
    const encodedUserData = route.query.user as string | undefined;
    const error = route.query.error as string | undefined;

    if (error) {
        // Gérer l'erreur si le backend en a renvoyé une
        $toast.error("Erreur lors de la connexion via Google.");
        router.replace({ path: route.path, query: {} }); // Nettoyer l'URL
        return;
    }

    if (token && encodedUserData) {
        try {
            // Décoder les données utilisateur de la Base64
            const decodedUserData = JSON.parse(atob(encodedUserData));

            // Initialiser le store de l'utilisateur avec toutes les données reçues
            userStore.setUser({
                firstName: decodedUserData.firstName,
                lastName: decodedUserData.lastName,
                email: decodedUserData.userEmail,
                token: token,
                masterPasswordSet: decodedUserData.masterPasswordSet,
                parameters: {
                    theme: decodedUserData.parameters.theme,
                    modulesLayout: decodedUserData.parameters.modulesLayout,
                    notificationsEnabled: decodedUserData.parameters.notificationsEnabled,
                    geolocationEnabled: decodedUserData.parameters.geolocationEnabled,
                },
                currentTrack: decodedUserData.currentTrack,
            });

            $toast.success("Connexion réussie via Google !");
            router.push("/dashboard");
        } catch (e) {
            console.error("Failed to parse user data from URL:", e);
            $toast.error("Données de connexion Google invalides.");
            router.replace({ path: route.path, query: {} }); // Nettoyer l'URL en cas d'échec
        }
    }
});
</script>

<style scoped>
/* Vos styles existants, pas de changements majeurs */
.registration-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    color: #fff;
}

.registration-form {
    padding: 20px;
    width: 100%;
    max-width: 40vw;
}

.registration-form h2 {
    margin-bottom: 10px;
    color: #3a3a3a;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-input {
    background-color: var(--color-white);
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-input::placeholder {
    color: var(--color-black);
}

.create-account-btn {
    background-color: #ff7f50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.create-account-btn:hover {
    background-color: #ff5722;
}

.create-account-btn:disabled {
    background-color: #ff9079;
    cursor: not-allowed;
}

.divider-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
}

.divider-line {
    flex: 1;
    height: 1px;
    background-color: #ccc;
}

.divider-text {
    padding: 0 10px;
    font-size: 14px;
    color: #555;
    font-weight: 500;
}

.social-login {
    display: flex;
}

.google-login-btn {
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    width: 100%;
    text-align: center;
    border: 1px solid var(--color-white);
    background-color: #ffffff;
    color: #3a3a3a;
    transition: background-color 0.2s;
}

.google-login-btn:hover {
    background-color: #f0f0f0;
}
</style>
