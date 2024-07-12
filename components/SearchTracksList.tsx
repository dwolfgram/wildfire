import { FlatList, Pressable } from "react-native"
import React, { ReactElement, useCallback } from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import tw from "twrnc"
import { TrackSearchResults } from "@/hooks/search/useSearchTracks"
import { formatSpotifyTrackToSong } from "@/utils/spotifyTrackToSong"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import usePlayer from "@/hooks/player/usePlayer"
import { Song } from "@/lib/types/song"
import Track from "./Track"

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
  item: Partial<Song>
  handleAddToQueue: (index: number) => void
  userId: string
  index: number
}) => {
  return (
    <Track
      track={track}
      onPress={() => handleAddToQueue(index)}
      userId={userId}
      sendSongHref="(tabs)/search/send-song"
    />
  )
}

const SearchTracksList = ({
  data,
  isLoading,
  query,
  header,
}: SearchTracksListProps) => {
  const [user] = useAtom(userAtom)
  const { addToQueueAndPlay, currentSong } = usePlayer()

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (data) {
        const songsToAdd = data.slice(index).map(formatSpotifyTrackToSong)
        addToQueueAndPlay(songsToAdd)
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
      keyExtractor={(item) => item.spotifyUri!}
      contentContainerStyle={[tw`pt-2`, currentSong && { paddingBottom: 70 }]}
      data={data?.map(formatSpotifyTrackToSong)}
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
      keyboardDismissMode={"on-drag"}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default SearchTracksList
