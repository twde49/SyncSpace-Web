import type { User } from './User'

/**
 * Represents a note with content, author, and timestamps.
 */
export type Note = {
  '@id': number
  '@type': 'Note'
  id: number
  title?: string
  content?: string
  author?: User
  createdAt?: string
  updatedAt?: string
}
