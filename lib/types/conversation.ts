import { Song } from "./song"
import { User } from "./user"

export interface Conversation {
  id: string
  userAId: string
  userBId: string
  createdAt: Date
  lastMessageAt?: Date
  userA?: User
  userB?: User
  messages: Song[]
  _count?: { messages: number }
}
