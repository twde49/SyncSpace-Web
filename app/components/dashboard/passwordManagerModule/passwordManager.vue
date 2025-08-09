<template>
    <div class="flex flex-col p-5 rounded h-full mx-auto">
        <div class="flex justify-between mb-6 h-3/4">
            <div class="flex flex-col gap-4 w-1/2">
                <div
                    class="flex justify-between items-center p-2.5 border border-solid border-[var(--color-black)] rounded h-1/2">
                    <div class="stat-text miniFont whitespace-nowrap overflow-hidden text-ellipsis textColorBlack">
                        Mots de passe
                    </div>
                    <div class="text-lg font-bold flex items-center gap-1 textColorBlack">
                        {{ passwordCount }}
                        <Icon name="solar:key-bold" size="20px" />
                    </div>
                </div>
                <div
                    class="flex justify-between items-center p-2.5 border border-solid border-[#f44336] rounded h-1/2 text-[#f44336]">
                    <div class="stat-text miniFont whitespace-nowrap overflow-hidden text-ellipsis">
                        Actions requises
                    </div>
                    <div class="text-lg font-bold flex items-center gap-1">
                        {{ compromisedPasswordsCount }}
                        <Icon name="material-symbols:warning-rounded" size="20px" />
                    </div>
                </div>
            </div>

            <div @click="openPasswordCenter"
                class="flex-1 flex items-center justify-center bg-[var(--color-black)] rounded p-4 ml-2 cursor-pointer">
                <div class="text-center flex flex-col items-center gap-2.5 textColorWhite">
                    <span class="normalFontItalic">Ouvrir mon Coffre</span>
                    <Icon name="fluent:vault-16-filled" class="textColorPrimary" size="40px" />
                </div>
            </div>
        </div>

        <div class="flex flex-col w-full h-2/5 gap-2.5 items-center justify-around">
            <div class="flex flex-row w-full justify-between">
                <button class="bg-[#f47c60] textColorWhite border-none rounded py-2.5 px-4 cursor-pointer text-sm w-4/5"
                    @click="generatePassword">
                    Générer mot de passe
                </button>
                <div class="relative">
                    <button
                        class="bgColorBlack bg-[#f47c60] textColorWhite border-none rounded py-2.5 px-4 cursor-pointer text-sm w-full"
                        @click="toggleOptionsMenu">
                        Options
                    </button>
                    <div v-if="showOptionsMenu"
                        class="optionMenu absolute bottom-full right-0 bg-[var(--color-black)] rounded-lg p-4 w-[350px] shadow-lg z-10 flex flex-col mb-2 border border-solid border-white/20 backdrop-blur transition-all textColorWhite">
                        <div class="grid grid-cols-2 gap-2.5 mb-2.5">
                            <label class="flex items-center gap-1">
                                <input type="checkbox" v-model="options.uppercase"
                                    class="appearance-none border-none rounded w-[30px] h-[30px] bg-[#e0e0e0] cursor-pointer outline-none hover:bg-[#ffc299] checked:bg-[var(--color-primary)] checked:hover:bg-[var(--color-primary)]" />
                                Uppercase
                            </label>
                            <label class="flex items-center gap-1">
                                <input type="checkbox" v-model="options.lowercase"
                                    class="appearance-none border-none rounded w-[30px] h-[30px] bg-[#e0e0e0] cursor-pointer outline-none hover:bg-[#ffc299] checked:bg-[var(--color-primary)] checked:hover:bg-[var(--color-primary)]" />
                                Lowercase
                            </label>
                            <label class="flex items-center gap-1">
                                <input type="checkbox" v-model="options.numbers"
                                    class="appearance-none border-none rounded w-[30px] h-[30px] bg-[#e0e0e0] cursor-pointer outline-none hover:bg-[#ffc299] checked:bg-[var(--color-primary)] checked:hover:bg-[var(--color-primary)]" />
                                Numbers
                            </label>
                            <label class="flex items-center gap-1">
                                <input type="checkbox" v-model="options.symbols"
                                    class="appearance-none border-none rounded w-[30px] h-[30px] bg-[#e0e0e0] cursor-pointer outline-none hover:bg-[#ffc299] checked:bg-[var(--color-primary)] checked:hover:bg-[var(--color-primary)]" />
                                Symbols
                            </label>
                        </div>
                        <div>
                            <label class="textColorWhite">
                                Length:
                                <input type="number" class="textColorWhite text-center rounded" v-model="options.length"
                                    min="1" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <input v-model="generatedPassword" type="text"
                class="flex-1 p-2.5 border border-dashed border-[#333] rounded text-sm textColorBlackFull w-full text-center outline-none"
                placeholder="mot de passe généré ici" @dblclick="copyToClipboard" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
const { $generatePassword, $toast } = useNuxtApp();
import { useAuthFetch } from '#imports';

const generatedPassword = ref('');
const showOptionsMenu = ref(false);
const passwordCount = ref(0);
const compromisedPasswordsCount = ref(0);
const emit = defineEmits(['openPasswordCenter']);

const { refreshCounter } = defineProps({ refreshCounter: Boolean });

const options = ref({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false
});

const openPasswordCenter = () => {
    emit('openPasswordCenter', true);
};

const generatePassword = () => {
    try {
        generatedPassword.value = $generatePassword(options.value);
    } catch (error) {
        alert(error.message);
    }
};

const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword.value);
    $toast.success('Mot de passe copié');
};

const toggleOptionsMenu = () => {
    showOptionsMenu.value = !showOptionsMenu.value;
};

const getPasswordCount = async () => {
    try {
        const response = await useAuthFetch(`passwords/count?${Date.now()}`);
        passwordCount.value = response.data.value.passwordCount;
        compromisedPasswordsCount.value = response.data.value.compromisedPasswordCount;
    } catch (error) {
        console.error(error);
    }
};
watch(() => refreshCounter, async (newValue) => {
  console.log('refreshCounter changed');
  if (newValue === true) {
    await getPasswordCount();
  }
});

onMounted(async () => {
    await nextTick(() => {
        getPasswordCount();
    });
});
</script>

<style scoped>
.option-checkbox:checked {
    background-color: var(--color-primary);
}

.option-checkbox:hover:checked {
    background-color: var(--color-primary);
}

.optionMenu {
    width: 85vw;
}

@media (min-width: 768px) {
    .optionMenu {
        width: 350px;
    }
}
</style>
