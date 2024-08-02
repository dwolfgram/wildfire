import { View, Text, FlatList, Pressable } from "react-native"
import React, { useEffect } from "react"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import {
  useFetchUnreadNotificationCount,
  useFetchUsersNotifications,
  useMarkNotificationsAsSeen,
} from "@/api/queries/notifications"
import tw from "@/lib/tailwind"
import { Notification, NotificationType } from "@/lib/types/notification"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useIsFocused, useTheme } from "@react-navigation/native"
import { User } from "@/lib/types/user"
import { getTimeAgo } from "@/utils/getTimeAgo"
import useSetNotificationBadge from "@/hooks/notifications/useSetNotificationBadge"

interface NotificationItemProps {
  item: Notification
}

const NOTIFICATION_CONFIG = {
  [NotificationType.RECEIVED_SONG]: {
    icon: "musical-notes",
    message: (user: User) => `@${user.username} sent you a song`,
  },
  [NotificationType.NEW_FOLLOWER]: {
    icon: "person-add",
    message: (user: User) => `@${user.username} started following you`,
  },
  [NotificationType.ALERT]: {
    icon: "information-circle",
    message: (user: User, message?: string) => `${message}`,
  },
  [NotificationType.LIKED_SONG]: {
    icon: "heart",
    message: (user: User) =>
      `you helped @${user.username} find a song they liked`,
  },
  [NotificationType.SHARED_SONG]: {
    icon: "flame",
    message: (user: User) =>
      `@${user.username} sent a song they found because of you`,
  },
}

const NotificationItem = ({ item }: NotificationItemProps) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "(tabs)/home/profile",
          params: {
            userId: item.senderId,
          },
        })
      }
      className="flex-row items-center justify-between active:opacity-60 border-b border-gray-50 dark:border-neutral-800 py-3"
    >
      <View className="flex-row items-center gap-x-2.5">
        <View className="bg-orange-600 w-[44px] h-[44px] rounded-md items-center justify-center">
          <Ionicons
            // @ts-ignore
            name={NOTIFICATION_CONFIG[item.type].icon}
            size={24}
            color={"#ffedd5"}
          />
        </View>
        <ThemedText className="w-[70%]">
          {NOTIFICATION_CONFIG[item.type].message(item.sender!, item.message)}
        </ThemedText>
      </View>
      <Text className="text-gray-400 dark:text-neutral-500">
        {getTimeAgo(item.createdAt)}
      </Text>
    </Pressable>
  )
}

const NotificationScreen = () => {
  const theme = useTheme()
  const isFocused = useIsFocused()
  const { data: notifications, isLoading } = useFetchUsersNotifications({
    limit: 20,
  })
  const { data: unreadCountData } = useFetchUnreadNotificationCount()
  const { mutateAsync: markNotificationsAsSeen } = useMarkNotificationsAsSeen()
  const { resetBadgeCount } = useSetNotificationBadge()

  useEffect(() => {
    if (isFocused && unreadCountData?.count && unreadCountData.count > 0) {
      markNotificationsAsSeen()
      resetBadgeCount()
    }
  }, [isFocused, unreadCountData?.count])

  return (
    <ThemedSafeAreaView className="h-full">
      <ThemedView className="flex-row items-center justify-between mt-1 px-5">
        <Pressable onPress={() => router.back()} className="min-w-[20px]">
          <Ionicons
            name="chevron-back"
            size={26}
            color={theme.dark ? "#FFF" : "#222"}
          />
        </Pressable>
        <ThemedText className="font-semibold text-lg">notifications</ThemedText>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <FlatList
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pt-2 px-5`}
        data={notifications?.pages.flatMap((page) => page) || []}
        renderItem={NotificationItem}
        ListEmptyComponent={
          <ThemedView className="items-center justify-center pt-1">
            <ThemedText className="opacity-50">
              {isLoading ? "loading..." : "no notifications"}
            </ThemedText>
          </ThemedView>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  )
}

export default NotificationScreen
