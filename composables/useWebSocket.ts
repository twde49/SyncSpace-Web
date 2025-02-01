import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';

const webSocketData = ref<Record<string, any>>({});
let socket: Socket | null = null;

export function useWebSocket() {
    const connect = () => {
        if (socket) {
            return;
        }

        socket = io('http://localhost:6969');

        socket.on('message', (message: any) => {
            if (message.type && message.data) {
                webSocketData.value[message.type] = message.data;
            }
        });

        socket.on('updatedMessages', (newMessages: any) => {
            webSocketData.value['updatedMessages'] = newMessages;
        });

        socket.on('disconnect', () => {
            socket = null;
        });

        socket.on('connect_error', () => {
            socket = null;
        });
    };

    const send = (data: any) => {
        if (!socket || !socket.connected) {
            return;
        }

        socket.emit('message', data);
    };

    return {
        connect,
        send,
        webSocketData,
    };
}