import React from "react"
import { ThemedText } from "../ThemedText"
import usePlayer from "@/hooks/player/usePlayer"
import SpotifyLink from "../SpotifyLink"
import { View } from "react-native"

interface TrackNameProps {
  spotifyUri: string
  name: string
}

const TrackName = ({ name, spotifyUri }: TrackNameProps) => {
  const { currentSong } = usePlayer()
  const isPlayingSong = currentSong?.spotifyUri === spotifyUri
  return (
    <View className="flex-row items-center">
      <ThemedText
        className={`text-base ${isPlayingSong && "text-orange-600"}`}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </ThemedText>
      <View className="ml-1.5">
        <SpotifyLink uri={spotifyUri} size={17} />
      </View>
    </View>
  )
}

export default TrackName
