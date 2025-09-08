/**
 * Represents a user with basic profile information.
 */
export type User = {
  '@id': number
  '@type': 'User'
  id: number
  email?: string
  firstName?: string
  lastName?: string
  isOnline?: boolean
}
