import tw from "@/lib/tailwind"
import { Ionicons } from "@expo/vector-icons"
import { Link, useRouter } from "expo-router"
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import { getTimeAgo } from "@/utils/getTimeAgo"
import { Conversation } from "@/lib/types/conversation"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import Avatar from "./Avatar"
import { useTheme } from "@react-navigation/native"
import { currentSongAtom } from "@/state/player"

const ConversationItem = ({
  item: conversation,
  userId,
}: {
  item: Conversation
  userId: string
}) => {
  const otherUser =
    userId === conversation.userAId ? conversation.userB : conversation.userA

  return (
    <Link
      href={{
        pathname: "(tabs)/home/conversation",
        params: { conversationId: conversation.id },
      }}
      asChild
      push
    >
      <Pressable className="active:opacity-60">
        <ThemedView className="flex-row items-center border-b border-gray-50 dark:border-neutral-800 justify-between pb-3 pt-1 mb-2">
          <ThemedView className="flex-row items-center gap-x-2.5">
            <View>
              <Link
                href={{
                  pathname: "(tabs)/home/profile",
                  params: { userId: otherUser?.id },
                }}
                asChild
                push
              >
                <Pressable className="active:opacity-60">
                  <Avatar user={otherUser!} />
                </Pressable>
              </Link>
            </View>
            <ThemedText className="text-base">
              @{otherUser?.username}
            </ThemedText>
          </ThemedView>
          <ThemedView>
            <ThemedText className="text-sm text-gray-500 dark:text-neutral-500 my-0.5">
              {getTimeAgo(conversation.lastMessageAt!)}
            </ThemedText>
            {(conversation._count?.messages ?? 0) > 0 && (
              <View className="bg-orange-600 rounded-full items-center justify-center min-w-[20px] min-h-[20px] px-1">
                <Text className="text-white text-xs font-semibold">
                  {conversation._count?.messages}
                </Text>
              </View>
            )}
          </ThemedView>
        </ThemedView>
      </Pressable>
    </Link>
  )
}

interface ConversationListProps {
  data: Conversation[] | undefined
  isLoading: boolean
  onRefresh: () => void
  isRefetching: boolean
}

const ConversationsList = ({
  data,
  isLoading,
  isRefetching,
  onRefresh,
}: ConversationListProps) => {
  const theme = useTheme()
  const [user] = useAtom(userAtom)
  const [currentSong] = useAtom(currentSongAtom)
  const router = useRouter()

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      contentContainerStyle={[tw`pt-2`, currentSong && { paddingBottom: 85 }]}
      data={data}
      renderItem={(props) => <ConversationItem userId={user?.id!} {...props} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          size={12}
          tintColor={theme.dark ? "#777" : "#e5e7eb"}
        />
      }
      refreshing={isRefetching}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <View>
          <Pressable
            onPress={() => router.push("(tabs)/home/wildfire-weekly")}
            className="mt-2 active:opacity-60 max-h-[80px] mb-4"
          >
            <View className="relative bg-gray-50 rounded-md dark:bg-neutral-800 flex-row items-center">
              <View className="w-[20%] rounded-l-md h-full bg-orange-600 items-center justify-center">
                <Ionicons name="flame-sharp" size={28} color={"#ffedd5"} />
              </View>
              <View className="py-2 ml-3 w-[70%]">
                <Text
                  numberOfLines={1}
                  className="text-base text-neutral-800 dark:text-neutral-300 font-medium"
                >
                  wildfire weekly
                </Text>
                <Text
                  numberOfLines={2}
                  className="text-xs text-gray-500 dark:text-neutral-400 font-normal"
                >
                  {
                    "new likes & top listens from friends you follow, every wednesday"
                  }
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      }
      ListEmptyComponent={
        <ThemedView className="items-center justify-center pt-1">
          <ThemedText className="opacity-50">
            {isLoading ? "loading..." : "no music sent yet"}
          </ThemedText>
        </ThemedView>
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default ConversationsList
