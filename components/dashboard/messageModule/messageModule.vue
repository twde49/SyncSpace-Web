<template>
  <div
    id="messageMenuClosed"
    class="h-max w-max bgColorLight topComponentSize flex justify-center items-center fixed left-[30px] top-[31px] transition-all"
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
    class="expanded-container z-20 bgColorLight flex justify-start items-start fixed left-[30px] top-[31px] w-[70vw] h-[80vh] transition-all"
    ref="expandedContainer"
  >
    <div class="relative h-full flex flex-col w-1/5 min-w-[224px]">
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
      <span class="text-lg font-bold w-full flex justify-center items-center">
        Chats
      </span>
      <div class="flex flex-col items-center flex-1 overflow-y-auto w-full px-[10px] mt-3">
        <div
          class="w-full"
          v-for="conversation in conversations"
          :key="conversation.id"
        >
          <little-conversation
            @contextmenu.prevent="showConversationMenu(conversation)"
            class="mt-8 w-full"
            :conversation="conversation"
            :is-active="activeConversation === conversation"
            @click="
              activeConversation =
                activeConversation === conversation ? null : conversation
            "
          />

          <div class="relative flex">
            <div
              v-if="activeMenu === String(conversation.id)"
              class="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50"
              style="top: 0; right: 30px"
            >
              <div class="py-1">
                <button
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  @click="openDeleteModal(conversation)"
                >
                  <Icon name="heroicons:trash" class="mr-2" size="16" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="openNewConvModal" class="sticky bottom-[10px] mx-auto my-[10px] w-[90%] flex justify-center items-center h-[40px] rounded bg-[var(--color-black)]">
        <Icon name="typcn:plus" size="24px" class="textColorWhite" />
      </button>
    </div>
    <div v-if="activeConversation" class="flex-1 h-[98%] bg-[var(--color-black)] text-white rounded m-2 flex flex-col">
      <ActiveConversation :conversation="activeConversation" @message-sent="getConversations" @update-message="getConversations" />
    </div>
  </div>

  <div v-if="showNewConvModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div class="w-[90%] max-w-[500px] rounded-lg overflow-hidden flex flex-col max-h-[80vh] bgColorLight">
      <div class="p-4 flex justify-between items-center border-b border-gray-200">
        <h3 class="m-0 text-xl">Créer une conversation</h3>
        <button class="bg-transparent border-0 cursor-pointer text-gray-500" @click="closeNewConvModal">
          <Icon name="mdi:close" size="1.5em" />
        </button>
      </div>
      <div class="relative my-4 px-5">
        <input 
          type="text" 
          id="convName" 
          v-model="conversationName" 
          class="w-full pb-2 pt-7 px-0 bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none transition-all peer" 
          placeholder=" "
        />
        <label 
          for="convName" 
          class="absolute left-5 top-4 text-gray-500 text-sm transition-all duration-300 peer-focus:text-xs peer-focus:top-0 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-0"
        >
          Nom de la conversation
        </label>
      </div>
      <div class="p-5 flex-1 overflow-y-auto max-h-[50vh]">
        <div class="mb-4">
          <input
            type="text"
            v-model="searchQuery"
            class="w-full p-3 border border-gray-300 rounded-md text-base"
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
      <div class="p-4 flex justify-end gap-2.5 border-t border-gray-200">
        <button @click="closeNewConvModal" class="px-4 py-2 border border-gray-300 bg-white rounded cursor-pointer">Annuler</button>
        <button
          @click="createConversation"
          class="px-4 py-2 border-0 bg-[var(--color-black)] text-white rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="selectedUsers.length === 0"
        >
          Créer une conversation
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showDeleteModal"
    class="fixed inset-0 flex items-center justify-center z-30"
  >
    <div class="absolute inset-0 bg-black opacity-30 z-40"></div>
    <div
      class="bg-white w-96 rounded-lg shadow-lg z-50 relative overflow-hidden"
    >
      <div class="bg-red-100 px-6 py-4 flex items-center">
        <Icon
          name="heroicons:exclamation-triangle"
          class="text-red-600 mr-2"
          size="24"
        />
        <h3 class="text-lg font-semibold text-red-600">
          Confirmation de suppression
        </h3>
      </div>
      <div class="px-6 py-4">
        <p class="text-gray-700">
          Êtes-vous sûr de vouloir supprimer cette conversation ?
        </p>
        <p class="text-gray-700 mt-2">Cette action est irréversible.</p>
      </div>
      <div class="bg-gray-100 px-6 py-3 flex justify-end">
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2 cursor-pointer"
          @click="cancelDelete"
        >
          Annuler
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
          @click="removeConversation"
        >
          Supprimer
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
import { useWebSocket } from '#imports';

const { webSocketData } = useWebSocket();
gsap.registerPlugin(Draggable);
const { $toast } = useNuxtApp();
const closed = ref(true);
const expandedContainer = ref(null);
const closedButton = ref(null);
let draggableInstance: Draggable[] | null = null;
const conversations = ref<Conversation[] | null>(null);
const userStore = useUserStore();

const showNewConvModal = ref(false);
const searchQuery = ref('');
const searchResults = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const conversationName = ref('');
const isSearching = ref(false);
const activeMenu = ref<string | null>(null);
const menuPositions = ref<{ [key: string]: number }>({});
const conversationToDelete = ref<Conversation | null>(null);
const showDeleteModal = ref(false);

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

const selectUser = (user: User) => {
  if (!selectedUsers.value.some(selected => selected.id === user.id)) {
    selectedUsers.value.push(user);
  }
  searchQuery.value = '';
  searchResults.value = [];
};

const removeUser = (user: User) => {
  selectedUsers.value = selectedUsers.value.filter(
    selected => selected.id !== user.id,
  );
};

const createConversation = async () => {
  if (selectedUsers.value.length === 0) {
    return;
  }

  try {
    const userIds = selectedUsers.value.map(user => user.id);
    const response = await useAuthFetch('conversation/new', {
      method: 'POST',
      body: { 
        userIds,
        name: conversationName.value
      },
    });

    if (response.data.value && typeof response.data.value === 'object' && 'content' in response.data.value) {
      await getConversations();
      const newConversation = (response.data.value as { content: Conversation }).content;
      activeConversation.value = newConversation;
      conversationName.value = '';
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

const removeConversation = async () => {
  try {
    if (conversationToDelete.value) {
      await useAuthFetch(
        `conversation/remove/${conversationToDelete.value.id}`,
        {
          method: 'DELETE',
        },
      );
      $toast.success('Conversation deleted successfully');
      await getConversations();
      showDeleteModal.value = false;
      conversationToDelete.value = null;
    }
  } catch (error: unknown) {
    const err = error as Error;
    $toast.error(err.message || 'Error deleting conversation');
  }
};

const showConversationMenu = (conversation: Conversation) => {
  toggleMenu(String(conversation.id));
};

const toggleMenu = (conversationId: string) => {
  if (activeMenu.value === conversationId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = conversationId;
    nextTick(() => {
      const element = document.querySelector(
        `[data-conversation-id="${conversationId}"]`,
      );
      if (element) {
        const rect = element.getBoundingClientRect();
        menuPositions.value[conversationId] = rect.right;
      }
    });
  }
};

const openDeleteModal = (conversation: Conversation) => {
  conversationToDelete.value = conversation;
  showDeleteModal.value = true;
  activeMenu.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  conversationToDelete.value = null;
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

watch(webSocketData.value,async (newData) => {
  if (newData.type === 'refreshConversations') {
    await getConversations();
  }
});

onUpdated(() => {
  if (closed.value) {
    applyDraggable();
  }
});

onMounted(() => {
  document.addEventListener('click', (event) => {
    if (activeMenu.value && !(event.target as Element)?.closest?.('.message-container')) {
      activeMenu.value = null;
    }
  });
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
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.expanded-container {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.messageIcon {
  color: var(--color-black);
}

.conversationSlider::-webkit-scrollbar {
  width: 6px;
}
.conversationSlider::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
</style>
