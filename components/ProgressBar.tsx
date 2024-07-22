import React from "react"
import { View, useColorScheme } from "react-native"
import Slider from "@react-native-community/slider"
import { ThemedText } from "./ThemedText"

function display(seconds: number) {
  const format = (val: number) => `0${Math.floor(val)}`.slice(-2)
  const minutes = (seconds % 3600) / 60
  return [minutes, seconds % 60].map(format).join(":")
}

interface ProgressBarProps {
  progress: number
  duration: number
  onSlideEnd?: (duration: number) => void
  onValueChange?: (duration: number) => void
  onSlideStart?: () => void
  showTimes?: boolean
}

const ProgressBar = ({
  progress,
  duration,
  onSlideEnd,
  onValueChange,
  onSlideStart,
  showTimes = true,
}: ProgressBarProps) => {
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === "dark"

  const handleStartSeek = () => {
    onSlideStart && onSlideStart()
  }

  const handleEndSeek = (value: number) => {
    onSlideEnd && onSlideEnd(value)
  }

  const remainingTime = duration - progress

  return (
    <View className="w-full">
      <Slider
        step={1000}
        lowerLimit={0}
        upperLimit={duration - 2000}
        style={{ height: 5 }}
        value={progress}
        minimumValue={0}
        maximumValue={duration - 2000}
        onSlidingStart={handleStartSeek}
        onValueChange={onValueChange}
        onSlidingComplete={handleEndSeek}
        minimumTrackTintColor={isDarkMode ? "#FFF" : "black"}
        maximumTrackTintColor={isDarkMode ? "#444" : "#E5E7EB"}
        thumbTintColor={isDarkMode ? "#fff" : "#000"}
        tapToSeek={false}
      />
      {showTimes && (
        <View className="flex-row justify-between">
          <ThemedText className="text-gray-500 dark:text-neutral-400">
            {display(progress / 1000)}
          </ThemedText>
          <ThemedText className="text-gray-500 dark:text-neutral-400">
            -{display(remainingTime / 1000)}
          </ThemedText>
        </View>
      )}
    </View>
  )
}

export default ProgressBar
