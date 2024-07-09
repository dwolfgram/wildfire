import { Conversation } from "./conversation"
import { Follow } from "./follow"
import { Song } from "./song"
import { SongHistory } from "./song-history"

export interface User {
  id: string
  email: string
  username?: string
  spotifyId: string
  spotifyUri: string
  pfp?: string
  country: string
  product: string
  displayName: string
  explicitContent: boolean
  createdAt: Date
  sentSongs?: Song[]
  receivedSongs?: Song[]
  history?: SongHistory[]
  followers?: Follow[]
  following?: Follow[]
  notifications?: Notification[]
  sentConversations?: Conversation[]
  receivedConversations?: Conversation[]
  notificationToken?: string
  discoverWeeklyId?: string
  _count?: {
    following: number
    followers: number
  }
}
