import { View, Text, Image, Pressable } from "react-native"
import React from "react"
import { Song } from "@/lib/types/song"
import { Ionicons } from "@expo/vector-icons"
import Avatar from "../Avatar"

interface TrackHistoryProps {
  history: Song[]
  onPress: () => void
}

const TrackHistory = ({ history, onPress }: TrackHistoryProps) => {
  const lastSongInHistory = history[history.length - 1]
  const userToCredit = lastSongInHistory?.sender || lastSongInHistory?.user

  return (
    lastSongInHistory && (
      <Pressable
        onPress={onPress}
        className="relative active:opacity-60"
        hitSlop={{
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        }}
      >
        <View>
          <Avatar user={userToCredit!} size={24} textSize={12} />
        </View>
        <View className="p-[1px] rounded-full absolute bottom-[-5px] right-[-1px] bg-white">
          <Ionicons name="flame-sharp" color={"#ea580c"} size={12} />
        </View>
      </Pressable>
    )
  )
}

export default TrackHistory
