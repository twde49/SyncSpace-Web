<template>
    <!-- Header -->
    <div class="header flex items-center justify-between border-b p-4 pb-2 mb-4">
        <h2 class="text-white miniFont font-bold">{{ getParticipantsName() }}</h2>
        <span class="text-green-500 text-sm">Online</span>
    </div>

    <div class="chatArea p-4 flex-grow overflow-y-auto">
        <div
            v-for="message in conversation.messages"
            :key="message.id"
            :class="['message', isOwnMessage(message) ? 'outgoing' : 'incoming']"
        >
            {{ message.content }}
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
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Conversation } from '~/types/Conversation';
import type { Message } from '~/types/Message';
import { useUserStore } from '~/stores/userStore';
import useAuthFetch from '~/composables/useAuthFetch';

const userStore = useUserStore();

// eslint-disable-next-line no-undef
const { $toast } = useNuxtApp();
const currentMessage = ref<string | null>(null);
const currentAttachment = ref<string>('');

const { conversation } = defineProps<{
    conversation: Conversation;
}>();

const isOwnMessage = (message: Message) => {
    return message.sender?.email === userStore.email;
};

const getParticipantsName = () => {
    return conversation.users
        ?.map(user => (user.firstName ?? '') + (user.lastName ?? ''))
        .join(', ');
};

const sendMessage = async () => {
    try {
        await useAuthFetch(
            `conversation/${conversation.id}/message/new`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        content: currentMessage.value,
                        attachment: currentAttachment.value,
                    },
                ),
            },
        );
    } catch (error) {
        if (error instanceof Error) {
            $toast.error(error.message);
        } else {
            $toast.error('An unknown error occurred');
        }
    } finally {
        currentMessage.value = null;
        currentAttachment.value = '';
        await reloadCurrentConversation();
    }
};

const reloadCurrentConversation = async () => {
    try {
        const { data } = await useAuthFetch(`conversation/${conversation.id}`);

        console.log(data);
        //conversation = data?.value as Conversation;

    } catch (error) {
        if (error instanceof Error) {
            $toast.error(error.message);
        } else {
            $toast.error('An unknown error occurred');
        }
    }
};
onMounted(() => {
    userStore.loadUserFromCookies();
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
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
}

.message {
    padding: 10px;
    border-radius: 8px;
    word-wrap: break-word;
}

.message.incoming {
    background-color: var(--color-white);
    align-self: flex-start;
    color: var(--color-black);
}

.message.outgoing {
    background-color: var(--color-primary);
    align-self: flex-end;
    color: var(--color-white);
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
</style>
