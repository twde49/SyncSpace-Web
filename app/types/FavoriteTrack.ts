import type { Track } from './Track'

/**
 * Represents a user's favorite music track.
 * Contains the track information and a unique identifier.
 */
export type FavoriteTrack = {
  id: string
  track: Track
}
