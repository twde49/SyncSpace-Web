import type { User } from './User'

/**
 * Represents a calendar event with participants and details.
 */
export type Event = {
  '@id': number
  '@type': 'Event'
  id: number
  title?: string
  description?: string
  startDate?: Date
  endDate?: Date
  isAllDay?: boolean
  location?: string
  organizer?: User
  participants?: User[]
  status?: string
  color?: string
}
