import { FlatList, Image, Pressable } from "react-native"
import React from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import tw from "twrnc"
import { User } from "@/lib/types/user"
import { Link } from "expo-router"
import { UserSearchResults } from "@/hooks/search/useSearchUsers"
import usePlayer from "@/hooks/player/usePlayer"

interface SearchUsersListProps {
  data: UserSearchResults
  isLoading: boolean
  query: string
}

const SearchUserItem = ({ item: user }: { item: User; index: number }) => {
  return (
    <Link
      href={{
        pathname: `(tabs)/search/profile`,
        params: { userId: user.id },
      }}
      push
      asChild
    >
      <Pressable>
        <ThemedView className="flex-row items-center gap-x-3 border-b border-gray-50 dark:border-neutral-800 py-1.5">
          <Image
            className="rounded-full"
            source={{ uri: user.pfp }}
            width={50}
            height={50}
          />
          <ThemedView className="w-[200px]">
            <ThemedText
              className="text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.username}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Pressable>
    </Link>
  )
}

const UserSearchList = ({ data, isLoading, query }: SearchUsersListProps) => {
  const { currentSong } = usePlayer()
  return (
    <FlatList
      renderItem={SearchUserItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[tw`pt-2`, currentSong && { paddingBottom: 85 }]}
      data={data}
      keyboardDismissMode={"on-drag"}
      ListEmptyComponent={
        <ThemedView className="items-center justify-center pt-1">
          <ThemedText className="opacity-50">
            {isLoading
              ? "loading..."
              : (query && data?.length === 0) || data === null
              ? "search for a user by username"
              : "no results"}
          </ThemedText>
        </ThemedView>
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default UserSearchList
