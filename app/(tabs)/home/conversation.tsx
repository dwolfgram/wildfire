import { FlatList, Image, Pressable, View, useColorScheme } from "react-native"
import React, { useCallback, useEffect } from "react"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import tw from "@/lib/tailwind"
import { Conversation } from "@/lib/types/conversation"
import { formatSpotifyTrackToSong } from "@/utils/spotifyTrackToSong"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { useIsFocused } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import {
  useFetchConversationByIdQuery,
  useMarkConversationAsSeen,
} from "@/api/queries/conversation"
import { addToQueueAtom } from "@/state/player"

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
    <Pressable onPress={() => handleAddToQueue(index)}>
      <ThemedView className="flex-row items-center justify-between mb-3">
        {/* <Image
        className="rounded-full"
        source={{ uri: song.sender.pfp }}
        width={30}
        height={30}
      /> */}
        <ThemedView className="flex-row items-center gap-x-3 w-[60%]">
          <Image source={{ uri: song.albumImage }} width={50} height={50} />
          <ThemedView>
            <ThemedText
              className="text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {song.name}
            </ThemedText>
            <ThemedView className="flex-row items-center">
              <ThemedText
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-xs text-gray-600 dark:text-neutral-400"
              >
                {song.artistName} · {song.sender.username}
              </ThemedText>
              {/* <Image
              className="rounded-full ml-1"
              source={{ uri: song.sender.pfp }}
              height={16}
              width={16}
            /> */}
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <ThemedView className="flex-row items-center">
          {song.history.length > 1 && (
            <ThemedView className="relative mr-5">
              <Image
                className="rounded-full"
                source={{
                  uri: song.history[song.history.length - 2]?.sender?.pfp,
                }}
                height={20}
                width={20}
              />
              <View className="p-[1px] rounded-full absolute bottom-[-5px] right-[-1px] bg-white">
                <Ionicons name="flame-sharp" color={"#ea580c"} size={12} />
              </View>
            </ThemedView>
          )}
          <Link
            href={{
              pathname: "(tabs)/home/send-song",
              params: {
                song: JSON.stringify(formatSpotifyTrackToSong(song)),
                userIdToCredit: song.senderId,
              },
            }}
            asChild
          >
            <Pressable
              onPress={() => null}
              className="rounded-full bg-orange-600 active:bg-orange-700 w-[34px] h-[34px] pl-0.5 items-center justify-center"
            >
              <Ionicons
                className="relative right-[5px]"
                name="send"
                color="#FFFFFF"
                size={17}
              />
            </Pressable>
          </Link>
        </ThemedView>
      </ThemedView>
    </Pressable>
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
  const [, addToQueue] = useAtom(addToQueueAtom)

  const otherUser =
    user?.id === conversation?.userAId
      ? conversation?.userB
      : conversation?.userA

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (conversation?.messages) {
        addToQueue(conversation?.messages.slice(index))
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
        <ThemedText className="font-semibold text-lg">
          {otherUser?.username}
        </ThemedText>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <FlatList
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pt-4 px-5`}
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
