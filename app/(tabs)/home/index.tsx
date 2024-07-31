import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import {
  conversationQueryKeys,
  useFetchUserConversationsQuery,
} from "@/api/queries/conversation"
import * as Notifications from "expo-notifications"
import ConversationsList from "@/components/ConversationsList"
import useRegisterNotifications from "@/hooks/notifications/useRegisterForNotifications"
import { useEffect, useRef, useState } from "react"
import useUpdateNotificationPushToken from "@/hooks/notifications/useUpdateNotificationPushToken"
import useSendNotification from "@/hooks/notifications/useSendNotification"
import NotificationIcon from "@/components/NotificationIcon"
import { View } from "react-native"
import { useQueryClient } from "@tanstack/react-query"
import { notificationQueryKeys } from "@/api/queries/notifications"
import SpotifyWarningModal from "@/components/SpotifyWarningModal"
import { useAtom } from "jotai"
import { hasShownSpotifyWarningModalAtom } from "@/state/modals"
import { NotificationType } from "@/lib/types/notification"
import { followQueryKeys } from "@/api/queries/follow"
import useAuth from "@/hooks/auth/useAuth"
import { userTracksQueryKeys } from "@/api/queries/user-tracks"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function HomeScreen() {
  const [hasShownSpotifyWarningModal] = useAtom(hasShownSpotifyWarningModalAtom)
  const [isSpotifyWarningModalOpen, setIsSpotifyWarningModalOpen] = useState(
    !hasShownSpotifyWarningModal
  )
  const { data: conversations, isFetching: isLoading } =
    useFetchUserConversationsQuery()
  const {
    session: { user },
  } = useAuth()

  const queryClient = useQueryClient()

  const { registerForNotifications } = useRegisterNotifications()
  const { updateUserNotificationToken } = useUpdateNotificationPushToken()

  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    const handleTryRegisterNotifications = async () => {
      try {
        const token = await registerForNotifications()
        await updateUserNotificationToken(token)
        console.log("Notification token:", token)
      } catch (err) {
        console.log("Error setting up notifications", err)
      }
    }

    handleTryRegisterNotifications()

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const queriesToInvalidate: any[] = [
          notificationQueryKeys.getUnreadCount(),
        ]
        const notificationType = notification.request.content.data.type
        const fromUserId = notification.request.content.data.fromUserId
        if (notificationType === NotificationType.NEW_FOLLOWER) {
          queriesToInvalidate.push(followQueryKeys.getFollowers(user?.id!))
          queriesToInvalidate.push(followQueryKeys.getFollowing(fromUserId))
        } else if (notificationType === NotificationType.RECEIVED_SONG) {
          queriesToInvalidate.push(conversationQueryKeys.all)
        } else if (notificationType === NotificationType.ALERT) {
          queriesToInvalidate.push(
            userTracksQueryKeys.wildfireWeekly(user?.id!)
          )
        }
        // TODO: invalidate notification count query
        queriesToInvalidate.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key })
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
    <>
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
      <SpotifyWarningModal
        isOpen={isSpotifyWarningModalOpen}
        setIsOpen={setIsSpotifyWarningModalOpen}
      />
    </>
  )
}
