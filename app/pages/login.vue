<template>
    <div>
        <Navbar />
        <div class="flex justify-center items-center px-4 sm:px-6 md:px-8 mt-8">
            <form class="w-full max-w-md sm:max-w-lg md:max-w-xl" @submit.prevent="loginUser">
                <h2 class="megaFont textColorWhite text-center">Connectez-vous à SyncSpace</h2>
                <p class="normalFont textColorWhite mt-1 text-center">
                    Pas encore de compte?
                    <NuxtLink to="/register" class="textColorTritary">Inscrivez-vous</NuxtLink>
                </p>
                <div class="mt-8 sm:mt-12">
                    <input v-model="email" type="email" placeholder="Email"
                        class="form-input w-full textColorBlack rounded-md p-2 mb-3" />
                </div>
                <div>
                    <input v-model="password" type="password" placeholder="Mot de passe"
                        class="form-input w-full textColorBlack rounded-md p-2 mb-3" />
                </div>
                <button :disabled="isLoading || !isValidForm()" type="submit"
                    class="create-account-btn w-full py-3 rounded-md mt-6">
                    {{ isLoading ? 'Connexion...' : 'Se connecter' }}
                </button>

                <div class="flex items-center justify-center my-6">
                    <span class="h-px bg-gray-400 flex-grow"></span>
                    <span class="textColorWhite px-4">ou</span>
                    <span class="h-px bg-gray-400 flex-grow"></span>
                </div>

                <div class="social-login">
                    <NuxtLink :to="googleLoginUrl"
                        class="google-login-btn flex items-center justify-center space-x-2 py-3 rounded-md">
                        <Icon name="ri:google-fill" size="24px" />
                        <span>Google</span>
                    </NuxtLink>
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
    const token = route.query.token as string | undefined;
    const encodedUserData = route.query.user as string | undefined;
    const error = route.query.error as string | undefined;

    if (error) {
        $toast.error("Erreur lors de la connexion via Google.");
        router.replace({ path: route.path, query: {} });
        return;
    }

    if (token && encodedUserData) {
        try {
            const decodedUserData = JSON.parse(atob(encodedUserData));

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
            router.replace({ path: route.path, query: {} });
        }
    }
});
</script>

<style scoped>
.form-input {
    background-color: var(--color-white);
    border: 1px solid #ccc;
}

.form-input::placeholder {
    color: var(--color-black);
}

.create-account-btn {
    background-color: #ff7f50;
    color: #fff;
    border: none;
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

.google-login-btn {
    border-radius: 5px;
    font-size: 14px;
    border: 1px solid var(--color-white);
    background-color: #ffffff;
    color: #3a3a3a;
    transition: background-color 0.2s;
}

.google-login-btn:hover {
    background-color: #f0f0f0;
}
</style>
