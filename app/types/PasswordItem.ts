import type { User } from './User'

/**
 * Represents a password entry, including encrypted password and metadata.
 */
export type PasswordItem = {
  '@id': number
  '@type': 'PasswordItem'
  id: number
  url?: string
  name?: string
  email?: string
  password?: string
  passwordEncrypted: string
  notesEncrypted?: string
  iv: string
  isFavorite?: boolean
  associatedTo?: User
  mustBeUpdated?: boolean
  updatedAt?: string
}
