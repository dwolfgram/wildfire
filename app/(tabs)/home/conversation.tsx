import { FlatList, Pressable, useColorScheme } from "react-native"
import React, { useCallback, useEffect } from "react"
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
      userId={song.sender.id}
      sendSongHref={"(tabs)/home/send-song"}
    />
  )
}

const ConversationScreen = () => {
  const { conversationId } = useLocalSearchParams()
  const [user] = useAtom(userAtom)
  const { data: conversation, isFetching: isLoading } =
    useFetchConversationByIdQuery(conversationId as string)
  const { mutateAsync: markConversationAsSeen } = useMarkConversationAsSeen()
  const isFocused = useIsFocused()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const { addToQueueAndPlay, currentSong } = usePlayer()

  const otherUser =
    user?.id === conversation?.userAId
      ? conversation?.userB
      : conversation?.userA

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (conversation?.messages) {
        addToQueueAndPlay(conversation?.messages.slice(index))
      }
    },
    [conversation?.messages]
  )

  useEffect(() => {
    if (isFocused) {
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
            <ThemedText className="font-semibold text-lg">
              {otherUser?.username}
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
