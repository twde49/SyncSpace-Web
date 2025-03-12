<template>
  <div class="w-full px-4 h-full">
    <div class="flex justify-between items-center text-lg mb-8">
      <div class="relative flex justify-center items-center megaFont textColorSecondary">
        <button class="flex pt-4 pl-4 justify-center items-center" @click="toggleMonthDropdown">{{ currentMonthName.slice(0, 3) }}
        <Icon name="solar:alt-arrow-down-line-duotone" size="1.4em" />
        </button>
        <div v-if="showMonthDropdown" class="absolute w-max top-full left-0 bg-[var(--color-white)] border border-[var(--color-black)] rounded p-1.5 z-100 grid grid-cols-4 grid-rows-3 gap-1.5 shadow-lg visible opacity-100 z-10">
          <div v-for="(monthName, index) in monthNames" :key="index" 
               class="p-1.5 w-fit cursor-pointer hover:bg-[var(--color-secondary)] hover:rounded hover:text-[var(--color-white)]" 
               @click="setMonth(index)">
            {{ monthName.slice(0, 3) }}
          </div>
        </div>
      </div>

      <div class="ml-2">
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

      <div class="textColorSecondary ml-2">
        <span class="megaFont">{{ year }}</span>
      </div>

      <div class="textColorSecondary ml-2">
        <Icon 
          name="solar:add-square-bold" 
          size="1.4em" 
          class="TextColorSecondary cursor-pointer" 
          data-tooltip-target="tooltip-add-event"
          @click="openAddEventModal"
        />
        <div 
          id="tooltip-add-event" 
          role="tooltip" 
          class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bgColorPrimary rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Ajouter un événement
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>

      <div class="flex">
        <button @click="prevWeek" class="text-2xl">
            <Icon class="bgColorSecondary" name="solar:alt-arrow-left-outline" size="1.2em" />
        </button>
        <button @click="nextWeek" class="text-2xl">
            <Icon class="bgColorSecondary" name="solar:alt-arrow-right-outline" size="1.2em" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 text-center mb-2.5">
      <div class="day" v-for="(day, index) in daysOfWeek" :key="index">{{ day }}</div>
    </div>

    <div class="grid grid-cols-7 gap-1.5">
      <div
        v-for="(day, index) in visibleDays"
        :key="index"
        :class="['text-center p-2.5 bg-[var(--color-black)] text-[var(--color-white)] rounded-full cursor-pointer relative flex justify-center items-center w-16 h-16', { 'bg-[var(--color-primary)] text-[var(--color-white)]': isToday(day) }]"
        @click="openDay(day)"
        :data-tooltip-target="'tooltip-day-' + index"
        @mouseenter="hoveredDay = day as Date"
        @dblclick="openAddEventModalForDay(day)"
      >
        <div>{{ day.getDate() }}</div>
        <div v-if="hasEvents(day)" class="absolute bottom-1.5 right-1.5 bg-[var(--color-white)] text-[var(--color-black)] rounded-full p-0.5 w-[30px] h-[15px] border border-[var(--color-primary)] flex items-center justify-center miniFont">{{ getEventCount(day) }}</div>

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

    <div v-if="showDayModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]" @click.self="closeDayModal">
      <div class="bg-[var(--color-white)] w-[90%] max-w-[800px] max-h-[90vh] rounded-lg overflow-y-auto shadow-lg">
        <div class="flex justify-between items-center p-4 text-[var(--color-black)] border-b border-[var(--color-primary)]">
          <h2 class="m-0">{{ selectedDayFormatted }}</h2>
          <div class="flex items-center">
            <button 
              @click="openAddEventModalForDay(selectedDay)"
              class="mr-4 bg-[var(--color-primary)] text-white px-3 py-1 rounded flex items-center"
            >
              <Icon name="solar:add-line-duotone" class="mr-1" />
              Ajouter
            </button>
            <button @click="closeDayModal" class="bg-transparent border-0 text-2xl cursor-pointer">&times;</button>
          </div>
        </div>
        <div class="p-4">
          <div class="flex flex-col gap-2.5">
            <div v-for="hour in 24" :key="hour-1" class="flex min-h-[60px] border-b border-[var(--color-black)]">
              <div class="w-[60px] text-right pr-2.5 font-bold text-[var(--color-black)]">{{ hour-1 }}:00</div>
              <div class="flex-grow pl-2.5 border-l border-[var(--color-primary)]">
                <div 
                  v-for="event in getEventsForHour(selectedDay, hour-1)" 
                  :key="event.id" 
                  class="text-[var(--color-white)] p-2 rounded mb-1.5 cursor-pointer"
                  :style="{ backgroundColor: event.color || '#666' }"
                  @click="openEventDetailModal(event)"
                >
                  {{ event.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEventDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]" @click.self="closeEventDetailModal">
      <div class="bg-[var(--color-white)] w-[90%] max-w-[800px] max-h-[90vh] rounded-lg overflow-y-auto shadow-lg">
        <div class="flex justify-between items-center p-4 text-[var(--color-black)] border-b" :style="{ borderColor: selectedEvent?.color || 'var(--color-primary)' }">
          <h2 class="m-0">{{ selectedEvent?.title }}</h2>
          <div class="flex items-center">
            <button 
              @click="editEvent(selectedEvent)"
              class="mr-4 px-3 py-1 rounded flex items-center text-white"
              :style="{ backgroundColor: selectedEvent?.color || 'var(--color-primary)' }"
            >
              <Icon name="material-symbols:edit-outline" class="mr-1" />
              Modifier
            </button>
            <button @click="closeEventDetailModal" class="bg-transparent border-0 text-2xl cursor-pointer">&times;</button>
          </div>
        </div>
        <div class="p-4 text-[var(--color-black)]">
          <div class="flex flex-col gap-4">
            <div>
              <h3 class="text-lg font-bold mb-2">Détails</h3>
              <div class="flex mb-2 items-center">
                <Icon name="mdi:calendar" class="mr-2" />
                <span>
                  {{ formatEventDate(selectedEvent) }}
                </span>
              </div>
              <div class="flex mb-2 items-center" v-if="selectedEvent?.description">
                <Icon name="mdi:text" class="mr-2" />
                <span>{{ selectedEvent?.description }}</span>
              </div>
              <div class="flex mb-2 items-center" v-if="selectedEvent?.isAllDay">
                <Icon name="mdi:clock-outline" class="mr-2" />
                <span>Journée entière</span>
              </div>
            </div>

            <div v-if="selectedEvent?.participants && selectedEvent.participants.length > 0">
              <h3 class="text-lg font-bold mb-2">Participants</h3>
              <div class="flex flex-wrap gap-2">
                <div v-for="user in selectedEvent.participants" :key="user.id" class="flex items-center px-2.5 py-1.5 rounded-full text-sm" :style="{ backgroundColor: selectedEvent?.color || 'var(--color-primary)', color: 'white' }">
                  <span>{{ user.email }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]" @click.self="closeAddEventModal">
      <div class="bg-[var(--color-white)] w-[90%] max-w-[800px] max-h-[90vh] rounded-lg overflow-y-auto shadow-lg">
        <div class="flex justify-between items-center p-4 text-[var(--color-black)] border-b border-[var(--color-primary)]">
          <h2 class="m-0">Ajouter un événement</h2>
          <button @click="closeAddEventModal" class="bg-transparent border-0 text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="p-4">
          <form @submit.prevent="saveEvent" class="text-[var(--color-black)]">
            <div class="mb-4">
              <label for="event-title" class="block mb-1.5 font-bold">Titre</label>
              <input 
                type="text" 
                id="event-title" 
                v-model="newEvent.title" 
                class="w-full p-2 rounded bg-[var(--color-black)] text-[var(--color-white)]"
                required
              />
            </div>

            <div class="mb-4">
              <label for="event-description" class="block mb-1.5 font-bold">Description</label>
              <textarea 
                id="event-description" 
                v-model="newEvent.description" 
                class="w-full p-2 rounded bg-[var(--color-black)] text-[var(--color-white)] min-h-[100px] resize-y"
              ></textarea>
            </div>

            <div class="mb-4">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="isAllDay" 
                  v-model="newEvent.isAllDay" 
                  class="mr-2"
                />
                <label for="isAllDay">Journée entière</label>
              </div>
            </div>

            <div class="flex flex-col gap-4 mb-4">
              <div class="mb-2.5">
                <div class="mb-1.5">
                  <label for="start-date" class="block mb-1.5 font-bold">Date de début</label>
                </div>
                <div class="flex gap-2.5 items-center">
                  <input 
                    type="date" 
                    id="start-date" 
                    v-model="newEvent.startDateInput" 
                    class="w-full p-2 rounded bg-[var(--color-black)] text-[var(--color-white)] flex-2"
                    required
                  />
                  <input 
                    v-if="!newEvent.isAllDay"
                    type="time" 
                    id="start-time" 
                    v-model="newEvent.startTimeInput" 
                    class="w-full p-2 rounded bg-[var(--color-black)] text-[var(--color-white)] flex-1"
                    required
                  />
                </div>
              </div>

              <div class="mb-2.5">
                <div class="mb-1.5">
                  <label for="end-date" class="block mb-1.5 font-bold">Date de fin</label>
                </div>
                <div class="flex gap-2.5 items-center">
                  <input 
                    type="date" 
                    id="end-date" 
                    v-model="newEvent.endDateInput" 
                    class="w-full p-2 rounded bg-[var(--color-black)] text-[var(--color-white)] flex-2"
                    required
                  />
                  <input 
                    v-if="!newEvent.isAllDay"
                    type="time" 
                    id="end-time" 
                    v-model="newEvent.endTimeInput" 
                    class="w-full p-2 rounded bg-[var(--color-black)] text-[var(--color-white)] flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label for="event-color" class="block mb-1.5 font-bold">Couleur</label>
              <input 
                type="color" 
                id="event-color" 
                v-model="newEvent.color" 
                class="w-full h-10 p-0 rounded bg-[var(--color-black)] text-[var(--color-white)]"
              />
            </div>

            <div class="mb-4">
              <label for="participants" class="block mb-1.5 font-bold">Participants</label>
              <div>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="w-full p-3 border border-gray-300 rounded-md text-base form-control"
                  placeholder="Rechercher des utilisateurs..."
                  @input="searchUsers"
                />
              </div>
              <div class="max-h-[200px] overflow-y-auto border border-gray-200 rounded mb-4" v-if="searchResults.length > 0">
                <div
                  v-for="user in searchResults"
                  :key="user.id"
                  class="flex items-center p-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  @click="selectUser(user)"
                >
                  <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center mr-2.5">
                    <Icon name="mdi:account" size="1.5em" />
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold">{{ user.firstName }}</span>
                    <span class="text-xs text-gray-500">{{ user.email }}</span>
                  </div>
                </div>
              </div>
              <div class="py-4 text-center text-gray-500" v-else-if="searchQuery && !isSearching">
                Pas d'utilisateurs trouvés
              </div>
              <div class="mt-5" v-if="selectedUsers.length > 0">
                <h4 class="mt-0 mb-2.5">Utilisateurs sélectionnés</h4>
                <div class="flex flex-wrap gap-2">
                  <div v-for="user in selectedUsers" :key="user.id" class="flex items-center bg-[var(--color-primary)] px-2.5 py-1.5 rounded-full text-sm">
                    <span>{{ user.email }}</span>
                    <button @click="removeUser(user)" class="bg-transparent border-0 cursor-pointer ml-1.5 flex items-center justify-center">
                      <Icon name="mdi:close" size="0.8em" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2.5 mt-5">
              <button type="submit" class="py-2 px-4 rounded bg-[var(--color-primary)] text-[var(--color-white)] border-0 cursor-pointer">Enregistrer</button>
              <button type="button" @click="closeAddEventModal" class="py-2 px-4 rounded bg-transparent text-[var(--color-black)] border border-[var(--color-primary)] cursor-pointer">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import type { Event } from '~/types/Event';
import useAuthFetch from '~/composables/useAuthFetch';
import type { User } from '~/types/User';
import { useUserStore } from '~/stores/userStore';
const userStore = useUserStore();
const { $toast } = useNuxtApp();

const currentDate = ref(new Date());
const month = computed(() => currentDate.value.getMonth());
const year = computed(() => currentDate.value.getFullYear());
const currentMonthName = computed(() => monthNames[month.value]);
const hoveredDay = ref<Date | null>(null);

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const daysOfWeek = ["l", "m", "m", "j", "v", "s", "d"];

const showMonthDropdown = ref(false);
const showDayModal = ref(false);
const showAddEventModal = ref(false);
const showEventDetailModal = ref(false);
const selectedDay = ref<Date | null>(null);
const selectedEvent = ref<Event | null>(null);

const newEvent = ref({
  title: '',
  description: '',
  startDateInput: '',
  startTimeInput: '',
  endDateInput: '',
  endTimeInput: '',
  color: '#4a5568',
  isAllDay: false,
});

const searchQuery = ref('');
const searchResults = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const isSearching = ref(false);

const searchUsers = async (): Promise<void> => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  try {
    const response = await useAuthFetch('conversation/user/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: searchQuery.value,
      }),
    });

    if (response.data.value) {
      searchResults.value = response.data.value as User[];
    }

    const currentUser = userStore.email;

    searchResults.value = searchResults.value.filter(
      user => user.email !== currentUser,
    );
  } catch (error: unknown) {
    const err = error as Error;
    $toast.error(err.message || 'Error searching for users');
  } finally {
    isSearching.value = false;
  }
};

function selectUser(user: User): void {
  if (!selectedUsers.value.some(u => u.id === user.id)) {
    selectedUsers.value.push(user);
  }
  searchQuery.value = '';
  searchResults.value = [];
}

function removeUser(user: User): void {
  selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id);
}

const selectedDayFormatted = computed(() => {
  if (!selectedDay.value) return '';

  const day = selectedDay.value.getDate();
  const month = monthNames[selectedDay.value.getMonth()];
  const year = selectedDay.value.getFullYear();

  return `${day} ${month} ${year}`;
});

function formatDayTooltip(day: Date): string {
  if (!day) return '';

  const dayNum = day.getDate();
  const month = monthNames[day.getMonth()];
  const year = day.getFullYear();
  const events = getEventCount(day);

  return `${dayNum} ${month} ${year} - ${events ? `${events} événement(s)` : 'Aucun événement'}`;
}

function toggleMonthDropdown(): void {
  showMonthDropdown.value = !showMonthDropdown.value;
}

function setMonth(index: number): void {
  console.log("setMonth", monthNames[index]);
  const newDate = new Date(currentDate.value);
  newDate.setMonth(index);
  currentDate.value = newDate;
  showMonthDropdown.value = false;
}

const visibleDays = computed(() => {
  const startOfWeek = new Date(currentDate.value);
  startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay() + 1);
  const days: Date[] = [];

  for (let i = 0; i < 14; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
});

function prevWeek(): void {
  const newDate = new Date(currentDate.value);
  newDate.setDate(currentDate.value.getDate() - 7);
  currentDate.value = newDate;
}

function nextWeek(): void {
  const newDate = new Date(currentDate.value);
  newDate.setDate(currentDate.value.getDate() + 7);
  currentDate.value = newDate;
}

function isToday(day: Date): boolean {
  const today = new Date();
  return today.toDateString() === day.toDateString();
}

const events = ref<Event[]>([]);
function hasEvents(day: Date): boolean {
  return events.value.some(event => {
    const startDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
    const endDate = typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate;

    if (startDate && endDate)
    return (
      startDate.toDateString() === day.toDateString() || 
      endDate.toDateString() === day.toDateString() || 
      (startDate < day && endDate > day)
    );
  });
}

function getEventCount(day: Date): number {
  return events.value.filter(event => {
    const startDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
    const endDate = typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate;

    if (startDate && endDate)
    return (
      startDate.toDateString() === day.toDateString() || 
      endDate.toDateString() === day.toDateString() || 
      (startDate < day && endDate > day)
    );
  }).length;
}

function getEventsForHour(day: Date | null, hour: number): Event[] {
  if (!day) return [];

  return events.value.filter(event => {
    const startDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
    const endDate = typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate;

    if (!startDate || !endDate) return false;

    const dayMatch = 
      startDate.toDateString() === day.toDateString() || 
      endDate.toDateString() === day.toDateString() || 
      (startDate < day && endDate > day);

    const hourMatch = 
      startDate.getHours() <= hour && 
      (endDate.getHours() > hour || 
       (endDate.getHours() === hour && endDate.getMinutes() > 0));

    return dayMatch && hourMatch;
  });
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function openAddEventModalForDay(day: Date | null): void {
  if (!day) return;

  const today = new Date(day);

  // Set time to 9:00 AM for start and 10:00 AM for end
  const startHour = 9;
  const endHour = 10;

  today.setHours(startHour, 0, 0, 0);

  const endTime = new Date(today);
  endTime.setHours(endHour, 0, 0, 0);

  newEvent.value = {
    title: '',
    description: '',
    startDateInput: formatDateForInput(today),
    startTimeInput: `${startHour.toString().padStart(2, '0')}:00`,
    endDateInput: formatDateForInput(today),
    endTimeInput: `${endHour.toString().padStart(2, '0')}:00`,
    color: '#4a5568',
    isAllDay: false
  };

  selectedUsers.value = [];
  searchQuery.value = '';
  searchResults.value = [];

  showAddEventModal.value = true;
}

function openAddEventModal(): void {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  newEvent.value = {
    title: '',
    description: '',
    startDateInput: formatDateForInput(today),
    startTimeInput: '09:00',
    endDateInput: formatDateForInput(today),
    endTimeInput: '10:00',
    color: '#4a5568',
    isAllDay: false
  };

  selectedUsers.value = [];
  searchQuery.value = '';
  searchResults.value = [];

  showAddEventModal.value = true;
}

function openEventDetailModal(event: Event): void {
  selectedEvent.value = event;
  showEventDetailModal.value = true;
}

function closeEventDetailModal(): void {
  showEventDetailModal.value = false;
  selectedEvent.value = null;
}

function formatEventDate(event: Event | null): string {
  if (!event) return '';

  const startDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
  const endDate = typeof event.endDate === 'string' ? new Date(event.endDate) : event.endDate;

  if (!startDate || !endDate) return '';

  const sameDay = startDate.toDateString() === endDate.toDateString();

  const formatDatePart = (date: Date) => {
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTimePart = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (event.isAllDay) {
    return sameDay 
      ? `${formatDatePart(startDate)} (Journée entière)`
      : `Du ${formatDatePart(startDate)} au ${formatDatePart(endDate)} (Journée entière)`;
  }

  return sameDay
    ? `${formatDatePart(startDate)} de ${formatTimePart(startDate)} à ${formatTimePart(endDate)}`
    : `Du ${formatDatePart(startDate)} ${formatTimePart(startDate)} au ${formatDatePart(endDate)} ${formatTimePart(endDate)}`;
}

function editEvent(event: Event | null): void {
  if (!event) return;
  console.log('Edit event:', event);
}

function closeAddEventModal(): void {
  showAddEventModal.value = false;
}

async function saveEvent(): Promise<void> {
  try {
    const startDate = new Date(`${newEvent.value.startDateInput}T${newEvent.value.startTimeInput}`);
    const endDate = new Date(`${newEvent.value.endDateInput}T${newEvent.value.endTimeInput}`);

    const eventData = {
      title: newEvent.value.title,
      description: newEvent.value.description,
      startDate,
      endDate,
      color: newEvent.value.color,
      participantsIds: selectedUsers.value.map(user => user.id),
      isAllDay: newEvent.value.isAllDay
    };

    const response = await useAuthFetch('events/create', {
      method: 'POST',
      body: eventData
    });

    if (response.data.value) {
      const newEventObj = response.data.value as Event;
      if (typeof newEventObj.startDate === 'string') {
        newEventObj.startDate = new Date(newEventObj.startDate);
      }
      if (typeof newEventObj.endDate === 'string') {
        newEventObj.endDate = new Date(newEventObj.endDate);
      }
      events.value.push(newEventObj);
      closeAddEventModal();
    }
  } catch (error) {
    console.error('Error saving event:', error);
  }
}

const fetchEvents = async (): Promise<void> => {
  try {
    const response = await useAuthFetch('events/all');
    events.value = response.data.value as Event[];
    for (const event of events.value) {
      if (typeof event.startDate === 'string') {
        event.startDate = new Date(event.startDate);
      }
      if (typeof event.endDate === 'string') {
        event.endDate = new Date(event.endDate);
      }
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

function openDay(day: Date): void {
  selectedDay.value = day;
  showDayModal.value = true;
}

function closeDayModal(): void {
  showDayModal.value = false;
}

onMounted(async () => {
  userStore.loadUserFromCookies();
  await nextTick(async () => {
    await fetchEvents();
  });
});
</script>
