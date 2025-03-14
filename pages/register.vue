<template>
  <div>
    <Navbar />
    <div class="registration-container mt-8">
      <Form
        class="registration-form"
        :validation-schema="schema"
        @submit="registerUser"
      >
        <h2 class="megaFont textColorWhite">Inscrivez-vous à SyncSpace</h2>
        <p class="normalFont textColorWhite mt-1">
          Déjà un compte?
          <a href="/login" class="textColorTritary">Connectez-vous</a>
        </p>
        <div class="mb-3 mt-12 flex flex-row justify-between">
          <Field
            name="firstName"
            type="text"
            placeholder="Prénom"
            class="form-input max-w textColorBlack"
          />
          <Field
            name="lastName"
            type="text"
            placeholder="Nom"
            class="form-input max-w"
          />
        </div>
        <ErrorMessage class="textColorCategoryQuaternary" name="firstName" />
        <ErrorMessage class="textColorCategoryQuaternary" name="lastName" />
        <div class="form-group mb-3">
          <Field
            name="email"
            type="email"
            placeholder="Email"
            class="form-input textColorBlack"
          />
          <ErrorMessage class="textColorCategoryQuaternary" name="email" />
        </div>
        <div class="form-group mb-3">
          <Field
            name="password"
            type="password"
            placeholder="Mot de passe"
            class="form-input textColorBlack"
          />
          <ErrorMessage class="textColorCategoryQuaternary" name="password" />
        </div>
        <div class="form-group terms mb-6">
          <Field
            name="acceptTerms"
            type="checkbox"
            id="terms"
            class="checkboxStyle"
          />
          <label class="textColorWhite normalFont ml-4" for="terms">
            J’accepte les termes et les conditions d’utilisation de SyncSpace.
          </label>
        </div>
        <button type="submit" class="create-account-btn w-full">
          Créer Compte
        </button>
        <div class="divider textColorWhite">Ou</div>
        <div class="divider-section">
          <span class="divider-line"></span>
          <span class="divider-text textColorWhite">Se connecter avec</span>
          <span class="divider-line"></span>
        </div>
        <div class="social-login textColorWhite">
          <button
            :disabled="true"
            class="google-login-btn flex items-center justify-center space-x-2"
          >
            <Icon name="ri:google-fill" size="150%" />
            <span>Google</span>
          </button>
          <button
            :disabled="true"
            class="apple-login-btn flex items-center justify-center space-x-2"
          >
            <Icon name="ri:apple-fill" size="150%" />
            <span>Apple</span>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/notLogged/Navbar.vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import 'vue3-toastify/dist/index.css';

const route = useRouter();
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

const schema = yup.object({
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

const registerUser = async (values: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}) => {
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
    route.push('/login');
  } catch (error) {
    $toast.error('Une erreur est survenue lors de la création du compte');
    console.error(error);
  }
};
</script>

<style scoped>
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
  color: #333;
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
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.terms {
  flex-direction: row;
  display: flex;
  align-items: center;
}

.create-account-btn {
  background-color: #ff7f50;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.create-account-btn:hover {
  background-color: #ff5722;
}

.create-account-btn:disabled {
  background-color: #ff9079;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: #555;
}

.social-login {
  display: flex;
  justify-content: space-between;
}

.google-login-btn,
.apple-login-btn {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 48%;
  text-align: center;
  border: 1px solid var(--color-white);
}

.google-login-btn:disabled,
.apple-login-btn:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
  border: 1px solid #ccc;
}

.max-w {
  width: 48%;
}

.checkboxStyle {
  appearance: none;
  border: none;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.checkboxStyle:checked {
  background-color: #ff7f50;
}

.checkboxStyle:hover {
  background-color: #ffc299;
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

ErrorMessage {
  color: var(--color-quaternary);
}

</style>
