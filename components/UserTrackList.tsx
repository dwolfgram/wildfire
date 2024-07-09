import { FlatList, Pressable, Image } from "react-native"
import React, { ReactElement, useCallback } from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import { UserTrack } from "@/lib/types/user-track"
import { Link } from "expo-router"
import { formatSpotifyTrackToSong } from "@/utils/spotifyTrackToSong"
import tw from "@/lib/tailwind"
import { Ionicons } from "@expo/vector-icons"
import { useAtom } from "jotai"
import { addToQueueAtom } from "@/state/player"

interface UserTrackListProps {
  data: UserTrack[] | null
  isLoading: boolean
  linkHref: string
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
    <Pressable onPress={() => handleAddToQueue(index)} className="px-5">
      <ThemedView className="flex-row items-center justify-between mt-3">
        <ThemedView className="flex-row items-center gap-x-3">
          <Image source={{ uri: track.albumImage }} width={44} height={44} />
          <ThemedView className="w-[200px]">
            <ThemedText
              className="text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {track.name}
            </ThemedText>
            <ThemedText className="text-xs text-gray-600 dark:text-neutral-400">
              {track.artistName}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <Link
          href={{
            pathname: linkHref,
            params: {
              song: JSON.stringify(track),
              userIdToCredit: track.userId,
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

const UserTrackList = ({
  data,
  header,
  isLoading,
  linkHref,
}: UserTrackListProps) => {
  const [_, addToQueue] = useAtom(addToQueueAtom)

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (data) {
        addToQueue(data.slice(index))
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
      contentContainerStyle={tw`pt-2 pb-2`}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <ThemedView className="items-center justify-center pt-4">
          <ThemedText className="opacity-50">
            {isLoading ? "loading..." : "no results"}
          </ThemedText>
        </ThemedView>
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default UserTrackList
