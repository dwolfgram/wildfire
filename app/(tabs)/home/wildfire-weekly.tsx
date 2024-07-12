import { View, Text, Pressable, useColorScheme } from "react-native"
import React from "react"
import { useFetchWildfireWeeklyQuery } from "@/api/queries/user-tracks"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { ThemedText } from "@/components/ThemedText"
import UserTrackList from "@/components/UserTrackList"

const WildfireWeekly = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const { data: tracks, isLoading } = useFetchWildfireWeeklyQuery(userId ?? "")
  const router = useRouter()
  const colorScheme = useColorScheme()

  return (
    <ThemedSafeAreaView className="h-full">
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
      <UserTrackList
        data={tracks!}
        linkHref={"(tabs)/home/send-song"}
        isLoading={isLoading}
      />
    </ThemedSafeAreaView>
  )
}

export default WildfireWeekly
