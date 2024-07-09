import { User } from "./user"

export enum TrackType {
  SAVED_TRACK = "SAVED_TRACK",
  TOP_LISTEN = "TOP_LISTEN",
  DISCOVER_WEEKLY = "DISCOVER_WEEKLY",
}
export interface UserTrack {
  id: string
  userId: string
  user: User
  spotifyId: string
  spotifyUri: string
  name: string
  artistName: string
  artistUri: string
  albumName: string
  albumImage: string
  durationMs: number
  trackType: TrackType
  createdAt: Date
}
