import { View, Text, Pressable } from "react-native"
import React from "react"
import { Link } from "expo-router"
import { Song } from "@/lib/types/song"
import { UserTrack } from "@/lib/types/user-track"
import { Ionicons } from "@expo/vector-icons"

interface SendButtonProps {
  track: Partial<Song> & Partial<UserTrack>
  href: string
  size?: number
  userId?: string
}

const SendButton = ({ track, userId, size = 34, href }: SendButtonProps) => {
  return (
    <Link
      href={{
        pathname: href,
        params: {
          song: JSON.stringify(track),
          userIdToCredit: userId,
        },
      }}
      asChild
    >
      <Pressable
        onPress={() => null}
        style={{
          width: size,
          height: size,
        }}
        className="rounded-full bg-orange-600 active:bg-orange-700 pl-0.5 items-center justify-center"
      >
        <Ionicons
          className="relative right-[5px]"
          name="send"
          color="#FFFFFF"
          size={size / 2}
        />
      </Pressable>
    </Link>
  )
}

export default SendButton
