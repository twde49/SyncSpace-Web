// plugins/mercure.ts
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
    const mercureClient = {
        subscribe: (topic: string, callback: (data: string) => void) => {
            const eventSource = new EventSource(`http://localhost:5001/.well-known/mercure?topic=${encodeURIComponent(topic)}`);

            eventSource.onmessage = (event) => {
                callback(event.data);
            };

            eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                eventSource.close();
            };

            return () => {
                eventSource.close();
            };
        },
        publish: async (topic: string, data: string) => {
            await fetch(`http://localhost:5001/.well-known/mercure`, {
                method: 'POST',
                body: JSON.stringify({
                    topic,
                    data,
                }),
            });
        },
    };

    return {
        provide: {
            mercureClient
        }
    }
});
