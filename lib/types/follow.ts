import { User } from "./user"

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
  accepted?: boolean
  follower?: User
  following?: User
}
