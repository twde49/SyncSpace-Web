import { ref } from "vue";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Notification } from "~/types/Notification";
import type { Message } from "~/types/Message";
import { useRuntimeConfig } from "#app";

const webSocketData = ref<Record<string, any>>({});
let socket: Socket | null = null;

export function useWebSocket() {
	const connect = () => {
		if (socket) {
			return;
		}
		const config = useRuntimeConfig();
		socket = io(config.public.webSocketUrl);

		socket.on("message", (message: any) => {
			if (message.type && message.data) {
				webSocketData.value[message.type] = message.data;
			}
		});

		socket.on("checkUser", (socketId: string) => {
			webSocketData.value.type = "checkUser";
			webSocketData.value.socketId = socketId;
		});

		socket.on("updatedMessages", (newMessages: Message[]) => {
			webSocketData.value.type = "updatedMessages";
			webSocketData.value.updatedMessages = newMessages;
		});

		socket.on("disconnect", () => {
			socket = null;
		});

		socket.on("connect_error", () => {
			socket = null;
		});

		socket.on("refreshConversations", () => {
			webSocketData.value.type = "refreshConversations";
		});

		socket.on("refreshCalendar", () => {
			webSocketData.value.type = "refreshCalendar";
		});

		socket.on(
			"getNotification",
			(notification: Notification, userEmail: string) => {
				webSocketData.value.type = "notification";
				webSocketData.value.notification = notification;
				webSocketData.value.userEmail = userEmail;
			},
		);
	};

	const send = (data: any) => {
		if (!socket || !socket.connected) {
			return;
		}

		socket.emit("message", data);
	};

	const isOnline = (userEmail: string, jwtToken: string) => {
		socket?.emit("userOnline", userEmail, jwtToken);
	};

	const isOffline = (userEmail: string, jwtToken: string) => {
		socket?.emit("userOffline", userEmail, jwtToken);
	};

	return {
		connect,
		send,
		webSocketData,
		isOnline,
		isOffline,
	};
}
