import { SongHistory } from "./song-history"
import { User } from "./user"

export interface Song {
  id: string
  senderId: string
  receiverId: string
  sender: User
  receiver: User
  spotifyId: string
  albumImage: string
  albumName: string
  spotifyUri: string
  name: string
  artistName: string
  artistUri: string
  durationMs: number
  history: SongHistory[]
  sentAt: Date
  seen: boolean
  seenAt?: Date
  conversationId?: string
}
