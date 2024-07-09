import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import Slider from "@react-native-community/slider"
import { ThemedText } from "./ThemedText"

const formatTime = (timeMs: number) => {
  const totalSeconds = Math.floor(timeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

interface ProgressBarProps {
  duration: number
  position: number
  onSeek: (duration: number) => void
}

const ProgressBar = ({ duration, position, onSeek }: ProgressBarProps) => {
  const remainingTime = duration - position

  return (
    <View className="w-full px-4">
      <Slider
        className="w-full h-[10px]"
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onValueChange={(value) => null}
        onSlidingComplete={onSeek}
        minimumTrackTintColor="black"
        maximumTrackTintColor="#E5E7EB"
        thumbTintColor="black"
      />
      <View className="flex-row justify-between">
        <ThemedText>{formatTime(position)}</ThemedText>
        <ThemedText>-{formatTime(remainingTime)}</ThemedText>
      </View>
    </View>
  )
}

export default ProgressBar
