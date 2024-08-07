import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  useColorScheme,
} from "react-native"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import tw from "@/lib/tailwind"
import { Conversation } from "@/lib/types/conversation"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { useIsFocused } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import {
  useFetchConversationByIdQuery,
  useMarkConversationAsSeen,
} from "@/api/queries/conversation"
import usePlayer from "@/hooks/player/usePlayer"
import Track from "@/components/Track"

const MessageItem = ({
  item: song,
  handleAddToQueue,
  index,
}: {
  item: Conversation["messages"][number]
  handleAddToQueue: (index: number) => void
  index: number
}) => {
  return (
    <Track
      onPress={() => handleAddToQueue(index)}
      track={song}
      userId={song.sender?.id}
      sendSongHref={"(tabs)/home/send-song"}
    />
  )
}

const ConversationScreen = () => {
  const { conversationId } = useLocalSearchParams()
  const isFocused = useIsFocused()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { addToQueueAndPlay, currentSong } = usePlayer()

  const [user] = useAtom(userAtom)
  const {
    data: conversation,
    refetch: refetchConversationSongs,
    isLoading: isLoading,
    isRefetching,
  } = useFetchConversationByIdQuery(conversationId as string)
  const { mutateAsync: markConversationAsSeen } = useMarkConversationAsSeen()

  const hasUnseenMessages = useMemo(
    () =>
      conversation?.messages.some(
        (message) => !message.seen && message.receiverId === user?.id
      ),
    [conversation?.messages]
  )

  const otherUser =
    user?.id === conversation?.userAId
      ? conversation?.userB
      : conversation?.userA

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (conversation?.messages) {
        addToQueueAndPlay(conversation?.messages, index)
      }
    },
    [conversation?.messages]
  )

  useEffect(() => {
    if (isFocused && hasUnseenMessages) {
      markConversationAsSeen(conversationId as string)
    }
  }, [isFocused])

  return (
    <ThemedSafeAreaView className="h-full">
      <ThemedView className="flex-row items-center justify-between mt-1 px-5">
        <Pressable onPress={() => router.back()} className="min-w-[20px]">
          <Ionicons
            name="chevron-back"
            size={26}
            color={colorScheme === "dark" ? "#FFF" : "#222"}
          />
        </Pressable>
        <Link
          href={{
            pathname: `(tabs)/home/profile`,
            params: { userId: otherUser?.id },
          }}
          push
          asChild
        >
          <Pressable>
            <ThemedText className="font-semibold text-lg ">
              {otherUser?.username ? `@${otherUser?.username}` : ""}
            </ThemedText>
          </Pressable>
        </Link>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <FlatList
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          tw`pt-4 px-5`,
          currentSong && { paddingBottom: 85 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchConversationSongs}
            size={2}
            tintColor={colorScheme === "dark" ? "#777" : "#e5e7eb"}
          />
        }
        refreshing={isRefetching}
        onRefresh={refetchConversationSongs}
        data={conversation?.messages}
        renderItem={(props) => (
          <MessageItem handleAddToQueue={handleAddToQueue} {...props} />
        )}
        ListEmptyComponent={
          <ThemedView className="items-center justify-center pt-1">
            <ThemedText className="opacity-50">
              {isLoading ? "loading..." : "no results"}
            </ThemedText>
          </ThemedView>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  )
}

export default ConversationScreen
