import React from "react"
import { Image, Pressable, Text, View, useColorScheme } from "react-native"
import { Ionicons, Feather as Icon } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemedText } from "../ThemedText"
import { useAtom } from "jotai"
import {
  currentSongAtom,
  isPlayingAtom,
  playNextAtom,
  playPreviousAtom,
  togglePlayPauseAtom,
} from "@/state/player"
import usePlayer from "@/hooks/player/usePlayer"
import { ThemedView } from "../ThemedView"
import ProgressBar from "../ProgressBar"

const FullScreenPlayer = ({ onPress }: { onPress: any }) => {
  const {
    isPlaying,
    currentSong,
    playPreviousSong,
    playNextSong,
    playSong,
    pauseSong,
    currentPosition,
  } = usePlayer()

  const colorScheme = useColorScheme()
  const iconColor = colorScheme === "dark" ? "#FFF" : "#222"

  return (
    <ThemedView className="flex-1 w-full h-full px-5 pt-5">
      <View className="m-0">
        <View className="flex-row justify-between">
          <Pressable style={{ padding: 10 }} onPress={onPress}>
            <Icon name="chevron-down" color={iconColor} size={24} />
          </Pressable>
          <ThemedText className=" p-4">{currentSong?.artistName}</ThemedText>
          <Pressable style={{ padding: 10 }} onPress={onPress}>
            <Icon name="more-horizontal" color={iconColor} size={24} />
          </Pressable>
        </View>
        <Image
          source={{
            uri: currentSong?.albumImage,
          }}
          className="my-4 w-full h-[300px] self-center"
        />
        <View className="flex-row justify-between items-center">
          <View className="w-[80%]">
            <ThemedText className="text-xl font-semibold">
              {currentSong?.name}
            </ThemedText>
            <ThemedText className="text-gray-500">
              {currentSong?.artistName}
            </ThemedText>
          </View>
          <Ionicons
            style={{ opacity: 0.5 }}
            name="heart-outline"
            size={32}
            color={"#4b5563"}
          />
        </View>
        <View>
          <ProgressBar
            position={currentPosition}
            duration={currentSong?.durationMs!}
            onSeek={(dur: number) => null}
          />
        </View>
        <View className="flex-row justify-evenly items-center">
          {/* <Ionicons
            name="shuffle-sharp"
            style={{ opacity: 0.75 }}
            color={iconColor}
            size={30}
          /> */}
          <Ionicons
            name="play-skip-back-sharp"
            onPress={playPreviousSong}
            color={iconColor}
            size={50}
          />
          {isPlaying ? (
            <Ionicons
              onPress={pauseSong}
              name="pause-circle-sharp"
              color={iconColor}
              size={90}
            />
          ) : (
            <Ionicons
              onPress={playSong}
              name="play-circle-sharp"
              color={iconColor}
              size={90}
            />
          )}
          <Ionicons
            name="play-skip-forward-sharp"
            onPress={playNextSong}
            color={iconColor}
            size={50}
          />
          {/* <Ionicons
            name="repeat-sharp"
            style={{ opacity: 0.75 }}
            color={iconColor}
            size={30}
          /> */}
        </View>
      </View>
    </ThemedView>
  )
}

export default FullScreenPlayer
