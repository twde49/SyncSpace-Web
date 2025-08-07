<template>
		<div>
				<Navbar />
				<div class="contact-container mt-8">
						<form class="contact-form" @submit.prevent="sendMessage">
								<h2 class="megaFont textColorWhite">Contactez SyncSpace</h2>
								<p class="normalFont textColorWhite mt-1">
										Une question, une suggestion ou besoin d'aide?
										<br>
										<span class="textColorTritary">Nous sommes là pour vous accompagner</span>
								</p>

								<div class="form-group mb-3 mt-12">
										<input
												v-model="firstName"
												type="text"
												placeholder="Prénom"
												class="form-input textColorBlack"
										/>
								</div>

								<div class="form-group mb-3">
										<input
												v-model="lastName"
												type="text"
												placeholder="Nom"
												class="form-input textColorBlack"
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
										<select
												v-model="subject"
												class="form-input textColorBlack"
										>
												<option value="" disabled>Choisissez un sujet</option>
												<option value="support">Support technique</option>
												<option value="billing">Facturation</option>
												<option value="feature">Demande de fonctionnalité</option>
												<option value="bug">Signaler un bug</option>
												<option value="other">Autre</option>
										</select>
								</div>

								<div class="form-group mb-3">
										<textarea
												v-model="message"
												placeholder="Votre message..."
												class="form-textarea textColorBlack"
												rows="5"
										></textarea>
								</div>

								<button
										:disabled="isLoading || !isValidForm()"
										type="submit"
										class="send-message-btn mt-6 w-full"
								>
										{{ isLoading ? 'Envoi en cours...' : 'Envoyer le message' }}
								</button>
						</form>
				</div>
		</div>
</template>

<script setup lang="ts">
import Navbar from "~/components/notLogged/Navbar.vue";
import { useRouter } from "vue-router";
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
const route = useRouter();

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

		// Reset form
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
.contact-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 20px;
		color: #fff;
}

.contact-form {
		padding: 20px;
		width: 100%;
		max-width: 60vw; /* Increased max-width for wider form */
}

.contact-form h2 {
		margin-bottom: 10px;
		color: #3a3a3a;
}

.form-group {
		display: flex;
		flex-direction: column;
}

.form-input,
.form-textarea {
		background-color: var(--color-white);
		padding: 10px;
		font-size: 14px;
		border: 1px solid #ccc;
		border-radius: 4px;
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
		box-shadow: none; /* Added to remove any default blue glow/shadow */
}

.send-message-btn {
		background-color: #ff7f50;
		color: #fff;
		padding: 10px;
		border: none;
		border-radius: 4px;
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

.contact-methods {
		display: flex;
		justify-content: space-between;
		gap: 10px;
}

.contact-method-btn {
		padding: 10px;
		border-radius: 5px;
		font-size: 14px;
		flex: 1;
		text-align: center;
		border: 1px solid var(--color-white);
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
}

.contact-method-btn:hover {
		background-color: rgba(255, 255, 255, 0.1);
		transform: translateY(-1px);
}

.contact-info {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 15px 0;
		border-top: 1px solid #ccc;
}

.info-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
}

@media (max-width: 768px) {
		.contact-form {
				max-width: 90vw;
		}

		.contact-methods {
				flex-direction: column;
		}

		.contact-info {
				flex-direction: column;
				gap: 10px;
		}
}
</style>