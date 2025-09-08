/**
 * Represents a music track with YouTube ID, title, artist, and optional cover URL.
 */
export type Track = {
  youtubeId: string
  title: string
  artist: string
  coverUrl?: string
}
