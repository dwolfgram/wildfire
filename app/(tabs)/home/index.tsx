import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { useFetchUserConversationsQuery } from "@/api/queries/conversation"
import * as Notifications from "expo-notifications"
import ConversationsList from "@/components/ConversationsList"
import useRegisterNotifications from "@/hooks/notifications/useRegisterForNotifications"
import { useEffect, useRef } from "react"
import useUpdateNotificationPushToken from "@/hooks/notifications/useUpdateNotificationPushToken"
import useSendNotification from "@/hooks/notifications/useSendNotification"
import NotificationIcon from "@/components/NotificationIcon"
import { View } from "react-native"
import { useQueryClient } from "@tanstack/react-query"
import { notificationQueryKeys } from "@/api/queries/notifications"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function HomeScreen() {
  const { data: conversations, isFetching: isLoading } =
    useFetchUserConversationsQuery()

  const queryClient = useQueryClient()

  const { registerForNotifications } = useRegisterNotifications()
  const { updateUserNotificationToken } = useUpdateNotificationPushToken()
  const { sendPushNotification } = useSendNotification()

  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    const handleTryRegisterNotifications = async () => {
      try {
        const token = await registerForNotifications()
        await updateUserNotificationToken(token)
        await sendPushNotification(token!)
        console.log("Notification token:", token)
      } catch (err) {
        console.log("Error setting up notifications", err)
      }
    }

    handleTryRegisterNotifications()

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification)
        // TODO: invalidate notification count query
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.getUnreadCount(),
        })
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <ThemedSafeAreaView className="h-full px-5">
      <ThemedView className="flex-row items-center justify-between mt-1 px-3">
        <ThemedView className="min-w-[20px]"></ThemedView>
        <ThemedText className="font-semibold text-lg">home</ThemedText>
        <View>
          <NotificationIcon />
        </View>
      </ThemedView>
      <ConversationsList data={conversations} isLoading={isLoading} />
    </ThemedSafeAreaView>
  )
}
