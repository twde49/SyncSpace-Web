<template>
  <div
    id="password-modal"
    tabindex="-1"
    aria-hidden="true"
    class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50"
  >
    <div class="relative p-4 w-full max-w-md max-h-[90%]">
      <div class="relative bgColorWhite rounded-lg shadow-sm dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Saved Passwords
          </h3>
          <button
            @click="closeModal"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="password-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <ul class="space-y-4 mb-4 max-h-64 overflow-y-auto">
            <div v-if="!encryptionKey || !isMasterPasswordActive">
              <p v-if="isMasterPasswordSet">
                Vous devez entrer votre mot de passe maître pour accéder à vos
                mots de passe
              </p>
              <p v-else>
                Vous devez créer un mot de passe maître pour accéder à vos mots
                de passe
              </p>
              <input
                type="password"
                v-model="masterPassword"
                placeholder="Mot de passe maître"
              />
              <button
                v-if="isMasterPasswordSet"
                @click="verifyMasterPassword"
                @keyup.enter="verifyMasterPassword"
                class="mt-4 w-full textColorWhite bgColorCategoryPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Ouvrir coffre
              </button>
              <button
                v-else
                @click="createMasterPassword"
                class="mt-4 w-full textColorWhite bgColorCategoryPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Définir mot de passe maître
              </button>
            </div>

            <li v-else v-for="password in passwords" :key="password.id">
              <input
                type="radio"
                :id="String(password.id)"
                name="password"
                :value="password.id"
                class="hidden peer"
                required
                @change="chosenPassword = password"
              />
              <label
                :for="String(password.id)"
                class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                <div class="block">
                  <div class="w-full text-lg font-semibold">
                    {{ password.url }}
                  </div>
                  <div class="w-full text-gray-500 dark:text-gray-400">
                    Dernière mise à jour:
                    <br />
                    {{ getFormattedDate(password.createdAt) }}
                  </div>
                </div>
                <Icon
                  name="ph:trash-fill"
                  size="21px"
                  class="trashIcon"
                  @click="confirmDelete(password.id)"
                />
              </label>
              <div
                v-if="passwordToDelete === password.id"
                class="flex justify-between mt-2"
              >
                <button
                  @click="cancelDelete"
                  class="bg-gray-200 text-gray-900 rounded-lg px-4 py-2"
                >
                  Annuler
                </button>
                <button
                  @click="deletePassword(password.id)"
                  class="bg-red-600 text-white rounded-lg px-4 py-2"
                >
                  Supprimer
                </button>
              </div>
            </li>
          </ul>
          <button
            v-if="isMasterPasswordSet && isMasterPasswordActive"
            @click="openPassword(chosenPassword)"
            :disabled="!chosenPassword"
            class="textColorWhite disabledButton disabled:bg-gray-400 disabled:!important inline-flex w-full justify-center bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark"
          >
            Ouvrir Mot de Passe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PasswordItem } from "~/types/PasswordItem";
import useAuthFetch from "~/composables/useAuthFetch";
import * as cryptoUtils from "~/utils/cryptoUtils";
import { useUserStore } from "~/stores/userStore";
import { useMasterPasswordStore } from "@/stores/masterPassword";

const userStore = useUserStore();
const { $toast } = useNuxtApp();
const emit = defineEmits(["closePasswordCenter", "openPassword"]);
const closeModal = () => {
	emit("closePasswordCenter");
};

const masterPasswordStore = useMasterPasswordStore();
const masterPassword = ref<string | null>(null);
const passwords = ref<PasswordItem[]>();
const chosenPassword = ref<PasswordItem | undefined>();
const passwordToDelete = ref<number | null>(null);
const encryptionKey = ref<CryptoKey | null>(null);
const isMasterPasswordSet = ref<boolean>(false);
const isMasterPasswordActive = ref<boolean>(false);

const getFormattedDate = (date: string | undefined) => {
	if (!date) return "";
	return new Date(date).toLocaleDateString("fr-FR", {
		month: "long",
		day: "numeric",
	});
};

const createMasterPassword = async () => {
	if (!masterPassword.value) {
		$toast.error("Veuillez entrer un mot de passe maître.");
		return;
	}

	await useAuthFetch("passwords/set-master-password", {
		method: "POST",
		body: JSON.stringify({ masterPassword: masterPassword.value }),
	});

	userStore.masterPasswordSet = true;
	$toast.success("Mot de passe maître défini avec succès.");
};

const verifyMasterPassword = async () => {
	if (!masterPassword.value) {
		$toast.error("Veuillez entrer votre mot de passe maître.");
		return;
	}

	const success = await masterPasswordStore.authenticate(masterPassword.value);

	if (success) {
		encryptionKey.value = (await cryptoUtils.deriveKey(
			masterPassword.value,
		)) as CryptoKey;
		isMasterPasswordActive.value = true;
		$toast.success("Coffre déverrouillé !");
		await fetchPasswords();
	} else {
		isMasterPasswordActive.value = false;
		$toast.error("Mot de passe incorrect.");
	}
};

const fetchPasswords = async () => {
	if (!masterPassword.value) {
		$toast.error("Veuillez entrer votre mot de passe maître.", {
			position: "top-center",
		});
		return;
	}

	encryptionKey.value = (await cryptoUtils.deriveKey(
		masterPassword.value,
	)) as CryptoKey;

	const res = await useAuthFetch("passwords/list");
	const encryptedPasswords = res.data.value as PasswordItem[];

	passwords.value = await Promise.all(
		encryptedPasswords.map(async (password: PasswordItem) => {
			const decryptedPwd = await cryptoUtils.decryptData(
				password.passwordEncrypted,
				password.iv,
				encryptionKey.value as CryptoKey,
			);

			return {
				...password,
				decryptedPassword: decryptedPwd,
			};
		}),
	);
};

const openPassword = (chosenPassword: PasswordItem | undefined) => {
	if (!isMasterPasswordActive.value) {
		$toast.error(
			"Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.",
		);
		encryptionKey.value = null;
		return;
	}

	emit("openPassword", chosenPassword);
	emit("closePasswordCenter");
};

const confirmDelete = (id: number) => {
	if (!isMasterPasswordActive.value) {
		$toast.error(
			"Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.",
		);
		encryptionKey.value = null;
		return;
	}

	passwordToDelete.value = id;
};

const cancelDelete = () => {
	passwordToDelete.value = null;
};

const deletePassword = async (id: number) => {
	if (!isMasterPasswordActive.value) {
		$toast.error(
			"Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.",
		);
		encryptionKey.value = null;
		return;
	}

	await useAuthFetch(`passwords/remove/${id}`, { method: "DELETE" });
	await fetchPasswords();
	$toast.success("Mot de passe supprimé.");
};

const checkMasterPasswordExistence = async () => {
	const res = await useAuthFetch("passwords/get-master-password-hash");
	if (res.data.value !== null) {
		isMasterPasswordSet.value = true;
		return;
	}
	isMasterPasswordSet.value = false;
	if (!res.data.value) {
		$toast.error("Veuillez entrer votre mot de passe maître.", {
			position: "top-center",
		});
	}
};

onMounted(async () => {
	checkMasterPasswordExistence();
	isMasterPasswordActive.value = masterPasswordStore.isAuthenticated;
});
</script>
