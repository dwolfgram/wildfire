import React from "react"
import { ThemedText } from "../ThemedText"
import usePlayer from "@/hooks/player/usePlayer"

interface TrackNameProps {
  spotifyUri: string
  name: string
}

const TrackName = ({ name, spotifyUri }: TrackNameProps) => {
  const { currentSong } = usePlayer()
  const isPlayingSong = currentSong?.spotifyUri === spotifyUri
  return (
    <ThemedText
      className={`text-base ${isPlayingSong && "text-orange-600"}`}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {name}
    </ThemedText>
  )
}

export default TrackName
