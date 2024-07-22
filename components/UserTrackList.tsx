import { FlashList } from "@shopify/flash-list"
import React, { ReactElement, useCallback, useMemo } from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import tw from "@/lib/tailwind"
import usePlayer from "@/hooks/player/usePlayer"
import Track from "./Track"
import { Song } from "@/lib/types/song"
import { filterDuplicates } from "@/utils/filterDuplicates"

interface UserTrackListProps {
  data: Song[] | null
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
  item: Song
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
        addToQueueAndPlay(data, index)
      }
    },
    [data]
  )

  const dedupedArray = useMemo(
    () => filterDuplicates<Song>(data!, "id"),
    [data]
  )

  return (
    <FlashList
      data={dedupedArray}
      renderItem={(props) => (
        <UserTrackItem
          handleAddToQueue={handleAddToQueue}
          linkHref={linkHref}
          {...props}
        />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={63}
      // @ts-ignore
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
