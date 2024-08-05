import { Song } from "./song"
import { User } from "./user"

export enum NotificationType {
  NEW_FOLLOWER = "NEW_FOLLOWER",
  RECEIVED_SONG = "RECEIVED_SONG",
  LIKED_SONG = "LIKED_SONG",
  ALERT = "ALERT",
  SHARED_SONG = "SHARED_SONG",
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  message: string
  seen: boolean
  createdAt: Date
  updatedAt: Date
  senderId?: string
  sender?: User
  user: User
  songId?: string
  song?: Song
}
