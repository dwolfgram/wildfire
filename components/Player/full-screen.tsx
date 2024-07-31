import React, { useCallback, useMemo } from "react"
import {
  Image,
  Pressable,
  View,
  useColorScheme,
  Dimensions,
} from "react-native"
import { Ionicons, Feather as Icon, AntDesign } from "@expo/vector-icons"
import { ThemedText } from "../ThemedText"
import usePlayer from "@/hooks/player/usePlayer"
import { ThemedView } from "../ThemedView"
import ProgressBar from "../ProgressBar"
import Toast from "react-native-toast-message"
import { toastConfig } from "@/lib/toast"
import SpotifyLink from "../SpotifyLink"
import TrackHistory from "../Track/TrackHistory"
import { useRouter, useSegments } from "expo-router"
import LikeButton from "../LikeButton"
import SendButton from "../SendButton"

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
  const router = useRouter()
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
  const iconColor = colorScheme === "dark" ? "#FFF" : "#6b7280"
  const playButtonsColor = colorScheme === "dark" ? "#FFF" : "#222"
  const segments = useSegments()

  const handleOnSeekEnd = useCallback(
    async (value: number) => {
      if (value <= currentSong?.durationMs!) {
        await seek(value, setProgress)
      }
    },
    [seek]
  )

  const handleGoToSongHistory = useCallback(() => {
    onPress()
    router.push({
      pathname: `${segments[0]}/${segments[1]}/song-history`,
      params: {
        songId: currentSong?.id,
      },
    })
  }, [currentSong?.id])

  const handlePlayPreviousSong = useCallback(async () => {
    await playPreviousSong(progress, setProgress)
  }, [playPreviousSong])

  const handlePlayNextSong = useCallback(async () => {
    await playNextSong(setProgress)
  }, [playNextSong])

  const handleTogglePlay = useCallback(async () => {
    isPlaying ? await pauseSong() : await playSong(progress, setProgress)
  }, [progress, isPlaying])

  return (
    <ThemedView className="flex-1 w-full h-full px-5 ios:pt-5 android:pb-5">
      <View className="m-0">
        <View className="flex-row items-center justify-between ios:py-4 android:pb-4">
          <Pressable onPress={onPress}>
            <Icon name="chevron-down" color={iconColor} size={24} />
          </Pressable>
          <View>
            <ThemedText>{currentSong?.artistName}</ThemedText>
          </View>
          <SendButton
            track={currentSong!}
            href={`${segments[0]}/${segments[1]}/send-song`}
            onPress={onPress}
          />
        </View>
        <Image
          source={{
            uri: currentSong?.albumImage,
          }}
          style={{ height: screenWidth - 60 }}
          className="my-4 w-full self-center"
        />
        <View className="flex-row justify-between items-center">
          <View className="w-[75%]">
            <View className="flex-row items-center">
              <ThemedText
                className="text-xl font-semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentSong?.name}
              </ThemedText>
              <View className="ml-1.5">
                <SpotifyLink uri={currentSong?.spotifyUri!} size={20} />
              </View>
            </View>
            <ThemedText className="text-gray-500 dark:text-neutral-400">
              {currentSong?.artistName}
            </ThemedText>
          </View>
          <View className="flex-row items-center gap-x-3.5">
            <View>
              <TrackHistory
                onPress={handleGoToSongHistory}
                history={currentSong?.history || []}
              />
            </View>
            <View>
              <LikeButton size={30} />
            </View>
          </View>
        </View>
        <View className="ios:my-3 android:my-5">
          <ProgressBar
            progress={progress}
            duration={currentSong?.durationMs!}
            onSlideEnd={handleOnSeekEnd}
          />
        </View>
        <View className="flex-row justify-evenly items-center">
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={handlePlayPreviousSong}
          >
            <Ionicons
              name="play-skip-back-sharp"
              color={playButtonsColor}
              size={50}
            />
          </Pressable>
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={handleTogglePlay}
          >
            {isPlaying ? (
              <Ionicons
                name="pause-circle-sharp"
                color={playButtonsColor}
                size={90}
              />
            ) : (
              <Ionicons
                name="play-circle-sharp"
                color={playButtonsColor}
                size={90}
              />
            )}
          </Pressable>
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={handlePlayNextSong}
          >
            <Ionicons
              name="play-skip-forward-sharp"
              color={playButtonsColor}
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
