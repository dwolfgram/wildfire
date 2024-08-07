import React from "react"
import { ThemedText } from "../ThemedText"

interface ArtistNameProps {
  artistName: string
  senderUsername?: string
}

const ArtistName = ({ artistName, senderUsername }: ArtistNameProps) => {
  return (
    <ThemedText
      numberOfLines={1}
      ellipsizeMode="tail"
      className="text-xs text-gray-600 dark:text-neutral-400"
    >
      {artistName} {senderUsername && `· ${senderUsername}`}
    </ThemedText>
  )
}

export default ArtistName
