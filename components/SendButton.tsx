import { Pressable } from "react-native"
import React from "react"
import { Link } from "expo-router"
import { Song } from "@/lib/types/song"
import { Ionicons } from "@expo/vector-icons"
import useAuth from "@/hooks/auth/useAuth"

interface SendButtonProps {
  track: Partial<Song>
  href: string
  size?: number
  userId?: string
  onPress?: Function
}

const SendButton = ({ track, size = 34, href, onPress }: SendButtonProps) => {
  const { session } = useAuth()
  // songs from spotify search dont have an id
  const isDBSong = Boolean(track.id)
  const userId = session.user?.id
  const userDoesOwnSong = track.senderId === userId || track.userId === userId
  const historySongIds = track.history?.map((song) => song.id) || []

  return (
    <Link
      href={{
        pathname: href,
        params: {
          song: JSON.stringify(track),
          historySongIds:
            isDBSong && !userDoesOwnSong
              ? JSON.stringify([...historySongIds, track.id])
              : undefined,
        },
      }}
      asChild
      push
    >
      <Pressable
        onPress={() => onPress && onPress()}
        style={{
          width: size,
          height: size,
        }}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
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
