import { Image, View, StyleSheet, Pressable } from "react-native"
import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { useAtom } from "jotai"
import {
  currentPositionAtom,
  currentSongAtom,
  isPlayingAtom,
} from "@/state/player"
import usePlayer from "@/hooks/player/usePlayer"

interface AlbumArtProps {
  uri: string
  spotifyUri: string
  width?: number
  height?: number
}

const AlbumArt = ({
  uri,
  spotifyUri,
  width = 50,
  height = 50,
}: AlbumArtProps) => {
  return (
    <View>
      <Image source={{ uri }} style={{ width, height }} />
      {/* {isCurrentSong && (
        <Pressable
          style={{ backgroundColor: "rgba(0,0,0,.4)" }}
          className="absolute inset-0 opacity-100 active:opacity-80 h-full w-full items-center justify-center"
          onPress={isPlaying ? pauseSong : async () => await playSong(position)}
        >
          {isPlaying ? (
            <Ionicons name="pause-sharp" size={20} color={"#FFF"} />
          ) : (
            <Ionicons name="play-sharp" size={20} color={"#FFF"} />
          )}
        </Pressable>
      )} */}
    </View>
  )
}

export default AlbumArt
