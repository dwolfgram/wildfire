import {
  View,
  Text,
  Pressable,
  useColorScheme,
  ActivityIndicator,
} from "react-native"
import React, { useCallback, useMemo } from "react"
import { AntDesign } from "@expo/vector-icons"
import { useFetchLikeIds, useLikeSong, useUnlikeSong } from "@/api/queries/song"
import { useAtom } from "jotai"
import { currentSongAtom } from "@/state/player"
import useAuth from "@/hooks/auth/useAuth"
import * as Haptics from "expo-haptics"
import Toast from "react-native-toast-message"

interface LikeButtonProps {
  size?: number
}

const LikeButton = ({ size = 32 }: LikeButtonProps) => {
  const { session } = useAuth()
  const [currentSong] = useAtom(currentSongAtom)
  const { data: likedSongIds, isFetching } = useFetchLikeIds()
  const { mutateAsync: likeSong } = useLikeSong()
  const { mutateAsync: unlikeSong } = useUnlikeSong()

  const colorScheme = useColorScheme()
  const iconColor = colorScheme === "dark" ? "#FFF" : "#d1d5db"

  const isLiked = useMemo(
    () =>
      likedSongIds?.some(
        (likedSong) => likedSong.spotifyId === currentSong?.spotifyId
      ),
    [currentSong, likedSongIds]
  )

  const handleLikeSong = useCallback(async () => {
    const isDBSong = Boolean(currentSong?.id)
    const userId = session.user?.id
    const userDoesOwnSong =
      currentSong?.senderId === userId || currentSong?.userId === userId
    const historySongIds =
      currentSong?.history
        ?.filter(
          (s) =>
            s.senderId !== session.user?.id && s.userId !== session.user?.id
        )
        .map((song) => song.id) || []
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    await likeSong({
      songData: currentSong!,
      historySongIds:
        isDBSong && !userDoesOwnSong
          ? [...historySongIds, currentSong?.id!]
          : historySongIds,
    })
    Toast.show({
      type: "success",
      text1: "liked song successfully",
      text2: "song has been added to your spotify likes",
    })
  }, [currentSong])

  const handleUnlikeSong = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    await unlikeSong(currentSong?.spotifyId!)
    // Toast.show({
    //   type: "success",
    //   text1: "unliked song successfully",
    //   text2: "song has been removed from your spotify likes",
    // })
  }, [currentSong?.spotifyId])

  if (isFetching) {
    return <ActivityIndicator size={32} />
  }

  return isLiked ? (
    <Pressable
      onPress={handleUnlikeSong}
      className="active:opacity-60"
      hitSlop={10}
    >
      <AntDesign name="heart" size={size} color={"#ea580c"} />
    </Pressable>
  ) : (
    <Pressable
      onPress={handleLikeSong}
      className="active:opacity-60"
      hitSlop={10}
    >
      <AntDesign name="hearto" size={size} color={iconColor} />
    </Pressable>
  )
}

export default LikeButton
