import { View, Text, Pressable, useColorScheme } from "react-native"
import React from "react"
import { useFetchWildfireWeeklyQuery } from "@/api/queries/user-tracks"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { ThemedText } from "@/components/ThemedText"
import UserTrackList from "@/components/UserTrackList"
import useAuth from "@/hooks/auth/useAuth"
import { PLAYLIST_TYPES } from "@/lib/types/playlist"

const WildfireWeekly = () => {
  const {
    session: { user },
  } = useAuth()
  const {
    data: tracks,
    isLoading,
    refetch: refetchWildfire,
    isRefetching,
  } = useFetchWildfireWeeklyQuery(user?.id ?? "", PLAYLIST_TYPES.wildfire)
  const router = useRouter()
  const colorScheme = useColorScheme()
  return (
    <ThemedSafeAreaView
      edges={{ bottom: "off", top: "maximum" }}
      className="flex-1 h-full"
    >
      <ThemedView className="flex-row items-center justify-between mt-1 px-5">
        <Pressable onPress={() => router.back()} className="min-w-[20px]">
          <Ionicons
            name="chevron-back"
            size={26}
            color={colorScheme === "dark" ? "#FFF" : "#222"}
          />
        </Pressable>
        <ThemedText className="font-semibold text-lg">
          wildfire weekly
        </ThemedText>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <ThemedView className="px-5 h-full flex-1">
        <UserTrackList
          onRefresh={refetchWildfire}
          isRefreshing={isRefetching}
          data={
            tracks
              ? tracks.map((track) => ({
                  ...track,
                  sender: { username: track.user?.username },
                }))
              : []
          }
          linkHref={"(tabs)/home/send-song"}
          isLoading={isLoading}
        />
      </ThemedView>
    </ThemedSafeAreaView>
  )
}

export default WildfireWeekly
