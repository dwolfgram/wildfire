import React from "react"
import { TouchableOpacity, Linking, StyleSheet } from "react-native"
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
      style={{ width: size - 1, height: size - 1 }}
      className="bg-[#191414] items-center justify-center rounded-full overflow-hidden"
      onPress={openSpotify}
    >
      <FontAwesome5 name="spotify" size={size} color="#1DB954" />
    </TouchableOpacity>
  )
}

export default SpotifyLink
