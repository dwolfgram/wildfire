import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native"
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
import { useAtom } from "jotai"
import { currentSongAtom } from "@/state/player"

interface NotificationItemProps {
  item: Notification
}

const NOTIFICATION_CONFIG = {
  [NotificationType.RECEIVED_SONG]: {
    icon: "musical-notes",
    message: (item: Notification) =>
      `@${item.sender?.username} sent you a song`,
  },
  [NotificationType.NEW_FOLLOWER]: {
    icon: "person-add",
    message: (item: Notification) =>
      `@${item.sender?.username} started following you`,
  },
  [NotificationType.ALERT]: {
    icon: "information-circle",
    message: (item: Notification) => `${item.message}`,
  },
  [NotificationType.LIKED_SONG]: {
    icon: "heart",
    message: (item: Notification) =>
      `@${item.sender?.username} liked your song`,
  },
  [NotificationType.SHARED_SONG]: {
    icon: "flame",
    message: (item: Notification) =>
      `@${item.sender?.username} shared your song with @${item.song?.receiver?.username}`,
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
        <View className="w-[70%]">
          <ThemedText>
            {NOTIFICATION_CONFIG[item.type].message(item)}
          </ThemedText>
          {item.song && (
            <ThemedText
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-gray-500 dark:text-neutral-400 text-xs"
            >
              {item.song.name} · {item.song.artistName}
            </ThemedText>
          )}
        </View>
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
  const {
    data: notifications,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchUsersNotifications({
    limit: 20,
  })
  const { data: unreadCountData } = useFetchUnreadNotificationCount()
  const { mutateAsync: markNotificationsAsSeen } = useMarkNotificationsAsSeen()
  const { resetBadgeCount } = useSetNotificationBadge()
  const [currentSong] = useAtom(currentSongAtom)

  useEffect(() => {
    if (isFocused && unreadCountData?.count && unreadCountData.count > 0) {
      markNotificationsAsSeen()
      resetBadgeCount()
    }
  }, [isFocused, unreadCountData?.count])

  return (
    <ThemedSafeAreaView
      edges={{ bottom: "off", top: "maximum" }}
      className="h-full"
    >
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
        contentContainerStyle={[
          tw`pt-2 px-5`,
          currentSong && { paddingBottom: 80 },
        ]}
        data={notifications?.pages.flatMap((page) => page) || []}
        renderItem={NotificationItem}
        ListEmptyComponent={
          <ThemedView className="items-center justify-center pt-1">
            <ThemedText className="opacity-50">
              {isLoading ? "loading..." : "no notifications"}
            </ThemedText>
          </ThemedView>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator className="mt-3" size="small" />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  )
}

export default NotificationScreen
