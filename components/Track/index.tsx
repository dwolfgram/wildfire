import { View, Text, Image, TouchableOpacity } from "react-native"
import React from "react"
import { Song } from "@/lib/types/song"
import { UserTrack } from "@/lib/types/user-track"
import { ThemedView } from "../ThemedView"
import AlbumArt from "./AlbumArt"
import TrackName from "./TrackName"
import ArtistName from "./ArtistName"
import SendButton from "../SendButton"
import { Ionicons } from "@expo/vector-icons"

interface TrackProps {
  track: Partial<Song> & Partial<UserTrack>
  sendSongHref: string
  userId?: string
  onPress?: () => void
}

const Track = ({ track, userId, sendSongHref, onPress }: TrackProps) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <ThemedView className="flex-row items-center justify-between border-b border-gray-50 dark:border-neutral-800 py-1.5">
        <ThemedView className="flex-row items-center gap-x-3">
          <ThemedView>
            <AlbumArt
              spotifyUri={track.spotifyUri ?? ""}
              uri={track.albumImage ?? ""}
            />
          </ThemedView>
          <ThemedView className="w-[200px]">
            <TrackName
              name={track.name ?? ""}
              spotifyUri={track.spotifyUri ?? ""}
            />
            <ArtistName
              artistName={track.artistName ?? ""}
              senderUsername={track.sender?.username}
            />
          </ThemedView>
          {track.history && track.history?.length > 1 && (
            <ThemedView className="relative mr-5">
              <Image
                className="rounded-full"
                source={{
                  uri: track.history[track.history.length - 2]?.sender?.pfp,
                }}
                height={20}
                width={20}
              />
              <View className="p-[1px] rounded-full absolute bottom-[-5px] right-[-1px] bg-white">
                <Ionicons name="flame-sharp" color={"#ea580c"} size={12} />
              </View>
            </ThemedView>
          )}
        </ThemedView>
        <SendButton track={track} userId={userId} href={sendSongHref} />
      </ThemedView>
    </TouchableOpacity>
  )
}

export default Track
