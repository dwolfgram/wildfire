import { Conversation } from "./conversation"
import { User } from "./user"

export enum TrackType {
  SAVED_TRACK = "SAVED_TRACK",
  TOP_LISTEN = "TOP_LISTEN",
  DISCOVER_WEEKLY = "DISCOVER_WEEKLY",
  SENT_TRACK = "SENT_TRACK",
  WILDFIRE_LIKE = "WILDFIRE_LIKE",
}

export type SongWithCombinedHistory = Partial<Song> & {
  combinedHistory: Partial<Song>[]
}

export interface Song {
  id: string
  userId?: string
  user?: User
  senderId?: string
  sender?: User
  receiverId?: string
  receiver?: User
  spotifyId: string
  albumImage: string
  albumName: string
  spotifyUri: string
  name: string
  artistName: string
  artistUri: string
  durationMs: number
  createdAt: Date
  seen: boolean
  seenAt?: Date | null
  conversationId?: string | null
  conversation?: Conversation | null
  history: Song[]
  inHistoryOf: Song[]
  trackType: TrackType
}
