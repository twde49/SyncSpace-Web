<template>
  <div
    class="header flex items-center justify-between border-b p-4 pb-2 mb-4 z-20"
  >
    <h2 class="text-white miniFont font-bold">{{ getConversationName() }}</h2>
    <span
      :class="
        checkIfUsersAreOnline() === 'Online'
          ? 'text-green-500 text-sm'
          : 'text-red-500 text-sm'
      "
    >
      {{ checkIfUsersAreOnline() }}
    </span>
  </div>

  <div
    ref="chatContainer"
    class="chatArea p-4 flex-grow overflow-y-auto flex flex-col-reverse"
  >
    <div
      @contextmenu.prevent="isOwnMessage(message) && showContextMenu(message)"
      v-for="message in messages"
      :key="message.id"
      :class="[
        'message-container',
        isOwnMessage(message) ? 'flex-row-reverse outgoing' : 'incoming',
      ]"
      :data-message-id="message.id"
    >
      <div
        class="profile-name"
        :style="{
          backgroundColor:
            message.sender?.email === userStore.email
              ? 'var(--color-primary)'
              : 'var(--color-white)',
          color:
            message.sender?.email === userStore.email
              ? 'var(--color-white)'
              : 'var(--color-black)',
        }"
      >
        {{ message.sender?.firstName?.charAt(0) || '' }}.{{
          message.sender?.lastName?.charAt(0) || ''
        }}
      </div>
      <div class="message-bubble">{{ message.content }}</div>

      <div class="relative flex">
        <div
          v-if="activeMenu === String(message.id) && isOwnMessage(message)"
          class="absolute right-0 w-48 bg-white rounded-md shadow-lg z-50"
          :style="{
            top: '0',
            right: '30px',
          }"
        >
          <div class="py-1">
            <button
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              @click="deleteMessage(message)"
            >
              <Icon name="heroicons:trash" class="mr-2" size="16" />
              Supprimer
            </button>

            <button
              class="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              @click="showEditMessageModal(message)"
            >
              <Icon name="heroicons:pencil-square" class="mr-2" size="16" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showEditModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-11/12 max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Modifier le message</h3>
        <button
          @click="closeEditModal"
          class="text-gray-500 hover:text-gray-700"
        >
          <Icon name="heroicons:x-mark" size="24" />
        </button>
      </div>
      <div class="mb-4">
        <textarea
          v-model="editedMessageContent"
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          rows="4"
        ></textarea>
      </div>
      <div class="flex justify-end gap-2">
        <button
          @click="closeEditModal"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          @keyup.enter="submitEditMessage"
          @click="submitEditMessage"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  </div>

  <div class="messageInput bgColorWhite flex items-center">
    <div class="flex utilsZone items-center justify-between">
      <Icon name="ph:plus-fill" size="21px" class="media textColorBlack" />
      <Icon name="mdi:microphone" size="21px" class="media textColorBlack" />
    </div>
    <input
      class="textMessageInput bgColorBlack textColorWhite"
      v-model="currentMessage"
      placeholder="Message..."
      @keyup.enter="sendMessage"
      style="outline: none"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch, computed, nextTick } from "vue";
import type { Conversation } from "~/types/Conversation";
import type { Message } from "~/types/Message";
import { useUserStore } from "~/stores/userStore";
import useAuthFetch from "~/composables/useAuthFetch";
import { useWebSocket } from "~/composables/useWebSocket";

const userStore = useUserStore();
const { $toast } = useNuxtApp();
const chatContainer = ref<HTMLElement | null>(null);

const currentMessage = ref<string | null>(null);
const currentAttachment = ref<string>("");
const activeMenu = ref<string | null>(null);
const menuPositions = ref<{ [key: string]: number }>({});

const showEditModal = ref(false);
const editedMessageContent = ref("");
const currentEditingMessage = ref<Message | null>(null);

const props = defineProps<{ conversation: Conversation }>();

const reactiveConversation = reactive({ ...props.conversation });

const messages = computed(() => {
	return [...(reactiveConversation.messages || [])].reverse();
});

const emits = defineEmits<{
	"message-sent": [];
	"update-message": [];
	"refresh-conversations": [];
}>();

watch(
	() => props.conversation,
	(newConversation) => {
		Object.assign(reactiveConversation, newConversation);
	},
	{ deep: true, immediate: true },
);

const { connect, webSocketData } = useWebSocket();

const isOwnMessage = (message: Message) => {
	return message.sender?.email === userStore.email;
};

const getConversationName = () => {
	if (reactiveConversation.name) {
		return reactiveConversation.name;
	}

	if (reactiveConversation.users?.length === 2) {
		return reactiveConversation.users
			?.filter((user) => user.email !== userStore.email)
			.map((user) => `${user.firstName ?? ""} ${user.lastName ?? ""}`)
			.join(" ");
	}
	return reactiveConversation.users
		?.map((user) => `${user.firstName ?? ""} ${user.lastName ?? ""}`)
		.join(", ");
};

const showContextMenu = (message: Message) => {
	if (isOwnMessage(message)) {
		toggleMenu(String(message.id));
	}
};

const toggleMenu = (messageId: string) => {
	if (activeMenu.value === messageId) {
		activeMenu.value = null;
	} else {
		activeMenu.value = messageId;
		nextTick(() => {
			const element = document.querySelector(
				`[data-message-id="${messageId}"]`,
			);
			if (element) {
				const rect = element.getBoundingClientRect();
				menuPositions.value[messageId] = rect.right;
			}
		});
	}
};

const checkIfUsersAreOnline = () => {
	const users = reactiveConversation.users;
	if (!users) return "Offline";

	const onlineUsers = users.filter((user) => user.isOnline);
	if (onlineUsers.length === 0) return "Offline";
	if (onlineUsers.length < users.length) return "Offline";
	return "Online";
};

onMounted(() => {
	document.addEventListener("click", (event) => {
		if (
			activeMenu.value &&
			!(event.target as Element)?.closest?.(".message-container")
		) {
			activeMenu.value = null;
		}
	});
});

const showEditMessageModal = (message: Message) => {
	currentEditingMessage.value = message;
	editedMessageContent.value = message.content ?? "";
	showEditModal.value = true;
	activeMenu.value = null;
};

const closeEditModal = () => {
	showEditModal.value = false;
	currentEditingMessage.value = null;
	editedMessageContent.value = "";
};

const submitEditMessage = async () => {
	if (!currentEditingMessage.value || !editedMessageContent.value.trim()) {
		return;
	}

	await editMessage(currentEditingMessage.value, editedMessageContent.value);
	closeEditModal();
};

const deleteMessage = async (message: Message) => {
	try {
		await useAuthFetch(`conversation/message/remove/${message.id}`, {
			method: "DELETE",
		});

		if (reactiveConversation.messages) {
			const index = reactiveConversation.messages.findIndex(
				(m) => m.id === message.id,
			);
			if (index !== -1) {
				reactiveConversation.messages.splice(index, 1);
			}
		}

		$toast.success("Message deleted successfully");
		activeMenu.value = null;
		emits("update-message");
	} catch (error) {
		if (error instanceof Error) {
			$toast.error(error.message);
		} else {
			$toast.error("Failed to delete message");
		}
	}
};

const editMessage = async (message: Message, newMessageContent: string) => {
	try {
		await useAuthFetch(`conversation/message/edit/${message.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: newMessageContent,
			}),
		});

		if (reactiveConversation.messages) {
			const index = reactiveConversation.messages.findIndex(
				(m) => m.id === message.id,
			);
			if (index !== -1) {
				reactiveConversation.messages[index].content = newMessageContent;
			}
		}

		$toast.success("Message updated successfully");
		activeMenu.value = null;
		emits("update-message");
	} catch (error) {
		if (error instanceof Error) {
			$toast.error(error.message);
		} else {
			$toast.error("Failed to update message");
		}
	}
};

const sendMessage = async () => {
	try {
		await useAuthFetch(`conversation/${reactiveConversation.id}/message/new`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: currentMessage.value,
				attachment: currentAttachment.value,
			}),
		});

		emits("message-sent");
	} catch (error) {
		if (error instanceof Error) {
			$toast.error(error.message);
		} else {
			$toast.error("An unknown error occurred");
		}
	} finally {
		currentMessage.value = null;
		currentAttachment.value = "";
	}
};

watch(webSocketData.value, (newData) => {
	if (newData.type === "refreshConversations") {
		emits("refresh-conversations");
	}
});

watch(
	() => webSocketData.value.updatedMessages,
	(receivedData) => {
		let newMessages: Message[] = [];

		if (typeof receivedData === "string") {
			try {
				newMessages = JSON.parse(receivedData) as Message[];
			} catch (error) {
				console.error(error);
				return;
			}
		} else if (Array.isArray(receivedData)) {
			newMessages = receivedData;
		} else {
			return;
		}

		if (!reactiveConversation.messages) return;

		const existingMessageIds = new Set(
			reactiveConversation.messages.map((msg) => msg.id),
		);
		const uniqueMessages = newMessages.filter(
			(msg) => !existingMessageIds.has(msg.id),
		);

		if (uniqueMessages.length > 0) {
			reactiveConversation.messages.push(...uniqueMessages);
		}
	},
);

onMounted(() => {
	userStore.loadUserFromCookies();
	connect();
});
</script>

<style scoped>
.textMessageInput {
  width: 85%;
  border-radius: 5px;
  height: 4vh;
}

.textMessageInput {
  color: var(--color-white);
  padding-left: 2%;
}

.utilsZone {
  width: 13%;
}

.chatArea {
  display: flex;
  flex-direction: column-reverse;
  gap: 15px;
  padding: 15px 5px;
}

.message-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
}

.message-bubble {
  padding: 12px 15px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 1.5rem;
}

.incoming .message-bubble {
  background-color: var(--color-white);
  color: var(--color-black);
  border-top-left-radius: 4px;
}

.outgoing .message-bubble {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-top-right-radius: 4px;
}

.messageInput {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 99%;
  height: 5vh;
  border: 1px solid var(--color-black);
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 0.1rem;
  margin-left: 0.13rem;
}

.profile-name {
  font: var(--text-style-mini);
  color: var(--color-black);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  background-color: var(--color-white);
  transition: transform 0.3s ease;
}
</style>
