import { FlatList, Pressable, Image, FlatListProps } from "react-native"
import React, { ReactElement, useCallback } from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import { UserTrack } from "@/lib/types/user-track"
import { Link } from "expo-router"
import tw from "@/lib/tailwind"
import { Ionicons } from "@expo/vector-icons"
import usePlayer from "@/hooks/player/usePlayer"
import Track from "./Track"

interface UserTrackListProps {
  data: UserTrack[] | null
  isLoading: boolean
  linkHref: string
  onEndReached?: () => void
  onEndReachedThreshold?: number
  footer?: ReactElement
  header?: ReactElement
}

const UserTrackItem = ({
  item: track,
  linkHref,
  handleAddToQueue,
  index,
}: {
  item: UserTrack
  handleAddToQueue: (index: number) => void
  linkHref: string
  index: number
}) => {
  return (
    <ThemedView className={`${index === 0 && "mt-2"}`}>
      <Track
        track={track}
        onPress={() => handleAddToQueue(index)}
        userId={track.userId}
        sendSongHref={linkHref}
      />
    </ThemedView>
  )
}

const UserTrackList = ({
  data,
  header,
  isLoading,
  linkHref,
  onEndReached,
  onEndReachedThreshold,
  footer,
}: UserTrackListProps) => {
  const { addToQueueAndPlay, currentSong } = usePlayer()

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (data) {
        const songsToAdd = data.slice(index)
        addToQueueAndPlay(songsToAdd)
      }
    },
    [data]
  )

  return (
    <FlatList
      data={data}
      renderItem={(props) => (
        <UserTrackItem
          handleAddToQueue={handleAddToQueue}
          linkHref={linkHref}
          {...props}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[tw`pb-10`, currentSong && { paddingBottom: 110 }]}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <ThemedView className="items-center justify-center pt-4">
          <ThemedText className="opacity-50">
            {isLoading ? "loading..." : "no results"}
          </ThemedText>
        </ThemedView>
      }
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      ListFooterComponent={footer}
      onEndReachedThreshold={onEndReachedThreshold}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      extraData={{
        linkHref,
        handleAddToQueue,
      }}
    />
  )
}

export default UserTrackList
