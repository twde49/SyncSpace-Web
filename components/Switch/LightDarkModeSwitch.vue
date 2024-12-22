<template>
  <div class="switch-container">
    <div class="switch" :class="{ active: isDark }" @click="toggleMode">
      <div class="switch-icon">
        <span v-if="isDark" class="flex justify-center items-center">
          <Icon name="ic:round-dark-mode" size="1.4em" class="icon-moon" />
        </span>
        <span v-else class="flex justify-center items-center">
          <Icon name="ic:round-wb-sunny" size="1.4em" class="icon-sun" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isDark = ref(false);

const toggleMode = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle('dark-mode', isDark.value); // Optional: Add a global class for styling the body
};
</script>

<style scoped>
/* The switch itself */
.switch {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 100px;
  height: 40px;
  border-radius: var(--global-radius);
  background-color: var(--color-white, #ccc);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.switch.active {
  background-color: var(--color-black); /* Dark mode switch background */
}

/* The toggle icon inside the switch */
.switch-icon {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: var(--color-black);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  transform: translateX(5px); /* Light mode position */
}

.switch.active .switch-icon {
  transform: translateX(65px); /* Dark mode position */
  background-color: var(--color-white); /* Icon color for dark mode */
}

.icon-moon {
  color: var(--color-black);
}

.icon-sun {
  color: var(--color-white);
}
</style>
