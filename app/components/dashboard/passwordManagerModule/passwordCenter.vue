<template>
    <div id="password-modal" tabindex="-1" aria-hidden="true"
        class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
        <div class="relative p-4 w-full max-w-md max-h-[90%]">
            <div class="relative bgColorWhite rounded-lg shadow-sm dark:bg-gray-700">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 dark:textColorWhite">
                        Mots de passes
                    </h3>
                    <button @click="closeModal" type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:textColorWhite"
                        data-modal-toggle="password-modal">
                        <Icon name="ph:x-square" size="24" />
                    </button>
                </div>
                <div class="p-4 md:p-5">
                    <div v-if="!encryptionKey || !isMasterPasswordActive" class="space-y-4 mb-4">
                        <p v-if="isMasterPasswordSet">
                            Vous devez entrer votre mot de passe maître pour accéder à vos mots de passe
                        </p>
                        <div v-else>
                            <p class="mb-4 text-gray-700 dark:text-gray-300">
                                Vous devez créer un mot de passe maître pour accéder à vos mots de passe
                            </p>

                            <div v-if="!showVerificationModal" class="mb-3">
                                <div class="flex justify-between items-center mb-2">
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Force du mot de passe
                                    </label>
                                    <span class="text-sm" :class="getStrengthTextColor()">
                                        {{ getStrengthText() }}
                                    </span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                                    <div class="h-2 rounded-full transition-all duration-300"
                                        :class="getStrengthBarColor()"
                                        :style="{ width: getStrengthPercentage() + '%' }"></div>
                                </div>
                                <div class="mt-2 space-y-1">
                                    <div class="flex items-center text-xs">
                                        <Icon :name="passwordRequirements.minLength
                                            ? 'ph:check-circle-fill'
                                            : 'ph:x-circle-fill'
                                            " :class="passwordRequirements.minLength ? 'text-green-500' : 'text-red-500'
                                                " class="mr-2" size="14px" />
                                        <span :class="passwordRequirements.minLength ? 'text-green-600' : 'text-red-600'
                                            ">
                                            Au moins 12 caractères
                                        </span>
                                    </div>
                                    <div class="flex items-center text-xs">
                                        <Icon :name="passwordRequirements.hasUppercase
                                            ? 'ph:check-circle-fill'
                                            : 'ph:x-circle-fill'
                                            " :class="passwordRequirements.hasUppercase
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                " class="mr-2" size="14px" />
                                        <span :class="passwordRequirements.hasUppercase
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            Majuscule
                                        </span>
                                    </div>
                                    <div class="flex items-center text-xs">
                                        <Icon :name="passwordRequirements.hasLowercase
                                            ? 'ph:check-circle-fill'
                                            : 'ph:x-circle-fill'
                                            " :class="passwordRequirements.hasLowercase
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                " class="mr-2" size="14px" />
                                        <span :class="passwordRequirements.hasLowercase
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            Minuscule
                                        </span>
                                    </div>
                                    <div class="flex items-center text-xs">
                                        <Icon :name="passwordRequirements.hasNumbers
                                            ? 'ph:check-circle-fill'
                                            : 'ph:x-circle-fill'
                                            " :class="passwordRequirements.hasNumbers
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                " class="mr-2" size="14px" />
                                        <span :class="passwordRequirements.hasNumbers ? 'text-green-600' : 'text-red-600'
                                            ">
                                            Chiffres
                                        </span>
                                    </div>
                                    <div class="flex items-center text-xs">
                                        <Icon :name="passwordRequirements.hasSpecialChars
                                            ? 'ph:check-circle-fill'
                                            : 'ph:x-circle-fill'
                                            " :class="passwordRequirements.hasSpecialChars
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                " class="mr-2" size="14px" />
                                        <span :class="passwordRequirements.hasSpecialChars
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            ">
                                            Caractères spéciaux (!@#$%^&*)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="!showVerificationModal" class="relative">
                            <input :type="showMasterPassword ? 'text' : 'password'" v-model="masterPassword"
                                @input="validatePasswordStrength" placeholder="Mot de passe maître"
                                class="w-full p-3 pr-10 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none" />
                            <button type="button" @click="showMasterPassword = !showMasterPassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <Icon :name="showMasterPassword ? 'ph:eye-slash' : 'ph:eye'" size="20px" />
                            </button>
                        </div>

                        <div v-if="showVerificationModal" class="space-y-4">
                            <div
                                class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-700">
                                <div class="flex items-center">
                                    <Icon name="ph:warning-fill" class="text-yellow-600 mr-2" size="20px" />
                                    <h4 class="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                                        Important : Sécurisez votre mot de passe maître
                                    </h4>
                                </div>
                                <ul class="mt-2 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                                    <li>• Vous ne pourrez plus voir ce mot de passe après sa création</li>
                                    <li>• Il sera demandé à chaque accès à vos mots de passe</li>
                                    <li>• Impossible de récupérer vos données si vous l'oubliez</li>
                                    <li>• Conservez-le dans un endroit sûr</li>
                                </ul>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirmez votre mot de passe maître
                                </label>
                                <div class="relative">
                                    <input :type="showMasterPasswordConfirmation ? 'text' : 'password'"
                                        v-model="masterPasswordConfirmation"
                                        placeholder="Retapez votre mot de passe maître"
                                        class="w-full p-3 pr-10 border rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
                                        :class="passwordMatchError ? 'border-red-500' : 'border-gray-300'" />
                                    <button type="button"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                        <Icon :name="showMasterPasswordConfirmation ? 'ph:eye-slash' : 'ph:eye'"
                                            size="20px"
                                            @click="showMasterPasswordConfirmation = !showMasterPasswordConfirmation" />
                                    </button>
                                </div>
                                <p v-if="passwordMatchError" class="mt-1 text-xs text-red-600">
                                    Les mots de passe ne correspondent pas
                                </p>
                            </div>

                            <div class="flex items-start space-x-3">
                                <input type="checkbox" id="confirm-understanding" v-model="confirmUnderstanding"
                                    class="mt-1" />
                                <label for="confirm-understanding" class="text-xs text-gray-600 dark:text-gray-400">
                                    Je comprends que je ne pourrai pas récupérer mes mots de passe si j'oublie ce
                                    mot de passe maître
                                </label>
                            </div>

                            <div class="flex space-x-3">
                                <button @click="cancelMasterPasswordCreation"
                                    class="flex-1 bg-gray-200 text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300">
                                    Annuler
                                </button>
                                <button @click="confirmMasterPasswordCreation" :disabled="!canConfirmCreation"
                                    class="flex-1 textColorWhite bgColorPrimary font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform hover:scale-105">
                                    Créer le coffre
                                </button>
                            </div>
                        </div>

                        <div v-if="!showVerificationModal">
                            <button v-if="isMasterPasswordSet" @click="verifyMasterPassword"
                                @keyup.enter="verifyMasterPassword"
                                class="mt-4 w-full textColorWhite bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Ouvrir coffre
                            </button>
                            <button v-else @click="initiateMasterPasswordCreation" :disabled="!isPasswordStrong"
                                class="mt-4 w-full textColorWhite bgColorPrimary font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Continuer
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <div v-if="showAddPasswordModal" class="space-y-4">
                            <h4 class="text-lg font-semibold text-gray-900 dark:textColorWhite mb-4">
                                Créer un nouveau mot de passe
                            </h4>

                            <div>
                                <label for="new-password-url" class="block text-sm font-medium textColorBlack mb-2">
                                    URL / Site web <span class="text-red-500">*</span>
                                </label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <input type="text" id="new-password-url" v-model="newPasswordForm.url"
                                        placeholder="Ex: google.com"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <Icon v-if="newPasswordForm.url" @click="copyToClipboard(newPasswordForm.url)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label for="new-password-name" class="block text-sm font-medium textColorBlack mb-2">
                                    Nom / Description
                                </label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <input type="text" id="new-password-name" v-model="newPasswordForm.name"
                                        placeholder="Ex: Mon compte Google"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <Icon v-if="newPasswordForm.name" @click="copyToClipboard(newPasswordForm.name)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label for="new-password-email" class="block text-sm font-medium textColorBlack mb-2">
                                    Email
                                </label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <input type="email" id="new-password-email" v-model="newPasswordForm.email"
                                        placeholder="Ex: votre.email@example.com"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <Icon v-if="newPasswordForm.email" @click="copyToClipboard(newPasswordForm.email)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label for="new-password-value" class="block text-sm font-medium textColorBlack mb-2">
                                    Mot de passe <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input :type="showNewPassword ? 'text' : 'password'" id="new-password-value"
                                        v-model="newPasswordForm.password" placeholder="Entrez le mot de passe"
                                        class="w-full p-3 pr-[140px] bgColorBlack rounded-lg textColorWhite focus:outline-none" />
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                                        <button type="button" @click="generatePasswordForNew"
                                            class="text-sm px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                            Générer
                                        </button>

                                        <Icon @click="showNewPassword = !showNewPassword"
                                            :name="showNewPassword ? 'ph:eye-slash' : 'ph:eye'" size="20px"
                                            class="textColorPrimary" />
                                        <Icon v-if="newPasswordForm.password"
                                            @click="copyToClipboard(newPasswordForm.password)" name="ph:copy"
                                            size="20px" class="textColorPrimary" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label for="new-password-notes" class="block text-sm font-medium textColorBlack mb-2">
                                    Notes (optionnel)
                                </label>
                                <div class="relative p-3 bgColorBlack rounded-lg textColorWhite">
                                    <textarea id="new-password-notes" v-model="newPasswordForm.notes" rows="3"
                                        placeholder="Ajoutez des notes supplémentaires ici..."
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite resize-y pr-8"></textarea>
                                    <Icon v-if="newPasswordForm.notes" @click="copyToClipboard(newPasswordForm.notes)"
                                        name="ph:copy" size="20px"
                                        class="absolute top-3 right-3 textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div class="flex items-center space-x-2">
                                <input type="checkbox" id="new-password-favorite" v-model="newPasswordForm.isFavorite"
                                    class="checkboxStyle" />
                                <label for="new-password-favorite" class="text-sm text-gray-700 dark:text-gray-300">
                                    Ajouter aux favoris
                                </label>
                            </div>

                            <div class="flex space-x-3 mt-6">
                                <button @click="cancelAddPassword"
                                    class="flex-1 bg-gray-200 text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300">
                                    Annuler
                                </button>
                                <button @click="saveNewPassword"
                                    :disabled="!newPasswordForm.url || !newPasswordForm.password"
                                    class="flex-1 textColorWhite bgColorCategoryPrimary font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform hover:scale-105">
                                    Enregistrer
                                </button>
                            </div>
                        </div>

                        <div v-else-if="showEditPasswordModal" class="space-y-4">
                            <h4 class="text-lg font-semibold text-gray-900 dark:textColorWhite mb-4">
                                Modifier le mot de passe
                            </h4>

                            <div>
                                <label for="edit-password-url" class="block text-sm font-medium textColorBlack mb-1">
                                    URL / Site web <span class="text-red-500">*</span>
                                </label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <input type="text" id="edit-password-url" v-model="editPasswordForm.url"
                                        placeholder="Ex: google.com"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <Icon v-if="editPasswordForm.url" @click="copyToClipboard(editPasswordForm.url)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label for="edit-password-name" class="block text-sm font-medium textColorBlack mb-1">
                                    Nom / Description
                                </label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <input type="text" id="edit-password-name" v-model="editPasswordForm.name"
                                        placeholder="Ex: Mon compte Google"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <Icon v-if="editPasswordForm.name" @click="copyToClipboard(editPasswordForm.name)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label for="edit-password-email" class="block text-sm font-medium textColorBlack mb-1">
                                    Email
                                </label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <input type="email" id="edit-password-email" v-model="editPasswordForm.email"
                                        placeholder="Ex: votre.email@example.com"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <Icon v-if="editPasswordForm.email" @click="copyToClipboard(editPasswordForm.email)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label for="edit-password-value" class="block text-sm font-medium textColorBlack mb-1">
                                    Mot de passe <span class="text-red-500">*</span>
                                </label>
                                <div class="relative p-3 pr-[140px] bgColorBlack rounded-lg textColorWhite">
                                    <input :type="showEditPassword ? 'text' : 'password'" id="edit-password-value"
                                        v-model="editPasswordForm.password" placeholder="Entrez le mot de passe"
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite" />
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                                        <button type="button" @click="generatePasswordForEdit"
                                            class="text-sm px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                            Générer
                                        </button>

                                        <Icon @click="showEditPassword = !showEditPassword"
                                            :name="showEditPassword ? 'ph:eye-slash' : 'ph:eye'" size="20px"
                                            class="textColorPrimary cursor-pointer" />
                                        <Icon v-if="editPasswordForm.password"
                                            @click="copyToClipboard(editPasswordForm.password)" name="ph:copy"
                                            size="20px" class="textColorPrimary cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label for="edit-password-notes" class="block text-sm font-medium textColorBlack mb-1">
                                    Notes (optionnel)
                                </label>
                                <div class="relative p-3 bgColorBlack rounded-lg textColorWhite">
                                    <textarea id="edit-password-notes" v-model="editPasswordForm.notes" rows="3"
                                        placeholder="Ajoutez des notes supplémentaires ici..."
                                        class="w-full bg-transparent border-none focus:outline-none textColorWhite resize-y pr-8"></textarea>
                                    <Icon v-if="editPasswordForm.notes" @click="copyToClipboard(editPasswordForm.notes)"
                                        name="ph:copy" size="20px"
                                        class="absolute top-3 right-3 textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div class="flex items-center space-x-2">
                                <input type="checkbox" id="new-password-favorite" v-model="newPasswordForm.isFavorite"
                                    class="checkboxStyle" />
                                <label for="new-password-favorite" class="text-sm text-gray-700 dark:text-gray-300">
                                    Ajouter aux favoris
                                </label>
                            </div>

                            <div class="flex space-x-3 mt-6">
                                <button @click="cancelEditPassword"
                                    class="flex-1 bg-gray-200 text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300">
                                    Annuler
                                </button>
                                <button @click="updatePassword"
                                    :disabled="!editPasswordForm.url || !editPasswordForm.password"
                                    class="flex-1 textColorWhite bgColorCategoryPrimary font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform hover:scale-105">
                                    Enregistrer
                                </button>
                            </div>
                        </div>

                        <div v-else-if="showViewPasswordDetails" class="space-y-4">
                            <h4 class="text-lg font-semibold text-gray-900 dark:textColorWhite mb-4">
                                Détails du mot de passe
                            </h4>

                            <div>
                                <label class="block text-sm font-medium textColorBlack mb-1">URL /
                                    Site web</label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <span>{{ chosenPassword?.url }}</span>
                                    <Icon v-if="chosenPassword?.url" @click="copyToClipboard(chosenPassword.url)"
                                        name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div v-if="chosenPassword?.name">
                                <label class="block text-sm font-medium textColorBlack mb-1">Nom /
                                    Description</label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <span>{{ chosenPassword.name }}</span>
                                    <Icon @click="copyToClipboard(chosenPassword.name)" name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div v-if="chosenPassword?.email">
                                <label class="block text-sm font-medium textColorBlack mb-1">Email</label>
                                <div
                                    class="p-3 bgColorBlack rounded-lg textColorWhite flex justify-between items-center">
                                    <span>{{ chosenPassword.email }}</span>
                                    <Icon @click="copyToClipboard(chosenPassword.email)" name="ph:copy" size="20px"
                                        class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium textColorBlack mb-1">Mot de
                                    passe</label>
                                <div class="relative">
                                    <input :type="showPasswordInView ? 'text' : 'password'"
                                        :value="chosenPassword?.decryptedPassword" readonly
                                        class="w-full p-3 pr-28 border bgColorBlack rounded-lg textColorWhite focus:outline-none" />
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                                        <Icon v-if="chosenPassword?.decryptedPassword"
                                            @click="copyToClipboard(chosenPassword.decryptedPassword)" name="ph:copy"
                                            size="20px"
                                            class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                        <Icon @click="showPasswordInView = !showPasswordInView"
                                            :name="showPasswordInView ? 'ph:eye-slash' : 'ph:eye'" size="20px"
                                            class="textColorPrimary hover:textColorSecondary cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div v-if="chosenPassword?.decryptedNotes">
                                <label class="block text-sm font-medium textColorBlack mb-1">Notes</label>
                                <div class="relative">
                                    <textarea :value="chosenPassword.decryptedNotes" readonly rows="3"
                                        class="w-full p-3 border bgColorBlack rounded-lg textColorWhite resize-y focus:outline-none"></textarea>
                                    <Icon v-if="chosenPassword.decryptedNotes"
                                        @click="copyToClipboard(chosenPassword.decryptedNotes)" name="ph:copy"
                                        size="20px"
                                        class="absolute top-3 right-3 textColorPrimary hover:textColorSecondary cursor-pointer" />
                                </div>
                            </div>

                            <div class="flex items-center space-x-2">
                                <Icon :name="chosenPassword?.isFavorite ? 'ph:star-fill' : 'ph:star'"
                                    :class="chosenPassword?.isFavorite ? 'text-yellow-500' : 'text-gray-400'"
                                    size="20px" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">
                                    {{ chosenPassword?.isFavorite ? 'Ajouté aux favoris' : 'Non favori' }}
                                </span>
                            </div>

                            <div class="flex space-x-3 mt-6">
                                <button @click="cancelViewPassword"
                                    class="flex-1 bg-gray-200 text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300">
                                    Retour
                                </button>
                                <button @click="openEditPasswordModal(chosenPassword as DisplayPasswordItem)"
                                    class="flex-1 bgColorCategoryPrimary textColorWhite font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-105">
                                    Modifier
                                </button>
                                <button @click="confirmDelete(chosenPassword?.id)"
                                    class="flex-1 bgColorCategoryQuaternary textColorWhite font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-transform hover:scale-105">
                                    Supprimer
                                </button>
                            </div>
                        </div>

                        <ul v-else class="space-y-4 mb-4 max-h-64 overflow-y-auto">
                            <li>
                                <input type="radio" id="new-password-item" name="password-selection" value="new"
                                    class="hidden peer" required @change="chosenPassword = undefined" />
                                <label for="new-password-item" @click="openAddPasswordModal"
                                    class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500">
                                    <div class="block">
                                        <div class="w-full text-lg textColorBlack font-semibold">
                                            Créer un nouveau mot de passe
                                        </div>
                                    </div>
                                    <div>
                                        <Icon name="ph:plus-fill" size="21px" class="media textColorBlack" />
                                    </div>
                                </label>
                            </li>
                            <hr class="my-4 border-gray-300 dark:border-gray-600" />
                            <li v-if="passwords && passwords.length === 0">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <span class="ml-2">Aucun mot de passe enregistré</span>
                                    </div>
                                </div>
                            </li>
                            <li v-for="password in passwords" :key="password.id">
                                <input type="radio" :id="String(password.id)" name="password-selection"
                                    :value="password.id" class="hidden peer" required
                                    @change="chosenPassword = password" />
                                <label :for="String(password.id)"
                                    class="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:textColorWhite dark:bg-gray-600 dark:hover:bg-gray-500">
                                    <div class="block">
                                        <div class="flex items-center mb-1">
                                            <button @click.stop="toggleFavorite(password)"
                                                class="flex items-center text-gray-400 hover:text-yellow-500 mr-2"
                                                :class="{ 'text-yellow-500': password.isFavorite }"
                                                aria-label="Toggle favorite">
                                                <Icon :name="password.isFavorite ? 'ph:star-fill' : 'ph:star'"
                                                    size="18px" />
                                            </button>
                                            <NuxtLink :to="password.url" target="_blank"
                                                class="text-lg font-semibold textColorPrimary">
                                                {{ password.url }}
                                            </NuxtLink>
                                        </div>
                                        <div v-if="password.name"
                                            class="w-full text-sm text-gray-600 dark:text-gray-400">
                                            {{ password.name }}
                                        </div>
                                        <div v-if="password.email"
                                            class="w-full text-sm text-gray-600 dark:text-gray-400">
                                            {{ password.email }}
                                        </div>
                                        <div class="w-full text-gray-500 dark:text-gray-400">
                                            Dernière mise à jour:
                                            <br />
                                            {{ getFormattedDate(password.updatedAt) }}
                                        </div>
                                        <Icon v-if="password.mustBeUpdated" name="ph:seal-warning" size="32px"
                                            class="textColorCategoryQuaternary" />
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <Icon name="ph:copy" size="21px" v-if="password.decryptedPassword"
                                            @click.stop="copyToClipboard(password.decryptedPassword)" />
                                        <Icon name="ph:trash-fill" size="21px" class="trashIcon"
                                            @click.stop="confirmDelete(password.id)" />
                                    </div>
                                </label>
                            </li>
                        </ul>
                        <button v-if="!showAddPasswordModal && !showViewPasswordDetails && !showEditPasswordModal"
                            @click="openPassword(chosenPassword as DisplayPasswordItem)"
                            :disabled="!chosenPassword || chosenPassword.id === undefined"
                            class="textColorWhite disabledButton disabled:!bg-[#4a4a4a] disabled:cursor-not-allowed inline-flex w-full justify-center bgColorPrimary hover:bg-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark">
                            Voir ce mot de passe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showDeleteConfirmationModal"
        class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
        <div class="relative p-4 w-full max-w-md max-h-[90%]">
            <div class="relative bgColorWhite rounded-lg shadow-sm dark:bg-gray-700">
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 dark:textColorWhite">
                        Confirmer la suppression
                    </h3>
                    <button @click="cancelDelete" type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:textColorWhite">
                        <Icon name="ph:x-square" size="24" />
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div class="p-4 md:p-5 text-gray-700 dark:text-gray-300">
                    <p class="mb-4">
                        Êtes-vous sûr de vouloir supprimer le mot de passe pour
                        <strong class="font-semibold">{{ passwordToDeleteDetails?.url }}</strong>
                        <span v-if="passwordToDeleteDetails?.name"> ({{ passwordToDeleteDetails?.name }})</span> ?
                    </p>
                    <p class="text-sm text-red-600 dark:text-red-400">
                        Cette action est irréversible.
                    </p>
                    <div class="flex space-x-3 mt-6">
                        <button @click="cancelDelete"
                            class="flex-1 bg-gray-200 text-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300">
                            Annuler
                        </button>
                        <button @click="deletePasswordAndCloseView()"
                            class="flex-1 bg-red-600 textColorWhite font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-red-700">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import type { PasswordItem } from "~/types/PasswordItem";
import useAuthFetch from "~/composables/useAuthFetch";
import * as cryptoUtils from "~/utils/cryptoUtils";
import { useUserStore } from "~/stores/userStore";
import { useMasterPasswordStore } from "@/stores/masterPassword";

const userStore = useUserStore();
const { $toast, $generatePassword } = useNuxtApp();
const emit = defineEmits(["closePasswordCenter", 'refreshCounter']);
const closeModal = () => {
    emit("closePasswordCenter");
};

const masterPasswordStore = useMasterPasswordStore();
const masterPassword = ref<string>("");
const masterPasswordConfirmation = ref<string>("");

interface DisplayPasswordItem extends PasswordItem {
    decryptedPassword?: string | null;
    decryptedNotes?: string | null;
}

const passwords = ref<DisplayPasswordItem[]>();
const chosenPassword = ref<DisplayPasswordItem | undefined>();
const passwordToDelete = ref<number | null>(null);
const passwordToDeleteDetails = ref<DisplayPasswordItem | null>(null);
const encryptionKey = ref<CryptoKey | null>(null);
const isMasterPasswordSet = ref<boolean>(false);
const isMasterPasswordActive = ref<boolean>(false);
const showVerificationModal = ref<boolean>(false);
const confirmUnderstanding = ref<boolean>(false);
const showMasterPassword = ref<boolean>(false);
const showMasterPasswordConfirmation = ref<boolean>(false);
const showDeleteConfirmationModal = ref<boolean>(false);

const showAddPasswordModal = ref<boolean>(false);
const newPasswordForm = ref({
    url: '',
    name: '',
    email: '',
    password: '',
    notes: '',
    isFavorite: false,
});
const showNewPassword = ref<boolean>(false);

const showViewPasswordDetails = ref<boolean>(false);
const showPasswordInView = ref<boolean>(false);

const showEditPasswordModal = ref<boolean>(false);
const editPasswordForm = ref({
    id: null as number | null,
    url: '',
    name: '',
    email: '',
    password: '',
    notes: '',
    isFavorite: false,
});
const showEditPassword = ref<boolean>(false);

const passwordRequirements = ref({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSpecialChars: false
});

const passwordStrength = ref<number>(0);

const validatePasswordStrength = () => {
    const password = masterPassword.value;

    passwordRequirements.value = {
        minLength: password.length >= 12,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSpecialChars: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    passwordStrength.value = Object.values(passwordRequirements.value).filter(Boolean).length;
};

const isPasswordStrong = computed(() => {
    return passwordStrength.value >= 5;
});

const getStrengthPercentage = () => {
    return (passwordStrength.value / 5) * 100;
};

const getStrengthText = () => {
    if (passwordStrength.value === 0) return "Très faible";
    if (passwordStrength.value <= 2) return "Faible";
    if (passwordStrength.value <= 3) return "Moyen";
    if (passwordStrength.value <= 4) return "Fort";
    return "Très fort";
};

const getStrengthTextColor = () => {
    if (passwordStrength.value <= 2) return "text-red-600";
    if (passwordStrength.value <= 3) return "text-yellow-600";
    if (passwordStrength.value <= 4) return "text-blue-600";
    return "text-green-600";
};

const getStrengthBarColor = () => {
    if (passwordStrength.value <= 2) return "bg-red-500";
    if (passwordStrength.value <= 3) return "bg-yellow-500";
    if (passwordStrength.value <= 4) return "bg-blue-500";
    return "bg-green-500";
};

const passwordMatchError = computed(() => {
    return masterPasswordConfirmation.value.length > 0 &&
        masterPassword.value !== masterPasswordConfirmation.value;
});

const canConfirmCreation = computed(() => {
    return isPasswordStrong.value &&
        masterPassword.value === masterPasswordConfirmation.value &&
        confirmUnderstanding.value &&
        masterPasswordConfirmation.value.length > 0;
});

const getFormattedDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
        month: "long",
        day: "numeric",
    });
};

const initiateMasterPasswordCreation = () => {
    if (!isPasswordStrong.value) {
        $toast.error("Veuillez créer un mot de passe plus fort.");
        return;
    }
    showVerificationModal.value = true;
};

const cancelMasterPasswordCreation = () => {
    showVerificationModal.value = false;
    masterPasswordConfirmation.value = "";
    confirmUnderstanding.value = false;
};

const confirmMasterPasswordCreation = async () => {
    if (!canConfirmCreation.value) {
        return;
    }

    await createMasterPassword();
};

const createMasterPassword = async () => {
    if (!masterPassword.value) {
        $toast.error("Veuillez entrer un mot de passe maître.");
        return;
    }

    const passwordToAuthenticate = masterPassword.value;

    try {
        await useAuthFetch(`passwords/set-master-password?${Date.now()}`, {
            method: "POST",
            body: JSON.stringify({ masterPassword: passwordToAuthenticate }),
        });

        userStore.masterPasswordSet = true;
        showVerificationModal.value = false;
        $toast.success("Mot de passe maître défini avec succès.");

        const success = await masterPasswordStore.authenticate(passwordToAuthenticate);

        if (success) {
            encryptionKey.value = (await cryptoUtils.deriveKey(passwordToAuthenticate)) as CryptoKey;
            isMasterPasswordActive.value = true;
            await fetchPasswords();
        } else {
            $toast.error("Erreur d'authentification automatique après la création.");
            isMasterPasswordActive.value = false;
            encryptionKey.value = null;
        }

        masterPassword.value = "";
        masterPasswordConfirmation.value = "";
        confirmUnderstanding.value = false;

    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la création du mot de passe maître.");
        masterPassword.value = "";
        masterPasswordConfirmation.value = "";
        confirmUnderstanding.value = false;
    }
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
    emit("refreshCounter", true);
    if (!encryptionKey.value && masterPassword.value) {
        try {
            encryptionKey.value = (await cryptoUtils.deriveKey(
                masterPassword.value,
            )) as CryptoKey;
        } catch (error) {
            console.warn(error);
            $toast.error("Échec de la dérivation de la clé de chiffrement.");
            return;
        }
    }

    if (!encryptionKey.value) {
        $toast.error("Clé de chiffrement non disponible. Veuillez vous authentifier.");
        return;
    }

    let res;
    try {
        res = await useAuthFetch(`passwords/list?${Date.now()}`);
    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la récupération des mots de passe.");
        passwords.value = [];
        return;
    }

    const fetchedEncryptedPasswords = res.data.value as PasswordItem[];

    if (!fetchedEncryptedPasswords || fetchedEncryptedPasswords.length === 0) {
        passwords.value = [];
        return;
    }

    const decryptedPasswords: DisplayPasswordItem[] = [];
    for (const p of fetchedEncryptedPasswords) {
        let decryptedPwd = null;
        let decryptedNotes = null;
        try {
            decryptedPwd = await cryptoUtils.decryptData(
                p.passwordEncrypted,
                p.iv,
                encryptionKey.value as CryptoKey,
            );
            if (p.notesEncrypted) {
                decryptedNotes = await cryptoUtils.decryptData(
                    p.notesEncrypted,
                    p.iv,
                    encryptionKey.value as CryptoKey,
                );
            }
        } catch (error) {
            console.warn(error);
            $toast.error(`Échec du déchiffrement pour ${p.url}.`);
        }

        decryptedPasswords.push({
            ...p,
            decryptedPassword: decryptedPwd,
            decryptedNotes: decryptedNotes,
        });
    }

    passwords.value = decryptedPasswords.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) {
            return -1;
        }
        if (!a.isFavorite && b.isFavorite) {
            return 1;
        }
        return 0;
    });

    if (chosenPassword.value?.id) {
        const updatedChosen = passwords.value.find(p => p.id === chosenPassword.value?.id);
        if (updatedChosen) {
            chosenPassword.value = updatedChosen;
        } else {
            chosenPassword.value = undefined;
            showViewPasswordDetails.value = false;
        }
    }
    emit("refreshCounter", false);
};

const generatePasswordForNew = () => {
    try {
        const defaultGenerationOptions = {
            length: 15,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true
        };
        newPasswordForm.value.password = $generatePassword(defaultGenerationOptions);
    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la génération du mot de passe.");
    }
};

const generatePasswordForEdit = () => {
    try {
        const defaultGenerationOptions = {
            length: 15,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true
        };
        editPasswordForm.value.password = $generatePassword(defaultGenerationOptions);
    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la génération du mot de passe.");
    }
};

const openAddPasswordModal = () => {
    newPasswordForm.value = {
        url: '',
        name: '',
        email: '',
        password: '',
        notes: '',
        isFavorite: false,
    };
    showNewPassword.value = false;
    showEditPasswordModal.value = false;
    showViewPasswordDetails.value = false;
    showAddPasswordModal.value = true;
};

const cancelAddPassword = () => {
    showAddPasswordModal.value = false;
};


const saveNewPassword = async () => {
    if (!encryptionKey.value) {
        $toast.error("Clé de chiffrement non disponible. Veuillez déverrouiller le coffre.");
        return;
    }
    if (!newPasswordForm.value.url || !newPasswordForm.value.password) {
        $toast.error("Veuillez remplir au moins l'URL et le mot de passe.");
        return;
    }

    try {
        const { ciphertext: passwordEncrypted, iv: passwordIv } = await cryptoUtils.encryptData(
            newPasswordForm.value.password,
            encryptionKey.value
        );


        const payload = {
            url: newPasswordForm.value.url,
            name: newPasswordForm.value.name || null,
            email: newPasswordForm.value.email || null,
            passwordEncrypted: passwordEncrypted,
            iv: passwordIv,
            notes: newPasswordForm.value.notes,
            isFavorite: newPasswordForm.value.isFavorite,
        };

        await useAuthFetch(`passwords/add?${Date.now()}`, {
            method: "POST",
            body: JSON.stringify(payload),
        });

        $toast.success("Mot de passe créé avec succès!");
        cancelAddPassword();
        await fetchPasswords();
    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la création du mot de passe.");
    }
};

const openEditPasswordModal = (password: DisplayPasswordItem) => {
    if (!isMasterPasswordActive.value) {
        $toast.error("Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.");
        encryptionKey.value = null;
        return;
    }
    if (!password || password.id === undefined) {
        $toast.error("Impossible d'éditer ce mot de passe (ID manquant).");
        return;
    }

    editPasswordForm.value = {
        id: password.id,
        url: password.url || '',
        name: password.name || '',
        email: password.email || '',
        password: password.decryptedPassword || '',
        notes: password.decryptedNotes || '',
        isFavorite: password.isFavorite || false,
    };
    showPasswordInView.value = false;
    showViewPasswordDetails.value = false;
    showEditPassword.value = false;
    showEditPasswordModal.value = true;
};

const cancelEditPassword = () => {
    showEditPasswordModal.value = false;
    showEditPassword.value = false;
    editPasswordForm.value = {
        id: null,
        url: '',
        name: '',
        email: '',
        password: '',
        notes: '',
        isFavorite: false,
    };
    if (chosenPassword.value) {
        showViewPasswordDetails.value = true;
    }
};

const updatePassword = async () => {
    if (!encryptionKey.value) {
        $toast.error("Clé de chiffrement non disponible. Veuillez déverrouiller le coffre.");
        return;
    }
    if (!editPasswordForm.value.id || !editPasswordForm.value.url || !editPasswordForm.value.password) {
        $toast.error("Veuillez remplir au moins l'URL et le mot de passe.");
        return;
    }

    try {
        const { ciphertext: passwordEncrypted, iv: passwordIv } = await cryptoUtils.encryptData(
            editPasswordForm.value.password,
            encryptionKey.value
        );

        let notesEncrypted = null;
        if (editPasswordForm.value.notes) {
            const { ciphertext: encryptedNotes } = await cryptoUtils.encryptData(
                editPasswordForm.value.notes,
                encryptionKey.value
            );
            notesEncrypted = encryptedNotes;
        }

        const payload = {
            url: editPasswordForm.value.url,
            name: editPasswordForm.value.name || null,
            email: editPasswordForm.value.email || null,
            passwordEncrypted: passwordEncrypted,
            iv: passwordIv,
            notesEncrypted: notesEncrypted,
            isFavorite: editPasswordForm.value.isFavorite,
        };

        await useAuthFetch(`passwords/update/${editPasswordForm.value.id}?${Date.now()}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });

        $toast.success("Mot de passe mis à jour avec succès!");
        showEditPasswordModal.value = false;
        await fetchPasswords();
        showViewPasswordDetails.value = true;

    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la mise à jour du mot de passe.");
    }
};


const openPassword = async (password: DisplayPasswordItem) => {
    if (!isMasterPasswordActive.value) {
        $toast.error("Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.");
        encryptionKey.value = null;
        return;
    }

    chosenPassword.value = { ...password };

    showAddPasswordModal.value = false;
    showEditPasswordModal.value = false;
    showViewPasswordDetails.value = true;
    showPasswordInView.value = false;
};

const cancelViewPassword = () => {
    showViewPasswordDetails.value = false;
    chosenPassword.value = undefined;
    showPasswordInView.value = false;
    passwordToDelete.value = null;
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        $toast.success("Copié dans le presse-papiers !");
    } catch (error) {
        console.warn(error);
        $toast.error("Échec de la copie.");
    }
};

const confirmDelete = (id: number | undefined) => {
    if (!isMasterPasswordActive.value) {
        $toast.error(
            "Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.",
        );
        encryptionKey.value = null;
        return;
    }
    if (id !== undefined) {
        passwordToDelete.value = id;
        passwordToDeleteDetails.value = passwords.value?.find(p => p.id === id) || null;
        showDeleteConfirmationModal.value = true;
    }
};

const cancelDelete = () => {
    passwordToDelete.value = null;
    passwordToDeleteDetails.value = null;
    showDeleteConfirmationModal.value = false;
};

const deletePassword = async (id: number) => {
    if (!isMasterPasswordActive.value) {
        $toast.error(
            "Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.",
        );
        encryptionKey.value = null;
        return;
    }

    try {
        await useAuthFetch(`passwords/remove/${id}?${Date.now()}`, { method: "DELETE" });
        $toast.success("Mot de passe supprimé.");
        passwordToDelete.value = null;
        showDeleteConfirmationModal.value = false;
        await fetchPasswords();
    } catch (error) {
        console.warn(error);
        $toast.error("Erreur lors de la suppression du mot de passe.");
    }
};

const deletePasswordAndCloseView = async () => {
    if (passwordToDelete.value === null) return;
    await deletePassword(passwordToDelete.value);
    cancelViewPassword();
};

const toggleFavorite = async (password: DisplayPasswordItem) => {
    if (!isMasterPasswordActive.value) {
        $toast.error("Votre session de mot de passe maître a expiré. Veuillez vous authentifier à nouveau.");
        encryptionKey.value = null;
        return;
    }

    if (password.id === undefined) {
        $toast.error("Impossible de marquer ce mot de passe comme favori (ID manquant).");
        return;
    }

    try {
        await useAuthFetch(`passwords/toggle-favorite/${password.id}?${Date.now()}`, {
            method: "PATCH",
            body: JSON.stringify({ isFavorite: !password.isFavorite }),
        });

        password.isFavorite = !password.isFavorite;
        $toast.success(`Mot de passe ${password.isFavorite ? 'ajouté aux' : 'retiré des'} favoris.`);

        await fetchPasswords();

    } catch (error) {
        $toast.error("Erreur lors de la mise à jour du statut favori.");
        console.warn(error);
    }
};


const checkMasterPasswordExistence = async () => {
    const res = await useAuthFetch(`passwords/get-master-password-hash?${Date.now()}`);
    const masterPasswordHash = res.data.value as { hash: string | null };
    if (masterPasswordHash.hash !== null) {
        isMasterPasswordSet.value = true;
        return;
    }
    isMasterPasswordSet.value = false;
};

onMounted(async () => {
    nextTick(async () => {
        await checkMasterPasswordExistence();
        isMasterPasswordActive.value = masterPasswordStore.isAuthenticated;
        if (isMasterPasswordActive.value && masterPasswordStore.encryptionKey) {
            encryptionKey.value = masterPasswordStore.encryptionKey;
            await fetchPasswords();
        }
    });
});
</script>

<style scoped>
.checkboxStyle {
    appearance: none;
    border: none;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    background-color: #e0e0e0;
    cursor: pointer;
    outline: none;
}

.checkboxStyle:focus {
    outline: none;
    border: none;
}

.checkboxStyle:checked {
    background-color: #ff7f50;
}

.checkboxStyle:hover {
    background-color: #ffc299;
}
</style>
