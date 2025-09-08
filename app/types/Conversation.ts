import type { Message } from './Message'
import type { User } from './User'

/**
 * Represents a conversation between users, including messages and metadata.
 */
export type Conversation = {
  '@id': number
  '@type': 'Conversation'
  id: number
  name?: string
  type?: string
  users?: User[]
  created_by?: User
  created_at?: Date
  lastActivity?: string
  avatar_url?: string
  messages?: Message[]
  lastActiveUser?: User
  lastMessage: Message
}
