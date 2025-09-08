import type { Track } from './Track'
import type { User } from './User'

/**
 * Represents a playlist of music tracks associated with a user.
 * @property id - Unique identifier for the playlist.
 * @property name - Name of the playlist.
 * @property relatedTo - The user this playlist belongs to.
 * @property tracks - Array of tracks included in the playlist.
 */
export type Playlist = {
  id: string
  name: string
  relatedTo: User
  tracks: Track[]
}
