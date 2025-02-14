<template>
  <div class="container">
    <!-- Top Zone -->
    <div class="top-zone">
      <!-- Info Zones -->
      <div class="info-zones">
        <div class="stat-box">
          <div class="stat-text miniFont">Mots de passe</div>
          <div class="stat-value">
            129
            <Icon name="solar:key-bold" size="20px" />
          </div>
        </div>
        <div class="stat-box alert">
          <div class="stat-text miniFont">Actions requises</div>
          <div class="stat-value">
            12
            <Icon name="material-symbols:warning-rounded" size="20px" />
          </div>
        </div>
      </div>

      <div @click="openPasswordCenter" class="chest-zone ml-2 cursor-pointer">
        <div class="chest-content">
          <span class="normalFontItalic">Ouvrir mon Coffre</span>
          <Icon name="fluent:vault-16-filled" class="textColorPrimary" size="40px" />
        </div>
      </div>
    </div>

    <div class="generator-zone flex flex-col">
      <div class="top flex flex-row w-full justify-between">
        <button class="generate-button" @click="generatePassword">Générer mot de passe</button>
        <div class="options-container">
          <button class="options-button bgColorBlack" @click="toggleOptionsMenu">Options</button>
          <div v-if="showOptionsMenu" class="options-menu">
            <div class="options-grid">
              <label>
                <input type="checkbox" v-model="options.uppercase" class="option-checkbox" />
                Uppercase
              </label>
              <label>
                <input type="checkbox" v-model="options.lowercase" class="option-checkbox" />
                Lowercase
              </label>
              <label>
                <input type="checkbox" v-model="options.numbers" class="option-checkbox" />
                Numbers
              </label>
              <label>
                <input type="checkbox" v-model="options.symbols" class="option-checkbox" />
                Symbols
              </label>
              <label>
                <input type="checkbox" v-model="options.easyToRead" class="option-checkbox" />
                Easy to Read
              </label>
              <label>
                <input type="checkbox" v-model="options.easyToSay" class="option-checkbox" />
                Easy to Say
              </label>
            </div>
            <div>
              <label class="textColorWhite">
                Length:
                <input type="number" class="textColorBlack length-input" v-model="options.length" min="1" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <input
        v-model="generatedPassword"
        type="text"
        class="password-display"
        placeholder="mot de passe généré ici"
        style="outline: none"
        @dblclick="copyToClipboard"
      />
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
const { $generatePassword,$toast } = useNuxtApp();

const generatedPassword = ref('');
const showOptionsMenu = ref(false);
const emit = defineEmits(
  ['openPasswordCenter'],
);

const options = ref({
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  easyToRead: false,
  easyToSay: false,
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

const copyToClipboard = () =>{
  navigator.clipboard.writeText(generatedPassword.value);
  $toast.success('Mot de passe copié', {
    position: 'top-center',
    transition: 'slide'
  });
};

const toggleOptionsMenu = () => {
  showOptionsMenu.value = !showOptionsMenu.value;
};

onMounted(()=>{

})
</script>

<style scoped>
/* General container styling */
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  margin: auto;
}

/* Top Zone */
.top-zone {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.info-zones {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 50%;
}

.stat-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid var(--color-black);
  border-radius: 5px;
  height: 50%;
}

.stat-box.alert {
  border-color: #f44336;
  color: #f44336;
}

.stat-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.chest-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-black);
  border-radius: 5px;
  padding: 15px;
}

.chest-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--color-white);
}

/* Generator Zone */
.generator-zone {
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-around;
}

.generate-button,
.options-button {
  background-color: #f47c60;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
}

.generate-button {
  width: 80%;
}

.options-button {
  width: 100%;
}

.options-container {
  position: relative;
}

.options-menu {
  color: var(--color-white);
  position: absolute;
  bottom: 100%; /* Position above the button */
  right: 0; /* Align to the right of the button */
  background-color: var(--color-black);
  border-radius: 8px; /* More curved edges for better visuals */
  padding: 15px; /* Slightly larger padding */
  width: 350px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.1); /* Updated shadow for better depth */
  z-index: 10;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px; /* Adjusted spacing */
  border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border for detail */
  backdrop-filter: blur(8px); /* Glassy effect for better details */
  transition: transform 0.3s ease, opacity 0.3s ease; /* Smooth transition for visibility */
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  gap: 10px; /* Space between items */
  margin-bottom: 10px; /* Space below grid */
}

.length-input {
  text-align: center;
  color: var(--color-black);
  border-radius: 5px;
}

.options-menu label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.password-display {
  flex: 1;
  padding: 10px;
  border: 1px dashed #333;
  border-radius: 5px;
  font-size: 14px;
  color: #555;
  width: 100%;
  text-align: center;
}

.option-checkbox {
  appearance: none;
  border: none;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  background-color: #e0e0e0;
  cursor: pointer;
  outline: none;
}

.option-checkbox:checked {
  background-color: var(--color-primary);
}

.option-checkbox:hover:checked {
  background-color: var(--color-primary);
}

.option-checkbox:hover {
  background-color: #ffc299;
}

.option-checkbox:hover{
  background-color: #ffc299;
}

</style>