<template>
    <div class="min-h-screen bg-gradient-to-br from-secondary to-tritary flex items-center justify-center p-5">
        <Navbar />

        <div class="verification-container">
            <div class="gradient-border"></div>

            <div class="logo">
                <Icon name="ph:lock-open" size="48" />
            </div>

            <h1 class="title">Vérification de Code</h1>
            <p class="subtitle">
                Nous avons envoyé un code de vérification à votre email
            </p>

            <Form @submit="verifyCode" class="form-container">
                <div class="code-inputs-container">
                    <div class="code-inputs">
                        <input v-for="(digit, index) in codeDigits" :key="index"
                            :ref="el => setInputRef(el as HTMLInputElement | null, index)" v-model="codeDigits[index]"
                            type="text" class="code-input" :class="{
                                'filled': digit,
                                'error': hasError,
                                'animate-shake': hasError && index === currentFocus
                            }" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="off"
                            @input="handleInput(index, $event)" @keydown="handleKeydown(index, $event)"
                            @paste="handlePaste($event)" @focus="currentFocus = index" />
                    </div>

                    <div v-if="errorMessage" class="error-message show">
                        {{ errorMessage }}
                    </div>
                </div>

                <button type="submit" class="verify-button" :class="{ 'loading': isLoading }"
                    :disabled="!isCodeComplete || isLoading">
                    <div v-if="isLoading" class="loading-spinner"></div>
                    <span>{{ isLoading ? 'Vérification...' : 'Vérifier le Code' }}</span>
                </button>
            </Form>

            <div class="resend-section">
                <p class="resend-text">Vous n'avez pas reçu le code ?</p>
                <button class="resend-button" :disabled="resendCountdown > 0" @click="resendCode">
                    <span v-if="resendCountdown === 0">Renvoyer le code</span>
                    <span v-else class="timer">Renvoyer dans {{ resendCountdown }}s</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';
import { Form } from 'vee-validate';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

const userId = route.params.id as string;

const codeDigits = ref<string[]>(['', '', '', '', '', '']);
const inputRefs = ref<(HTMLInputElement | null)[]>([]);
const currentFocus = ref(0);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const resendCountdown = ref(0);

const isCodeComplete = computed(() => {
    return codeDigits.value.every(digit => digit.length === 1);
});

const fullCode = computed(() => {
    return codeDigits.value.join('');
});

const setInputRef = (el: HTMLInputElement | null, index: number) => {
    if (el) {
        inputRefs.value[index] = el;
    }
};

const handleInput = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');

    if (value.length <= 1) {
        codeDigits.value[index] = value;

        if (hasError.value) {
            clearError();
        }

        if (value && index < 5) {
            nextTick(() => {
                inputRefs.value[index + 1]?.focus();
            });
        }
    }
};

const handleKeydown = (index: number, event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
        if (!codeDigits.value[index] && index > 0) {
            nextTick(() => {
                inputRefs.value[index - 1]?.focus();
            });
        }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        inputRefs.value[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < 5) {
        event.preventDefault();
        inputRefs.value[index + 1]?.focus();
    }

    if (event.key === 'Enter' && isCodeComplete.value) {
        verifyCode();
    }
};

const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, 6);

    digits.split('').forEach((digit, index) => {
        if (index < 6) {
            codeDigits.value[index] = digit;
        }
    });

    const lastIndex = Math.min(digits.length, 5);
    nextTick(() => {
        inputRefs.value[lastIndex]?.focus();
    });

    clearError();
};

const showError = (message: string) => {
    errorMessage.value = message;
    hasError.value = true;

    setTimeout(() => {
        clearError();
    }, 3000);
};

const clearError = () => {
    errorMessage.value = '';
    hasError.value = false;
};

const verifyCode = async () => {
    if (!isCodeComplete.value) {
        showError('Veuillez saisir les 6 chiffres du code.');
        return;
    }

    isLoading.value = true;
    clearError();

    try {
        const response = await fetch(`${config.public.apiUrl}verifyVerificationCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                code: fullCode.value,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
        }


        $toast.success('Code vérifié avec succès !');

        router.push('/login');


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.warn(error);

        if (error.message.includes('Invalid code')) {
            showError('Code incorrect. Veuillez réessayer.');
        } else if (error.message.includes('expired')) {
            showError('Ce code a expiré. Demandez un nouveau code.');
        } else {
            showError('Une erreur est survenue lors de la vérification.');
        }

        codeDigits.value = ['', '', '', '', '', ''];
        nextTick(() => {
            inputRefs.value[0]?.focus();
        });

    } finally {
        isLoading.value = false;
    }
};

const resendCode = async () => {
    if (resendCountdown.value > 0) return;

    try {
        const response = await fetch(`${config.public.apiUrl}sendVerificationCode/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        $toast.success('Nouveau code envoyé !');
        startResendTimer();

    } catch (error) {
        console.error('Resend error:', error);
        $toast.error('Erreur lors du renvoi du code. Veuillez réessayer.');
    }
};

const startResendTimer = () => {
    resendCountdown.value = 60;
    const timer = setInterval(() => {
        resendCountdown.value--;
        if (resendCountdown.value <= 0) {
            clearInterval(timer);
        }
    }, 1000);
};

onMounted(() => {
    nextTick(() => {
        inputRefs.value[0]?.focus();
        resendCode();
    });

});
</script>

<style scoped>
:root {
    --color-white: #f7f3ed;
    --color-black: #54494b;
    --color-primary: #f78764;
    --color-secondary: #8789c0;
    --color-tritary: #a06cd5;
}

.bg-gradient-to-br {
    background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-tritary) 100%);
}

.from-secondary {
    --tw-gradient-from: var(--color-secondary);
}

.to-tritary {
    --tw-gradient-to: var(--color-tritary);
}

.verification-container {
    background: var(--color-white);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(84, 73, 75, 0.1);
    padding: 40px;
    max-width: 450px;
    width: 100%;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.gradient-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-tritary));
}

.logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: 50%;
    margin: 0 auto 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
    font-size: 2rem;
    font-weight: bold;
}

.title {
    color: var(--color-black);
    font-size: 1.8rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.subtitle {
    color: var(--color-black);
    opacity: 0.7;
    margin-bottom: 30px;
    font-size: 1rem;
    line-height: 1.5;
}

.form-container {
    width: 100%;
}

.code-inputs-container {
    margin-bottom: 30px;
}

.code-inputs {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}

.code-input {
    width: 50px;
    height: 60px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-black);
    background: var(--color-white);
    transition: all 0.3s ease;
    outline: none;
}

.code-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(247, 135, 100, 0.1);
    transform: translateY(-2px);
}

.code-input.filled {
    border-color: var(--color-secondary);
    background: rgba(135, 137, 192, 0.1);
    animation: bounce-in 0.3s ease;
}

.code-input.error {
    border-color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
}

@keyframes bounce-in {
    0% {
        transform: scale(0.8);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.animate-shake {
    animation: shake 0.5s ease-in-out;
}

.error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 10px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.error-message.show {
    opacity: 1;
    transform: translateY(0);
}

.verify-button {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: var(--color-white);
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.verify-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(247, 135, 100, 0.3);
}

.verify-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid var(--color-white);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.resend-section {
    text-align: center;
    margin-top: 20px;
}

.resend-text {
    color: var(--color-black);
    opacity: 0.6;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.resend-button {
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.resend-button:hover:not(:disabled) {
    color: var(--color-secondary);
}

.resend-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.timer {
    color: var(--color-tritary);
    font-weight: 600;
}

@media (max-width: 480px) {
    .verification-container {
        padding: 30px 20px;
    }

    .code-inputs {
        gap: 10px;
    }

    .code-input {
        width: 45px;
        height: 55px;
        font-size: 1.3rem;
    }
}
</style>
