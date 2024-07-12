import React, { useCallback } from "react"
import {
  Image,
  Pressable,
  View,
  useColorScheme,
  Dimensions,
} from "react-native"
import { Ionicons, Feather as Icon } from "@expo/vector-icons"
import { ThemedText } from "../ThemedText"
import usePlayer from "@/hooks/player/usePlayer"
import { ThemedView } from "../ThemedView"
import ProgressBar from "../ProgressBar"
import Toast from "react-native-toast-message"
import { toastConfig } from "@/lib/toast"

const FullScreenPlayer = ({
  setProgress,
  progress,
  onPress,
}: {
  setProgress: (value: number) => void
  progress: number
  onPress: any
}) => {
  const screenWidth = Dimensions.get("window").width
  const {
    isPlaying,
    currentSong,
    playPreviousSong,
    playNextSong,
    playSong,
    pauseSong,
    seek,
  } = usePlayer()

  const colorScheme = useColorScheme()
  const iconColor = colorScheme === "dark" ? "#FFF" : "#222"

  const handleOnSeekEnd = useCallback(
    async (value: number) => {
      if (value <= currentSong?.durationMs!) {
        await seek(value, setProgress)
      }
    },
    [seek]
  )

  return (
    <ThemedView className="flex-1 w-full h-full px-5 pt-5">
      <View className="m-0">
        <View className="flex-row items-center justify-between py-4">
          <Pressable onPress={onPress}>
            <Icon name="chevron-down" color={iconColor} size={24} />
          </Pressable>
          <ThemedText>{currentSong?.artistName}</ThemedText>
          <Pressable onPress={onPress}>
            <Icon name="more-horizontal" color={iconColor} size={24} />
          </Pressable>
        </View>
        <Image
          source={{
            uri: currentSong?.albumImage,
          }}
          style={{ height: screenWidth - 20 }}
          className="my-4 w-full self-center"
        />
        <View className="flex-row justify-between items-center">
          <View className="w-[80%]">
            <ThemedText
              className="text-xl font-semibold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentSong?.name}
            </ThemedText>
            <ThemedText className="text-gray-500 dark:text-neutral-400">
              {currentSong?.artistName}
            </ThemedText>
          </View>
          <Ionicons
            style={{ opacity: 0.5 }}
            name="heart-outline"
            size={32}
            color={iconColor}
          />
        </View>
        <View className="my-3">
          <ProgressBar
            progress={progress}
            duration={currentSong?.durationMs!}
            onSlideEnd={handleOnSeekEnd}
          />
        </View>
        <View className="flex-row justify-evenly items-center">
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={async () => await playPreviousSong(progress, setProgress)}
          >
            <Ionicons name="play-skip-back-sharp" color={iconColor} size={50} />
          </Pressable>
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={
              isPlaying
                ? pauseSong
                : async () => await playSong(progress, setProgress)
            }
          >
            {isPlaying ? (
              <Ionicons name="pause-circle-sharp" color={iconColor} size={90} />
            ) : (
              <Ionicons name="play-circle-sharp" color={iconColor} size={90} />
            )}
          </Pressable>
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={() => playNextSong(setProgress)}
          >
            <Ionicons
              name="play-skip-forward-sharp"
              color={iconColor}
              size={50}
            />
          </Pressable>
        </View>
      </View>
      <Toast config={toastConfig} />
    </ThemedView>
  )
}

export default FullScreenPlayer
