<template>
  <div>
    <Navbar />
    <div class="registration-container mt-8">
      <form class="registration-form" @submit.prevent="registerUser">
        <h2 class="megaFont textColorWhite">Inscrivez-vous à SyncSpace</h2>
        <p class="normalFont textColorWhite mt-1">
          Déjà un compte?
          <a href="/login" class="textColorTritary">Connectez-vous</a>
        </p>
        <div class="mb-3 mt-12 flex flex-row justify-between">
          <input
            v-model="firstName"
            type="text"
            placeholder="Prénom"
            class="form-input max-w textColorBlack"
          />
          <input
            v-model="lastName"
            type="text"
            placeholder="Nom"
            class="form-input max-w"
          />
        </div>
        <div class="form-group mb-3">
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
        <div class="form-group terms mb-6">
          <input
            type="checkbox"
            v-model="acceptTerms"
            id="terms"
            class="checkboxStyle"
          />
          <label class="textColorWhite normalFont ml-4" for="terms">
            J’accepte les termes et les conditions d’utilisation de SyncSpace.
          </label>
        </div>
        <button
          :disabled="checkCompletedForm()"
          type="submit"
          class="create-account-btn w-full"
        >
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
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import "vue3-toastify/dist/index.css";
const acceptTerms = ref(false);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const route = useRouter();

const { $toast } = useNuxtApp();

const checkCompletedForm = () => {
	return (
		acceptTerms.value === false ||
		firstName.value === "" ||
		lastName.value === "" ||
		email.value === "" ||
		password.value === ""
	);
};

const registerUser = async () => {
	try {
		if (!checkCompletedForm()) {
			const response = await fetch("https://localhost:8000/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: firstName.value,
					lastName: lastName.value,
					email: email.value,
					password: password.value,
				}),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status} ${response.statusText}`);
			}
			route.push("/login");
		}
	} catch (error) {
	    $toast.error("Une erreur est survenue lors de la création du compte");
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
  margin: 20px 0; /* Add spacing above and below */
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #ccc; /* Line color */
}

.divider-text {
  padding: 0 10px; /* Space around the text */
  font-size: 14px; /* Adjust font size as needed */
  color: #555; /* Text color */
  font-weight: 500; /* Optional: Adjust text weight */
}
</style>
