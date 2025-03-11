<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="month-selector flex justify-center items-center megaFont textColorSecondary">
        <button class="flex pt-4 pl-4 justify-center items-center" @click="toggleMonthDropdown">{{ currentMonthName.slice(0, 3) }}
        <Icon name="solar:alt-arrow-down-line-duotone" size="1.4em" />
        </button>
        <div v-if="showMonthDropdown" class="month-dropdown">
          <div v-for="(monthName, index) in monthNames" :key="index" @click="setMonth(index)">
            {{ monthName.slice(0, 3) }}
          </div>
        </div>
      </div>


      <div class="today-button ml-2">
        <button 
          @click="currentDate = new Date()" 
          class="flex justify-center items-center textColorSecondary rounded-full"
          data-tooltip-target="tooltip-today"
        >
          <Icon name="material-symbols:today" size="1.2em" />
        </button>
        <div 
          id="tooltip-today" 
          role="tooltip" 
          class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bgColorPrimary rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Aller à la date du jour
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>

      <div class="year-display textColorSecondary ml-2">
        <span class="megaFont">{{ year }}</span>
      </div>

      <div class="week-navigation">
        <button @click="prevWeek">
            <Icon class="bgColorSecondary" name="solar:alt-arrow-left-outline" size="1.2em" />
        </button>
        <button @click="nextWeek">
            <Icon class="bgColorSecondary" name="solar:alt-arrow-right-outline" size="1.2em" />
        </button>
      </div>
    </div>

    <div class="days-of-week">
      <div class="day" v-for="(day, index) in daysOfWeek" :key="index">{{ day }}</div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(day, index) in visibleDays"
        :key="index"
        :class="['calendar-day', { 'today': isToday(day), 'has-events': hasEvents(day) }]"
        @click="openDay(day)"
        :data-tooltip-target="'tooltip-day-' + index"
        @mouseenter="hoveredDay = day"
      >
        <div class="day-number">{{ day.getDate() }}</div>
        <div v-if="hasEvents(day)" class="event-notification flex items-center justify-center miniFont">{{ getEventCount(day) }}</div>

        <div 
          :id="'tooltip-day-' + index" 
          role="tooltip" 
          class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bgColorPrimary rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          {{ formatDayTooltip(day) }}
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>

    <div v-if="showDayModal" class="day-modal-overlay" @click.self="closeDayModal">
      <div class="day-modal">
        <div class="day-modal-header">
          <h2>{{ selectedDayFormatted }}</h2>
          <button @click="closeDayModal" class="close-button">&times;</button>
        </div>
        <div class="day-modal-body">
          <div class="hour-grid">
            <div v-for="hour in 24" :key="hour-1" class="hour-slot">
              <div class="hour-label">{{ hour-1 }}:00</div>
              <div class="hour-events">
                <div 
                  v-for="event in getEventsForHour(selectedDay, hour-1)" 
                  :key="event.id" 
                  class="event-item"
                >
                  {{ event.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentDate = ref(new Date());
const month = computed(() => currentDate.value.getMonth());
const year = computed(() => currentDate.value.getFullYear());
const currentMonthName = computed(() => monthNames[month.value]);
const hoveredDay = ref(null);

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const daysOfWeek = ["l", "m", "m", "j", "v", "s", "d"];

const showMonthDropdown = ref(false);
const showDayModal = ref(false);
const selectedDay = ref(null);

const selectedDayFormatted = computed(() => {
  if (!selectedDay.value) return '';

  const day = selectedDay.value.getDate();
  const month = monthNames[selectedDay.value.getMonth()];
  const year = selectedDay.value.getFullYear();

  return `${day} ${month} ${year}`;
});

function formatDayTooltip(day) {
  if (!day) return '';

  const dayNum = day.getDate();
  const month = monthNames[day.getMonth()];
  const year = day.getFullYear();
  const events = getEventCount(day);

  return `${dayNum} ${month} ${year} - ${events ? `${events} événement(s)` : 'Aucun événement'}`;
}

function toggleMonthDropdown() {
  showMonthDropdown.value = !showMonthDropdown.value;
}

function setMonth(index) {
  console.log("setMonth", monthNames[index]);
  const newDate = new Date(currentDate.value);
  newDate.setMonth(index);
  currentDate.value = newDate;
  showMonthDropdown.value = false;
}

const visibleDays = computed(() => {
  const startOfWeek = new Date(currentDate.value);
  startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay() + 1);
  const days = [];

  for (let i = 0; i < 14; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
});

function prevWeek() {
  const newDate = new Date(currentDate.value);
  newDate.setDate(currentDate.value.getDate() - 7);
  currentDate.value = newDate;
}

function nextWeek() {
  const newDate = new Date(currentDate.value);
  newDate.setDate(currentDate.value.getDate() + 7);
  currentDate.value = newDate;
}

function isToday(day) {
  const today = new Date();
  return today.toDateString() === day.toDateString();
}

const events = ref([
  { id: 1, date: new Date(2025, 2, 10), time: 9, description: "Réunion importante" },
  { id: 2, date: new Date(2025, 2, 10), time: 14, description: "Appel client" },
  { id: 3, date: new Date(2025, 2, 12), time: 12, description: "Déjeuner avec client" }
]);

function hasEvents(day) {
  return events.value.some(event => event.date.toDateString() === day.toDateString());
}

function getEventCount(day) {
  return events.value.filter(event => event.date.toDateString() === day.toDateString()).length;
}

function getEventsForHour(day, hour) {
  if (!day) return [];
  return events.value.filter(
    event => event.date.toDateString() === day.toDateString() && event.time === hour
  );
}

function openDay(day) {
  selectedDay.value = day;
  showDayModal.value = true;
}

function closeDayModal() {
  showDayModal.value = false;
}
</script>

<style scoped>
.calendar-container {
  width: 100%;
  padding: 10px;
  height: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  margin-bottom: 30px;
}

.month-selector {
  position: relative;
}

.month-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-white);
  border: 1px solid var(--color-black);
  border-radius: 5px;
  padding: 5px;
  z-index: 100;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.25);
  visibility: visible;
  opacity: 1;
}

.month-dropdown div {
  padding: 5px;
  cursor: pointer;
}

.month-dropdown div:hover {
  background-color: var(--color-secondary);
  border-radius: 5px;
  color: var(--color-white);
}

.week-navigation button {
  font-size: 1.5em;
}

.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  text-align: center;
  padding: 10px;
  background-color: var(--color-black);
  color: var(--color-white);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 65px;
}

.calendar-day.today {
  background-color: var(--color-primary);
  color: var(--color-white);
}


.event-notification {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: var(--color-white);
  color: var(--color-black);
  border-radius: 100px;
  padding: 3px;
  width: 30px;
  height: 15px;
  border: 1px solid var(--color-primary);
}

.chevron {
  font-size: 1.2em;
}

.day-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.day-modal {
  background-color: var(--color-black);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-primary);
}

.day-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--color-primary);
}

.day-modal-header h2 {
  margin: 0;
  color: var(--color-white);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--color-white);
}

.day-modal-body {
  padding: 15px;
}

.hour-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hour-slot {
  display: flex;
  min-height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hour-label {
  width: 60px;
  text-align: right;
  padding-right: 10px;
  font-weight: bold;
  color: var(--color-white);
}

.hour-events {
  flex-grow: 1;
  padding-left: 10px;
  border-left: 1px solid var(--color-primary);
}

.event-item {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
