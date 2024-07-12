import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { Conversation } from "@/lib/types/conversation"
import tw from "@/lib/tailwind"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { getTimeAgo } from "@/utils/getTimeAgo"
import { Link, useRouter } from "expo-router"
import { useFetchUserConversationsQuery } from "@/api/queries/conversation"

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
      <TouchableOpacity activeOpacity={0.6}>
        <ThemedView className="flex-row items-center border-b border-gray-50 dark:border-neutral-800 justify-between pb-3 pt-1 mb-2">
          <ThemedView className="flex-row items-center gap-x-2.5">
            <Image
              className="rounded-full"
              source={{ uri: otherUser?.pfp }}
              height={50}
              width={50}
            />
            <ThemedText className="text-base">{otherUser?.username}</ThemedText>
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
      </TouchableOpacity>
    </Link>
  )
}

export default function HomeScreen() {
  const { data: conversations, isFetching: isLoading } =
    useFetchUserConversationsQuery()
  const [user] = useAtom(userAtom)
  const router = useRouter()

  return (
    <ThemedSafeAreaView className="h-full px-5">
      <ThemedView className="items-center mt-1">
        <ThemedText className="text-lg" type="defaultSemiBold">
          wildfire
        </ThemedText>
      </ThemedView>
      <FlatList
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pt-2`}
        data={conversations}
        renderItem={(props) => (
          <ConversationItem userId={user?.id!} {...props} />
        )}
        ListHeaderComponent={
          <ThemedView className="mt-2 mb-5">
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push("(tabs)/home/wildfire-weekly")}
            >
              <ThemedView className="bg-gray-50 dark:bg-neutral-800 rounded-md relative h-[65px] flex-row items-center flex-break">
                <View className="w-[20%] rounded-l-md h-full bg-orange-600 items-center justify-center">
                  <Ionicons name="flame-sharp" size={28} color={"#fed7aa"} />
                </View>
                <Text className="ml-4 text-base text-neutral-800 dark:text-neutral-300 w-[140px] font-medium">
                  weekly discovery playlist
                </Text>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>
        }
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
