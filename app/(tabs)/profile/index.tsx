import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Pressable,
} from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Avatar, Button } from "@rneui/themed"
import tw from "twrnc"
import { useAtom } from "jotai"
import { accessTokenAtom } from "@/state/auth"
import { userAtom } from "@/state/user"
import Profile from "@/components/ProfileScreen"

const PLAYLIST_TYPES = [
  "likes",
  "top monthly listens",
  "spotify discover weekly",
]

const ProfileScreen = () => {
  const [user] = useAtom(userAtom)
  const [playlistType, setPlaylistType] = useState(PLAYLIST_TYPES[0])
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)

  return <Profile linkHref="(tabs)/profile/send-song" />
}

export default ProfileScreen
