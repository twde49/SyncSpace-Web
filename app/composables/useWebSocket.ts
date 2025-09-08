import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import type { Message } from '~/types/Message'
import type { Notification } from '~/types/Notification'

/**
 * Composable for managing WebSocket connections and events.
 * Handles messaging, notifications, and user presence.
 * @returns Object with connect, send, and state management functions.
 */
const webSocketData = ref<Record<string, unknown>>({})
let socket: Socket | null = null

export function useWebSocket() {
  /**
   * Establishes a WebSocket connection if not already connected.
   * Sets up listeners for various socket events and updates webSocketData accordingly.
   */
  const connect = () => {
    if (socket) {
      return
    }
    const config = useRuntimeConfig()
    socket = io(config.public.webSocketUrl)

    socket.on('message', (message: { type: string; data: unknown }) => {
      if (message.type && message.data) {
        webSocketData.value[message.type] = message.data
      }
    })

    socket.on('checkUser', (socketId: string) => {
      webSocketData.value.type = 'checkUser'
      webSocketData.value.socketId = socketId
    })

    socket.on('updatedMessages', (newMessages: Message[], conversationId: string) => {
      webSocketData.value.type = 'updatedMessages'
      webSocketData.value.updatedMessages = newMessages
      webSocketData.value.conversationId = conversationId
    })

    socket.on('newMessage', (newMessage: Message, conversationId: string) => {
      webSocketData.value.type = 'newMessage'
      webSocketData.value.newMessage = newMessage
      webSocketData.value.conversationId = conversationId
    })

    socket.on('disconnect', () => {
      socket = null
    })

    socket.on('connect_error', () => {
      socket = null
    })

    socket.on('refreshConversations', () => {
      webSocketData.value.type = 'refreshConversations'
    })

    socket.on('refreshCalendar', () => {
      webSocketData.value.type = 'refreshCalendar'
    })

    socket.on('getNotification', (notification: Notification, userEmail: string) => {
      webSocketData.value.type = 'notification'
      webSocketData.value.notification = notification
      webSocketData.value.userEmail = userEmail
    })
  }

  /**
   * Sends data over the WebSocket connection.
   * @param data - The data to send.
   */
  const send = (data: unknown) => {
    if (!socket || !socket.connected) {
      return
    }

    socket.emit('message', data)
  }

  /**
   * Marks a user as online via WebSocket.
   * @param userEmail - The user's email.
   * @param jwtToken - The user's JWT token.
   */
  const isOnline = (userEmail: string, jwtToken: string) => {
    socket?.emit('userOnline', userEmail, jwtToken)
  }

  /**
   * Marks a user as offline via WebSocket.
   * @param userEmail - The user's email.
   * @param jwtToken - The user's JWT token.
   */
  const isOffline = (userEmail: string, jwtToken: string) => {
    socket?.emit('userOffline', userEmail, jwtToken)
  }

  return {
    connect,
    send,
    webSocketData,
    isOnline,
    isOffline,
  }
}
