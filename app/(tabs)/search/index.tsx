import Ionicons from "@expo/vector-icons/Ionicons"
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Button } from "@rneui/themed"
import { useCallback, useState } from "react"
import SearchTracksList from "@/components/SearchTracksList"
import SearchUsersList from "@/components/SearchUsersList"
import useSearchUsers from "@/hooks/search/useSearchUsers"
import useSearchTracks from "@/hooks/search/useSearchTracks"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import tw from "@/lib/tailwind"

enum SearchType {
  songs = "songs",
  users = "users",
}
const SEARCH_TYPES = Object.values(SearchType)
const DEFAULT_SEARCH_TYPE = SearchType.songs

export default function SearchScreen() {
  const colorScheme = useColorScheme()
  const [searchType, setSearchType] = useState<SearchType>(DEFAULT_SEARCH_TYPE)
  const {
    isSearchingUsers,
    searchUsers,
    setUserSearchQuery,
    userSearchQuery,
    userSearchResults,
  } = useSearchUsers()
  const {
    isSearchingTracks,
    searchTracks,
    setTracksSearchQuery,
    tracksSearchQuery,
    tracksSearchResults,
  } = useSearchTracks()

  const handleSearch = useCallback(
    async (type: SearchType) => {
      if (type === SearchType.songs) {
        searchTracks()
      } else {
        searchUsers()
      }
    },
    [searchTracks, searchUsers]
  )

  const handleSetQuery = (value: string) => {
    if (searchType === SearchType.songs) {
      setTracksSearchQuery(value)
    } else {
      setUserSearchQuery(value)
    }
  }

  return (
    <ThemedSafeAreaView
      edges={{ bottom: "off", top: "maximum" }}
      className="h-full"
    >
      <ThemedView className="items-center mt-1">
        <ThemedText className="text-lg" type="defaultSemiBold">
          search
        </ThemedText>
      </ThemedView>
      <ThemedView className="mt-2 px-5">
        <View className="flex-row items-center justify-between mb-3 bg-gray-50 dark:bg-neutral-800 border-b-[0px] px-3 rounded-md">
          <View className="flex-row items-center">
            <View className="mr-2">
              <Ionicons
                name="search"
                size={20}
                color={colorScheme === "dark" ? "#fff" : "#222"}
              />
            </View>
            <TextInput
              value={
                searchType === SearchType.songs
                  ? tracksSearchQuery
                  : userSearchQuery
              }
              onChangeText={handleSetQuery}
              placeholder={
                searchType === SearchType.songs
                  ? "search songs"
                  : "search users"
              }
              className="text-base pb-3 pt-2 text-black dark:text-white h-full w-[85%]"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={async () => await handleSearch(searchType)}
            />
          </View>
          {((searchType === SearchType.songs && tracksSearchQuery) ||
            (searchType === SearchType.users && userSearchQuery)) && (
            <Pressable
              className="active:opacity-50 px-4 pl-0"
              onPress={() => handleSetQuery("")}
            >
              <Ionicons
                name="close-circle-sharp"
                size={20}
                color={colorScheme === "dark" ? "#aaa" : "#9ca3af"}
              />
            </Pressable>
          )}
        </View>
      </ThemedView>
      <ThemedView className="pb-2 border-b border-gray-100 dark:border-neutral-800">
        <ScrollView contentContainerStyle={tw`gap-1 px-5`} horizontal>
          {SEARCH_TYPES.map((type) => {
            const selected = searchType === type
            const selectedTitleStyles = tw`text-orange-600`
            return (
              <Button
                key={type}
                buttonStyle={[
                  tw`rounded-md px-3 py-0 border-gray-200 border dark:border-neutral-800 h-[30px]`,
                ]}
                titleStyle={[
                  tw`text-sm font-medium text-black dark:text-white`,
                  selected && selectedTitleStyles,
                ]}
                title={type}
                type="outline"
                onPress={() => setSearchType(type)}
              />
            )
          })}
        </ScrollView>
      </ThemedView>
      <ThemedView className="px-5 h-full flex-1">
        {searchType === SearchType.songs ? (
          <SearchTracksList
            data={tracksSearchResults}
            query={tracksSearchQuery}
            isLoading={isSearchingTracks}
          />
        ) : (
          <SearchUsersList
            data={userSearchResults}
            query={userSearchQuery}
            isLoading={isSearchingUsers}
          />
        )}
      </ThemedView>
    </ThemedSafeAreaView>
  )
}
