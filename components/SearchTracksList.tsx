import { Text, FlatList, Image, Pressable } from "react-native"
import React, { ReactElement, useCallback } from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import tw from "twrnc"
import { SpotifyTrack } from "@/lib/types/spotify-track"
import { TrackSearchResults } from "@/hooks/search/useSearchTracks"
import { Link } from "expo-router"
import { formatSpotifyTrackToSong } from "@/utils/spotifyTrackToSong"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { Ionicons } from "@expo/vector-icons"
import { addToQueueAtom } from "@/state/player"

interface SearchTracksListProps {
  data: TrackSearchResults
  isLoading: boolean
  query: string
  header?: ReactElement
}

const SearchTrackItem = ({
  item: track,
  userId,
  handleAddToQueue,
  index,
}: {
  item: SpotifyTrack
  handleAddToQueue: (index: number) => void
  userId: string
  index: number
}) => {
  return (
    <Pressable onPress={() => handleAddToQueue(index)}>
      <ThemedView className="flex-row items-center justify-between mb-3">
        <ThemedView className="flex-row items-center gap-3">
          <Image
            source={{ uri: track.album.images[0].url }}
            width={50}
            height={50}
          />
          <ThemedView className="w-[200px]">
            <ThemedText
              className="text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {track.name}
            </ThemedText>
            <ThemedText className="text-xs text-gray-600 dark:text-neutral-400">
              {track.artists[0].name}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <Link
          href={{
            pathname: "(tabs)/search/send-song",
            params: {
              song: JSON.stringify(formatSpotifyTrackToSong(track)),
              userIdToCredit: userId,
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
    </Pressable>
  )
}

const SearchTracksList = ({
  data,
  isLoading,
  query,
  header,
}: SearchTracksListProps) => {
  const [user] = useAtom(userAtom)
  const [_, addToQueue] = useAtom(addToQueueAtom)

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (data) {
        const songsToAdd = data.slice(index).map(formatSpotifyTrackToSong)

        addToQueue(songsToAdd)
      }
    },
    [data]
  )
  return (
    <FlatList
      renderItem={(props) => (
        <SearchTrackItem
          handleAddToQueue={handleAddToQueue}
          userId={user?.id!}
          {...props}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={tw`pt-2`}
      data={data}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <ThemedView className="items-center justify-center pt-1">
          <ThemedText className="opacity-50">
            {isLoading
              ? "loading..."
              : (query && data?.length === 0) || data === null
              ? "search for a song"
              : "no results"}
          </ThemedText>
        </ThemedView>
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default SearchTracksList
