<template>
  <div
    id="messageMenuClosed"
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center marged-left"
    v-if="closed"
    ref="closedButton"
  >
    <Icon
      name="tabler:message-filled"
      size="3.5em"
      class="messageIcon cursor-pointer"
      @click="openClose"
    />
  </div>
  <div
    v-else
    class="expanded-container bgColorLight flex justify-start items-start marged-left"
    ref="expandedContainer"
  >
    <div class="leftPart">
      <div
        class="h-max w-max bgColorLight topComponentSize flex justify-center items-center cursor-pointer fixed-icon"
      >
        <Icon
          name="tabler:message-filled"
          size="3.5em"
          class="messageIcon expanded-icon cursor-pointer"
          @click="openClose"
        />
      </div>

      <div class="conversationSlider mt-3">
        <div
          class="w-full littleConversation"
          v-for="conversation in conversations"
          :key="conversation.id"
        >
          <little-conversation
            class="mt-8 w-full"
            :conversation="conversation"
            :is-active="activeConversation === conversation"
            @click="activeConversation = (activeConversation === conversation ? null : conversation)"
          />
        </div>
      </div>
      <button @click="openNewConvModal" class="createConversation">
        <Icon name="typcn:plus" size="24px" class="textColorWhite" />
      </button>
    </div>
    <div v-if="activeConversation" class="rightPart">
      <ActiveConversation :conversation="activeConversation" />
    </div>
  </div>

  <div v-if="showNewConvModal" class="modal-overlay">
    <div class="modal-content bgColorLight">
      <div class="modal-header">
        <h3>Create New Conversation</h3>
        <button class="close-btn" @click="closeNewConvModal">
          <Icon name="mdi:close" size="1.5em" />
        </button>
      </div>
      <div class="modal-body">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-input" 
            placeholder="Search for users..."
            @input="searchUsers" 
          />
        </div>
        <div class="search-results" v-if="searchResults.length > 0">
          <div 
            v-for="user in searchResults" 
            :key="user.id" 
            class="user-item"
            @click="selectUser(user)"
          >
            <div class="user-avatar">
              <Icon name="mdi:account" size="1.5em" />
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.firstName }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
        </div>
        <div class="no-results" v-else-if="searchQuery && !isSearching">
          No users found
        </div>
        <div class="selected-users" v-if="selectedUsers.length > 0">
          <h4>Selected Users</h4>
          <div class="user-chips">
            <div v-for="user in selectedUsers" :key="user.id" class="user-chip">
              <span>{{ user.email }}</span>
              <button @click="removeUser(user)" class="remove-user">
                <Icon name="mdi:close" size="0.8em" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeNewConvModal" class="cancel-btn">Cancel</button>
        <button 
          @click="createConversation" 
          class="create-btn"
          :disabled="selectedUsers.length === 0"
        >
          Create Conversation
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, nextTick } from 'vue';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import useAuthFetch from '~/composables/useAuthFetch';
import type { Conversation } from '~/types/Conversation';
import LittleConversation from '~/components/dashboard/messageModule/littleConversation.vue';
import ActiveConversation from '~/components/dashboard/messageModule/activeConversation.vue';
import type { User } from '~/types/User';
import { useUserStore } from '~/stores/userStore';

gsap.registerPlugin(Draggable);
const { $toast } = useNuxtApp();
const closed = ref(true);
const expandedContainer = ref(null);
const closedButton = ref(null);
let draggableInstance: Draggable[] | null = null;
const conversations = ref<Conversation[] | null>(null);
const userStore = useUserStore();

// New conversation modal state
const showNewConvModal = ref(false);
const searchQuery = ref('');
const searchResults = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const isSearching = ref(false);

const applyDraggable = () => {
  if (draggableInstance) {
    for (const instance of draggableInstance) {
      instance.kill();
    }
    draggableInstance = null;
  }

  draggableInstance = Draggable.create('#messageMenuClosed', {
    type: 'rotation',
    inertia: true,
    throwResistance: 1000,
    snap: value => Math.round(value / 15) * 15,
    zIndexBoost: false,
  });
};

const activeConversation = ref<Conversation | null>(null);

const openClose = async () => {
  const duration = 0.5;
  if (closed.value) {
    gsap.to(expandedContainer.value, {
      duration,
      width: '70vw',
      height: '80vh',
      ease: 'power2.inOut',
    });
    gsap.to(closedButton.value, {
      duration,
      opacity: 0,
      ease: 'power2.inOut',
    });
    await nextTick();
    closed.value = false;
  } else {
    gsap.to(expandedContainer.value, {
      duration,
      width: '100px',
      height: '100px',
      ease: 'power2.inOut',
    });
    gsap.to(closedButton.value, {
      duration,
      opacity: 1,
      ease: 'power2.inOut',
    });
    await nextTick();
    closed.value = true;
  }
};

// New Conversation Modal Functions
const openNewConvModal = () => {
  showNewConvModal.value = true;
  searchQuery.value = '';
  searchResults.value = [];
  selectedUsers.value = [];
};

const closeNewConvModal = () => {
  showNewConvModal.value = false;
};

const searchUsers = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  try {
    const response = await useAuthFetch('conversation/user/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: searchQuery.value
        }),
      },
    );    
    
    if (response.data.value) {
      searchResults.value = response.data.value as User[];
    }
    
    const currentUser = userStore.email;
  
    searchResults.value = searchResults.value.filter(user => user.email !== currentUser);
    
  } catch (error: unknown) {
    const err = error as Error;
    $toast.error(err.message || 'Error searching for users');
  } finally {
    isSearching.value = false;
  }
};


const selectUser = (user: User) => {
  if (!selectedUsers.value.some(selected => selected.id === user.id)) {
    selectedUsers.value.push(user);
  }
  searchQuery.value = '';
  searchResults.value = [];
};

const removeUser = (user: User) => {
  selectedUsers.value = selectedUsers.value.filter(selected => selected.id !== user.id);
};

const createConversation = async () => {
  if (selectedUsers.value.length === 0) {
    return;
  }

  try {
    const userIds = selectedUsers.value.map(user => user.id);
    const response = await useAuthFetch('conversation/new', {
      method: 'POST',
      body: { userIds }
    });

    if (response.data.value) {
      $toast.success('Conversation created successfully');
      await getConversations();
      const newConversation = response.data.value as Conversation;
      activeConversation.value = newConversation;
      closeNewConvModal();
    }
  } catch (error: unknown) {
    const err = error as Error;
    $toast.error(err.message || 'Error creating conversation');
  }
};

const getConversations = async () => {
  try {
    const response = await useAuthFetch('conversations');

    conversations.value = response.data.value as Conversation[];

  } catch (error: unknown) {
    const err = error as Error;
    $toast.error(err.message || 'Error fetching conversations');
  }
};

watch(closed, value => {
  return value ? applyDraggable() : () => {};
});

onMounted(async () => {
  await nextTick(async () => {
    await getConversations();
  });
  applyDraggable();
  userStore.loadUserFromCookies();
});

onUpdated(() => {
  if (closed.value) {
    applyDraggable();
  }
});
</script>

<style scoped>
.bgColorLight {
  background-color: var(--color-white);
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.topComponentSize {
  width: 100px;
  height: 100px;
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.expanded-container {
  z-index: 55;
  width: 70vw;
  height: 80vh;
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
  position: fixed;
  display: flex;
}

.marged-left {
  position: fixed;
  left: 30px;
  top: 31px;
  transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.messageIcon {
  color: var(--color-black);
}

.leftPart {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 20%;
  min-width: 224px;
}

.conversationSlider {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding: 0 10px;
}

.conversationSlider::-webkit-scrollbar {
  width: 6px;
}
.conversationSlider::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.createConversation {
  position: sticky;
  bottom: 10px;
  margin: 10px auto;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 5px;
  background-color: var(--color-black);
}

.littleConversation {
  width: 100%;
}

.bg-dark {
  background-color: var(--color-black);
  color: white;
  border-radius: 5px;
}

.rightPart {
  flex: 1;
  height: 98%;
  background-color: var(--color-black);
  color: white;
  border-radius: 5px;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: between;
}

/* New Conversation Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.modal-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  max-height: 50vh;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
}

.search-container {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 15px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background-color: #f9f9f9;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
}

.user-email {
  font-size: 0.8rem;
  color: #777;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #777;
}

.selected-users {
  margin-top: 20px;
}

.selected-users h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.user-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-chip {
  display: flex;
  align-items: center;
  background-color: var(--color-primary);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.remove-user {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn {
  padding: 8px 15px;
  border: none;
  background-color: var(--color-black);
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
