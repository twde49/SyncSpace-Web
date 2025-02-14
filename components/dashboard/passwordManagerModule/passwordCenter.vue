<template>
  <div id="password-modal" tabindex="-1" aria-hidden="true"
       class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-md max-h-[90%]">
      <div class="relative bgColorWhite rounded-lg shadow-sm dark:bg-gray-700">
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Saved Passwords
          </h3>
          <button @click="closeModal" type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="password-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="p-4 md:p-5">
          <ul class="space-y-4 mb-4 max-h-64 overflow-y-auto">
            <div v-if="!masterPassword">
                <p>Vous devez entrer votre mot de passe maitre pour accéder à vos mots de passe</p>
                <input type="password" v-model="masterPassword" placeholder="Mot de passe maitre" />
                <button @click="verifyMasterPassword">ouvrir coffre</button>
            </div>

            <li v-else v-for="password in passwords" :key="password.id">
              <input type="radio" :id="String(password.id)" name="password" :value="password.id" class="hidden peer" required @change="chosenPassword = password" />
              <label :for="String(password.id)"
                     class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                <div class="block">
                  <div class="w-full text-lg font-semibold">{{ password.appName }}</div>
                  <div class="w-full text-gray-500 dark:text-gray-400">Last Updated: <br/> {{ getFormatedDate(password.updatedAt) }}</div>
                </div>
                <Icon name="ph:trash-fill" size="21px" class="trashIcon" @click="confirmDelete(password.id)" />
              </label>
              <div v-if="passwordToDelete === password.id" class="flex justify-between mt-2">
                <button @click="cancelDelete" class="bg-gray-200 text-gray-900 rounded-lg px-4 py-2">Cancel</button>
                <button @click="deletePassword(password.id)" class="bg-red-600 text-white rounded-lg px-4 py-2">Delete</button>
              </div>
            </li>
          </ul>
          <button
            @click="openPassword(chosenPassword)"
            :disabled="!chosenPassword"
            class="textColorWhite disabledButton disabled:bg-gray-400 disabled:!important inline-flex w-full justify-center bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark">
            Open Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { PasswordItem } from '~/types/PasswordItem';
import useAuthFetch from '~/composables/useAuthFetch';
const { $toast } = useNuxtApp();
const emit = defineEmits(
  ['closePasswordCenter', 'openPassword'],
);
const closeModal = () => {
  emit('closePasswordCenter');
};

const masterPassword = ref<string | null>(null);
const passwords = ref<PasswordItem[]>([])
const chosenPassword = ref<PasswordItem | undefined>();
const passwordToDelete = ref<number | null>(null);

const getFormatedDate = (date: string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
};


import crypto from 'node:crypto';

const encryptionKey = ref<Buffer | null>(null);

const deriveKey = (masterPassword: string, salt = 'syncspace_salt') => {
  return crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha256');
};

const verifyMasterPassword = () => {
  if (!masterPassword.value) {
    $toast.error('Please enter your Master Password', { position: 'top-center' });
    return;
  }

  // Generate encryption key and store it in memory
  encryptionKey.value = deriveKey(masterPassword.value);
  $toast.success('Vault unlocked!', { position: 'top-center' });
};



const fetchPasswords = async () => {
  const res = await useAuthFetch('passwords');
  passwords.value = res.data.value as Password[];
}

const openPassword = (chosenPassword: Password | undefined) => {
  emit('openPassword', chosenPassword)
  emit('closePasswordCenter')
}

const confirmDelete = (id: number) => {
  passwordToDelete.value = id;
}

const cancelDelete = () => {
  passwordToDelete.value = null;
}

const deletePassword = async (id: number) => {
  try {
    const response = await useAuthFetch(`password/remove/${id}`, { method: 'DELETE' });

    if (response.status.value === 'success'){
      $toast.success('Password deleted successfully', {
        position: 'top-center',
        transition: 'slide'
      });
    } else {
      $toast.error('Error deleting password', {
        position: 'top-center',
        transition: 'slide'
      });
    }
    await fetchPasswords();
  } catch (e) {
    console.error(e);
  } finally {
    passwordToDelete.value = null;
  }
}

onMounted(async () => {
  await fetchPasswords();
})
</script>

<style scoped>
.disabledButton:disabled {
  background-color: #4a4a4a !important;
  cursor: not-allowed;
}

.trashIcon {
  color: gray;
}

.trashIcon:hover {
  color: var(--color-category-quaternary);
}
</style>