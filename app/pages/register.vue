<template>
    <div>
        <Navbar />
        <div class="flex justify-center items-center px-4 sm:px-6 md:px-8 mt-8">
            <Form class="w-full max-w-md sm:max-w-lg md:max-w-xl" :validation-schema="schema" @submit="registerUser"
                :initial-values="{ acceptTerms: false }">
                <h2 class="megaFont textColorWhite text-center">Inscrivez-vous à SyncSpace</h2>
                <p class="normalFont textColorWhite mt-1 text-center">
                    Déjà un compte?
                    <RouterLink to="/login" class="textColorTritary">Connectez-vous</RouterLink>
                </p>
                <div class="flex flex-col sm:flex-row justify-between gap-3 mt-8 sm:mt-12">
                    <Field name="firstName" type="text" placeholder="Prénom"
                        class="form-input w-full textColorBlack rounded-md p-2" />
                    <Field name="lastName" type="text" placeholder="Nom"
                        class="form-input w-full textColorBlack rounded-md p-2" />
                </div>
                <div class="flex justify-between">
                    <ErrorMessage class="textColorCategoryQuaternary text-sm mt-1" name="firstName" />
                    <ErrorMessage class="textColorCategoryQuaternary text-sm mt-1" name="lastName" />
                </div>
                <div class="mt-3">
                    <Field name="email" type="email" placeholder="Email"
                        class="form-input w-full textColorBlack rounded-md p-2" />
                    <ErrorMessage class="textColorCategoryQuaternary text-sm mt-1" name="email" />
                </div>
                <div class="mt-3">
                    <Field name="password" type="password" placeholder="Mot de passe"
                        class="form-input w-full textColorBlack rounded-md p-2" />
                    <ErrorMessage class="textColorCategoryQuaternary text-sm mt-1" name="password" />
                </div>
                <div class="flex items-center mt-4">
                    <Field name="acceptTerms" type="checkbox" id="terms" class="checkboxStyle w-5 h-5 sm:w-6 sm:h-6" />
                    <label class="textColorWhite normalFont ml-3 text-sm sm:text-base" for="terms">
                        J'accepte les termes et les conditions d'utilisation de SyncSpace.
                    </label>
                </div>
                <ErrorMessage class="textColorCategoryQuaternary text-sm mt-1" name="acceptTerms" />
                <button type="submit" class="create-account-btn w-full mt-6 py-3 rounded-md">
                    Créer Compte
                </button>

                <div class="flex items-center justify-center my-6">
                    <span class="h-px bg-gray-400 flex-grow"></span>
                    <span class="textColorWhite px-4">Ou</span>
                    <span class="h-px bg-gray-400 flex-grow"></span>
                </div>

                <div class="social-login">
                    <NuxtLink :to="googleLoginUrl"
                        class="google-login-btn flex items-center justify-center space-x-2 py-3 rounded-md">
                        <Icon name="ri:google-fill" size="24px" />
                        <span>Google</span>
                    </NuxtLink>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/notLogged/Navbar.vue';
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from "vue";
import { useRuntimeConfig } from '#app';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import 'vue3-toastify/dist/index.css';
import { useUserStore } from "~/stores/userStore";
import type { GenericObject } from 'vee-validate';


const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();
const userStore = useUserStore();

const googleLoginUrl = `${config.public.apiUrl}auth/google`;

// Used for type checking internally
interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms: boolean;
}

const schema = yup.object().shape({
    firstName: yup.string().required('Prénom requis'),
    lastName: yup.string().required('Nom requis'),
    email: yup.string().email('Email invalide').required('Email requis'),
    password: yup.string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
        .matches(/[\W_]/, 'Le mot de passe doit contenir au moins un caractère spécial')
        .required('Mot de passe requis'),
    acceptTerms: yup.boolean().oneOf([true], 'Vous devez accepter les termes'),
});

const registerUser = async (values: GenericObject) => {
    try {
        const response = await fetch(`${config.public.apiUrl}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        router.push(`/verificationCode/${responseData.userId}`);
    } catch (error) {
        $toast.error('Une erreur est survenue lors de la création du compte');
        console.error(error);
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

.google-login-btn:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
    border: 1px solid #ccc;
}

.checkboxStyle {
    appearance: none;
    border: none;
    border-radius: 5px;
    background-color: #e0e0e0;
    cursor: pointer;
}

.checkboxStyle:checked {
    background-color: #ff7f50;
}

.checkboxStyle:hover {
    background-color: #ffc299;
}
</style>
