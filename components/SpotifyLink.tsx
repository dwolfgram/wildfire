import React from "react"
import { TouchableOpacity, Linking, StyleSheet, View } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"

interface SpotifyLinkProps {
  uri: string
  size: number
}

const SpotifyLink = ({ uri, size }: SpotifyLinkProps) => {
  const openSpotify = async () => {
    try {
      const supported = await Linking.canOpenURL(uri)
      if (supported) {
        await Linking.openURL(uri)
      } else {
        console.log(`Don't know how to open URI: ${uri}`)
      }
    } catch (error) {
      console.error("An error occurred", error)
    }
  }

  return (
    <TouchableOpacity
      className="items-center justify-center"
      onPress={openSpotify}
    >
      <View
        style={{ width: size - 3, height: size - 3 }}
        className="bg-[#191414] top-[2px] rounded-full absolute"
      />
      <FontAwesome5 name="spotify" size={size} color="#1DB954" />
    </TouchableOpacity>
  )
}

export default SpotifyLink
