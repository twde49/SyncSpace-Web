<template>
		<div
				v-if="!isNotificationDrawerOpen"
				@click="toggleNotificationDrawer"
				class="w-fit fixed top-4 left-1/2 transform -translate-x-1/2"
		>
				<Icon
						name="solar:bell-bold"
						size="2rem"
						class="textColorWhite hover:animate-bell cursor-pointer"
				/>
				<div
						v-if="notifications && notifications.length > 0"
						class="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full"
				></div>
		</div>

		<div v-show="isNotificationDrawerOpen">
				<div
						ref="notificationDrawer"
						class="fixed top-4 left-1/2 transform -translate-x-1/2 bgColorWhite border border-gray-200 rounded-lg shadow-lg p-6 min-w-[400px] max-h-[80vh] overflow-y-auto opacity-100 scale-100 z-50"
						@click.stop
				>
						<div class="flex justify-between items-center mb-3">
								<div class="flex flex-col">
										<div class="text-lg font-semibold">Notifications</div>
										<button
												v-if="notifications.length > 0"
												@click="readAllNotifications"
												class="text-xs text-gray-500 hover:text-gray-700 transition-colors mt-1 flex items-center"
										>
												<Icon name="mdi:check-all" class="mr-1" size="0.8rem" />
												Marquer toutes comme lues
										</button>
								</div>
								<div @click="toggleNotificationDrawer" class="cursor-pointer p-1">
										<Icon name="mdi:close" size="1.2rem" />
								</div>
						</div>
						<NotificationList
								:notifications="notifications"
								@read-notification="readNotification"
						/>
				</div>
				<div
						class="fixed inset-0 bg-black bg-opacity-25 z-40"
						@click="toggleNotificationDrawer"
				></div>
		</div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from "vue";
import gsap from "gsap";
import NotificationList from "./NotificationList.vue";
import type { Notification } from "@/types/Notification";
import { useAuthFetch } from "#imports";
import { useUserStore } from "@/stores/userStore";
import { useWebSocket } from "~/composables/useWebSocket";

const { $toast } = useNuxtApp();
const { connect, webSocketData } = useWebSocket();
const userStore = useUserStore();
const isNotificationDrawerOpen = ref(false);
const notificationDrawer = ref(null);
const notifications = ref<Notification[]>([]);

const toggleNotificationDrawer = () => {
	isNotificationDrawerOpen.value = !isNotificationDrawerOpen.value;

	if (isNotificationDrawerOpen.value) {
		gsap.to(notificationDrawer.value, {
			duration: 0.3,
			opacity: 1,
			scale: 1,
			ease: "back.out(1.7)",
		});
	} else {
		gsap.to(notificationDrawer.value, {
			duration: 0.2,
			opacity: 0,
			scale: 0.95,
			ease: "power2.in",
		});
	}
};

const handleEscapeKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isNotificationDrawerOpen.value) {
				toggleNotificationDrawer();
		}
};

onMounted(() => {
		document.addEventListener('keydown', handleEscapeKey);
});

onBeforeUnmount(() => {
		document.removeEventListener('keydown', handleEscapeKey);
});

const fetchNotifications = async () => {
	try {
		const res = await useAuthFetch("notifications/all");
		notifications.value = res.data.value as Notification[];
	} catch (error) {
		console.error("Error fetching notifications:", error);
	}
};

const readNotification = async (id: number) => {
	try {
		await useAuthFetch(`notifications/${id}/read`, {
			method: "PUT",
		});
		notifications.value = notifications.value.filter((n) => n.id !== id);
	} catch (error) {
		console.error("Error reading notification:", error);
	}
};

const readAllNotifications = async () => {
	try {
		await useAuthFetch("notifications/readAll", {
			method: "PUT",
		});
		notifications.value = [];
	} catch (error) {
		console.error("Error reading all notifications:", error);
	}
};

watch(webSocketData.value, async (newData) => {
	if (newData.type === "notification") {
		if (newData.userEmail === userStore.email) {
			$toast.info(newData.notification.title);
			await fetchNotifications();
		}
	}
});

onMounted(async () => {
	await nextTick(async () => {
		await fetchNotifications();
	});
	if (notificationDrawer.value) {
		gsap.set(notificationDrawer.value, {
			opacity: 0,
			scale: 0.95,
		});
	}
	userStore.loadUserFromCookies();
	connect();
});

</script>

<style scoped>
.hover\:animate-bell:hover {
		animation: bellRing 0.5s ease-in-out;
}

@keyframes bellRing {
		0%,
		100% {
				transform: rotate(0);
		}
		20% {
				transform: rotate(15deg);
		}
		40% {
				transform: rotate(-15deg);
		}
		60% {
				transform: rotate(7deg);
		}
		80% {
				transform: rotate(-7deg);
		}
}
</style>
