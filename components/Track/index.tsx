import { View, Text, Image, TouchableOpacity } from "react-native"
import React from "react"
import { Song } from "@/lib/types/song"
import { ThemedView } from "../ThemedView"
import AlbumArt from "./AlbumArt"
import TrackName from "./TrackName"
import ArtistName from "./ArtistName"
import SendButton from "../SendButton"
import * as Haptics from "expo-haptics"
import TrackHistory from "./TrackHistory"
import { useRouter, useSegments } from "expo-router"

interface TrackProps {
  track: Partial<Song>
  sendSongHref: string
  userId?: string
  onPress?: () => void
}

const Track = ({ track, userId, sendSongHref, onPress }: TrackProps) => {
  const router = useRouter()

  const segments = useSegments()

  const handleGoToSongHistory = () => {
    router.push({
      pathname: `${segments[0]}/${segments[1]}/song-history`,
      params: {
        songId: track.id,
      },
    })
  }

  const handlePress = async () => {
    // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress && onPress()
  }

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
      <ThemedView className="flex-row items-center justify-between border-b border-gray-50 dark:border-neutral-800 py-1.5">
        <ThemedView className="flex-row items-center gap-x-3">
          <ThemedView>
            <AlbumArt
              spotifyUri={track.spotifyUri ?? ""}
              uri={track.albumImage ?? ""}
            />
          </ThemedView>
          <ThemedView className="w-[60%]">
            <TrackName
              name={track.name ?? ""}
              spotifyUri={track.spotifyUri ?? ""}
            />
            <ArtistName
              artistName={track.artistName ?? ""}
              senderUsername={track.sender?.username}
            />
          </ThemedView>
        </ThemedView>
        <View className="flex-row items-center gap-x-3">
          <View>
            {track.history && track.history?.length > 0 && (
              <TrackHistory
                onPress={handleGoToSongHistory}
                history={track.history}
              />
            )}
          </View>
          <View className="mr-0.5">
            <SendButton track={track} userId={userId} href={sendSongHref} />
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  )
}

export default Track
