<template>
  <div>
    <Navbar />
    <div class="registration-container mt-8">
      <form class="registration-form" @submit.prevent="loginUser">
        <h2 class="megaFont textColorWhite">Connectez-vous à SyncSpace</h2>
        <p class="normalFont textColorWhite mt-1">
          Pas encore de compte? 
          <a href="/register" class="textColorTritary">Inscrivez-vous</a>
        </p>
        <div class="form-group mb-3 mt-12">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email" 
            class="form-input textColorBlack" 
          />
        </div>
        <div class="form-group mb-3">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Mot de passe" 
            class="form-input textColorBlack" 
          />
        </div>
        <button 
          :disabled="isLoading || !isValidForm()" 
          type="submit" 
          class="create-account-btn mt-6 w-full"
        >
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
        <div class="divider textColorWhite">Ou</div>
        <div class="divider-section">
          <span class="divider-line"></span>
          <span class="divider-text textColorWhite">Se connecter avec</span>
          <span class="divider-line"></span>
        </div>
        <div class="social-login textColorWhite">
          <button :disabled="true" class="google-login-btn flex items-center justify-center space-x-2">
            <Icon name="ri:google-fill" size="150%" />
            <span>Google</span>
          </button>
          <button :disabled="true" class="apple-login-btn flex items-center justify-center space-x-2">
            <Icon name="ri:apple-fill" size="150%" />
            <span>Apple</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/notLogged/Navbar.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '~/stores/userStore';
import 'vue3-toastify/dist/index.css';

const { $toast } = useNuxtApp();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const route = useRouter();
const userStore = useUserStore();

const API_BASE_URL = 'https://localhost:8000';

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
    const response = await fetch(`${API_BASE_URL}/api/login_check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        $toast.error('Identifiants incorrects. Veuillez réessayer.');
      } else if (response.status >= 500) {
        $toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        $toast.error(`Erreur inattendue: ${response.status}`);
      }
      return;
    }

    const data = await response.json();

    console.log('API Response:', data);

    if (!data || !data.user || !data.token) {
      throw new Error('Réponse invalide du serveur.');
    }

    userStore.setUser({
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email: data.user.userEmail,
      token: data.token,
    });

    $toast.success('Vous avez bien été authentifié.', {
      onClose: () => {
        route.push('/dashboard');
      },
    });
  } catch (error) {
    console.error(error);
    $toast.error('Une erreur est survenue lors de la connexion.');
  } finally {
    isLoading.value = false;
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

.divider {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: #555;
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
  justify-content: space-between;
}

.google-login-btn,
.apple-login-btn {
  padding: 10px;
  border-radius: 5px;
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
</style>
