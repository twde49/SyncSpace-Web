import type { User } from './User'

/**
 * Represents a notification sent to a user, including content, status, and related user.
 */
export type Notification = {
  '@id': number
  '@type': 'Notification'
  id: number
  title?: string
  content?: string
  createdAt?: string
  isRead?: boolean
  relatedTo: User
}
