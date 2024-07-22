import React from "react"
import { View, Image, Pressable, useColorScheme } from "react-native"
import { ThemedText } from "../ThemedText"
import { Ionicons } from "@expo/vector-icons"
import usePlayer from "@/hooks/player/usePlayer"
import LikeButton from "../LikeButton"

const MiniPlayer = ({
  progress,
  setProgress,
  onPress,
}: {
  progress: number
  setProgress: (value: number) => void
  onPress: any
}) => {
  const colorScheme = useColorScheme()
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer()

  return (
    <Pressable
      className="h-full w-[95%] px-3 self-center rounded-lg relative bg-gray-100 dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 active:bg-gray-200 dark:active:bg-neutral-700"
      onPress={onPress}
    >
      <View className="absolute top-[-1px] w-full self-center rounded-full">
        <View className="w-full rounded-full">
          <View className=" w-full self-center bg-gray-200 dark:bg-neutral-700 h-[2px] rounded-full">
            <View
              style={{
                width: `${(progress / currentSong?.durationMs!) * 100}%`,
              }}
              className={`bg-black dark:bg-white h-full rounded-full`}
            />
          </View>
        </View>
      </View>
      <View className="flex-row w-full items-center self-center justify-between py-2.5">
        <View className="flex-row items-center gap-x-2">
          <Image
            source={{ uri: currentSong?.albumImage }}
            height={40}
            width={40}
          />
          <View className="w-[64%]">
            <ThemedText numberOfLines={1} ellipsizeMode="tail" className="">
              {currentSong?.name}
            </ThemedText>
            <ThemedText className="text-gray-500 dark:text-neutral-400 text-sm">
              {currentSong?.artistName}
            </ThemedText>
          </View>
        </View>
        <View className="flex-row items-center gap-x-1.5">
          {/* <LikeButton size={26} /> */}
          <Pressable
            className="opacity-100 active:opacity-60 items-center justify-center"
            onPress={
              isPlaying
                ? pauseSong
                : async () => await playSong(progress, setProgress)
            }
          >
            {isPlaying ? (
              <Ionicons
                name="pause-circle-sharp"
                color={colorScheme === "dark" ? "#fff" : "#222"}
                size={36}
              />
            ) : (
              <Ionicons
                name="play-circle-sharp"
                color={colorScheme === "dark" ? "#fff" : "#222"}
                size={36}
              />
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

export default MiniPlayer
