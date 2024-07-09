import React from "react"
import { View, TouchableWithoutFeedback, Image } from "react-native"
import { ThemedText } from "../ThemedText"
import { Ionicons } from "@expo/vector-icons"
import { useAtom } from "jotai"
import {
  currentSongAtom,
  isPlayingAtom,
  togglePlayPauseAtom,
} from "@/state/player"

const MiniPlayer = ({ onPress }: { onPress: any }) => {
  const [currentSong] = useAtom(currentSongAtom)
  const [isPlaying] = useAtom(isPlayingAtom)
  const [, togglePlayPause] = useAtom(togglePlayPauseAtom)

  return (
    <TouchableWithoutFeedback className="h-full w-full" onPress={onPress}>
      <View className="flex-row items-center self-center justify-between pl-3 pr-4 py-2.5 rounded-lg bg-gray-100 w-[94%] dark:border-neutral-600 dark:bg-neutral-800">
        <View className="flex-row items-center gap-x-2">
          <Image
            source={{ uri: currentSong?.albumImage }}
            height={40}
            width={40}
          />
          <View className="w-[75%]">
            <ThemedText numberOfLines={1} ellipsizeMode="tail" className="">
              {currentSong?.name}
            </ThemedText>
            <ThemedText className="text-gray-500 text-sm">
              {currentSong?.artistName}
            </ThemedText>
          </View>
        </View>
        {isPlaying ? (
          <Ionicons
            onPress={togglePlayPause}
            name="pause-circle-sharp"
            color="#222"
            size={36}
          />
        ) : (
          <Ionicons
            onPress={togglePlayPause}
            name="play-circle-sharp"
            color="#222"
            size={36}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default MiniPlayer
