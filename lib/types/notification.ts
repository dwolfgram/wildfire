import { User } from "./user"

export interface Notification {
  id: string
  userId: string
  type: string
  message: string
  seen: boolean
  createdAt: Date
  updatedAt: Date
  user?: User
}
