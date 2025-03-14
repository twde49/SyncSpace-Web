<template>
  <div
    :class="
      isActive
        ? 'bgColorPrimary w-full conversation cursor-default'
        : 'bgColorBlack w-full conversation cursor-pointer'
    "
  >
    <div class="conversation-header">
      <div
        class="w-max bgColorLight topComponentSize flex justify-center items-center"
      >
        <span class="profile-name">{{ getLastActiveUserInitial() }}</span>
      </div>
      <span :class="['activityPill', isAllUserConnected(conversation) ? 'bgColorCategoryTritary' : 'bgColorCategoryQuaternary']" />
    </div>
    <span class="miniFont textColorWhite flex justify-center items-center ml-4">
      {{ getConversationName() }}
    </span>
    <span class="lastActivity">
      {{ getLastActivity() }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from "~/types/Conversation";
import { defineProps } from "vue";
import { useUserStore } from "~/stores/userStore";
import { onMounted } from "vue";
const { $timeDifference } = useNuxtApp();
const userStore = useUserStore();

const { conversation } = defineProps<{
	conversation: Conversation;
	isActive: boolean;
}>();
const lastActiveUser = conversation.lastActiveUser;

const getLastActiveUserInitial = () => {
	if (lastActiveUser?.firstName && lastActiveUser?.lastName) {
		return `${lastActiveUser.firstName[0].toUpperCase()}.${lastActiveUser.lastName[0].toUpperCase()}`;
	}
	return `${userStore.firstName[0].toUpperCase()}.${userStore.lastName[0].toUpperCase()}`;
};

const getLastActivity = () => {
	if (conversation.lastActivity !== undefined) {
		return $timeDifference(conversation.lastActivity);
	}
};

const getConversationName = () => {
	if (conversation.name !== '') {
		return conversation.name;
	}
	if (lastActiveUser !== null && lastActiveUser !== undefined && lastActiveUser.email !== userStore.email) {
		return `${lastActiveUser.firstName} ${lastActiveUser.lastName}`;
	}
	const otherUser = conversation.users?.find(user => user.email !== userStore.email);

	return otherUser?.firstName && otherUser?.lastName
		? `${otherUser.firstName} ${otherUser.lastName}`
		: '';
};

const isAllUserConnected = (conversation: Conversation) => {
	const users = conversation.users;
	if (!users) return false;
  
	const onlineUsers = users.filter((user) => user.isOnline);
	if (onlineUsers.length === 0) return false;
	if (onlineUsers.length < users.length) return false;
	return true;
};

onMounted(() => {
	userStore.loadUserFromCookies();
});
</script>

<style scoped>
.conversation {
  position: relative;
  height: 5vh;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}

.bgColorLight {
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.topComponentSize {
  width: 25px;
  height: 25px;
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

.conversation-header {
  position: relative;
  margin-left: 5%;
  height: 5vh;
  display: flex;
  justify-content: left;
  align-items: center;
}

.activityPill {
  position: absolute;
  bottom: 5px;
  left: 20px;
  height: 1vh;
  width: 1vh;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lastActivity {
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font: var(--text-style-mini-italic);
  color: var(--color-white);
}
</style>
