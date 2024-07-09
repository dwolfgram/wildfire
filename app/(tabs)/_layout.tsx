import { Redirect, Stack, Tabs } from "expo-router"
import React from "react"

import { TabBarIcon } from "@/components/navigation/TabBarIcon"
import useAuth from "@/hooks/auth/useAuth"
import { View } from "react-native"
import Player from "@/components/Player"
import { TAB_BAR_HEIGHT } from "@/constants/tabBar"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAtom } from "jotai"
import { currentSongAtom } from "@/state/player"

export default function TabLayout() {
  const { isSignedIn, session } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const [currentSong] = useAtom(currentSongAtom)

  if (!isSignedIn) {
    return <Redirect href="(auth)" />
  }

  if (!session.user?.username) {
    return <Redirect href="(auth)/username" />
  }

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarLabel: () => null,
          tabBarActiveTintColor: "#ea580c",
          tabBarInactiveTintColor: "#9ca3af",
          headerShown: false,
          tabBarStyle: {
            height: TAB_BAR_HEIGHT + bottom,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "wildfire",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"flame-sharp"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "search",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"search"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={"person-circle-sharp"} color={color} />
            ),
          }}
        />
      </Tabs>
      {currentSong && <Player />}
    </View>
  )
}
