import { Song } from "./song"
import { User } from "./user"

export interface SongHistory {
  id: string
  songId: string
  song?: Song
  senderId: string
  sender?: User
}
