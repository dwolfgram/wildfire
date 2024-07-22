import { Notification } from "@/lib/types/notification"
import baseApi from "../client"

export const fetchUnreadNotificationCount = async () => {
  const { data } = await baseApi.get<{ count: number }>("/notifications/count")

  return data
}

export const fetchUserNotifications = async (page: number, limit: number) => {
  const { data } = await baseApi.get<Notification[]>("/notifications", {
    params: {
      page,
      limit,
    },
  })

  return data
}

export const markNotificationsAsSeen = async () => {
  const { data } = await baseApi.patch<{ success: true }>("/notifications/seen")

  return data
}
