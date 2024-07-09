import React, { useState } from "react"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useFetchUserDiscoverWeeklyPlaylists } from "@/api/queries/user-tracks"
import { FlatList, Image, Pressable, View } from "react-native"
import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import tw from "@/lib/tailwind"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "@rneui/themed"
import useSelectDiscoverWeekly from "@/hooks/user/useSelectDiscoverWeekly"

const PlaylistItem = ({
  item: playlist,
  onSelect,
  selectedPlaylistId,
}: {
  item: SimplifiedPlaylist
  onSelect: (id: string) => void
  selectedPlaylistId: string
}) => {
  const isSelected = selectedPlaylistId === playlist.id
  return (
    <Pressable onPress={() => onSelect(playlist.id)}>
      <ThemedView
        className={`mb-3 rounded-md px-3 py-3 ${
          isSelected
            ? "bg-orange-50 dark:bg-orange-900"
            : "bg-gray-50 dark:bg-neutral-800"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-x-2">
            <Image
              source={{ uri: playlist.images?.[0].url }}
              width={60}
              height={60}
            />
            <View className="w-2/3">
              <ThemedText>{playlist.name}</ThemedText>
              <ThemedText
                numberOfLines={2}
                ellipsizeMode="tail"
                className={`text-xs text-gray-600 dark:text-neutral-400 ${
                  isSelected && "dark:text-orange-100"
                }`}
              >
                {playlist.description}
              </ThemedText>
            </View>
          </View>
          <View
            className={`h-[35px] w-[35px] rounded-full items-center justify-center ${
              isSelected ? "bg-orange-600" : "bg-gray-200 dark:bg-neutral-900"
            }`}
          >
            {isSelected && (
              <Ionicons name="checkmark" color={"#FFF"} size={24} />
            )}
          </View>
        </View>
      </ThemedView>
    </Pressable>
  )
}

const ChooseDiscoverWeeklyScreen = () => {
  const { data: playlists } = useFetchUserDiscoverWeeklyPlaylists()
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("")
  const { selectDiscoverWeekly, isLoading } = useSelectDiscoverWeekly()

  const handleSelectedPlaylist = (id: string) => {
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId("")
      return
    }
    setSelectedPlaylistId(id)
  }

  return (
    <ThemedSafeAreaView className="h-full px-5">
      <ThemedView className="items-center mt-1">
        <ThemedText type="defaultSemiBold">discover weekly</ThemedText>
        <ThemedText className="text-sm text-gray-700 text-center dark:text-neutral-300 mt-1">
          we found multiple discover weekly playlists saved to your spotify.
          select which one belongs to you!
        </ThemedText>
      </ThemedView>
      <FlatList
        data={playlists}
        renderItem={(props) => (
          <PlaylistItem
            onSelect={handleSelectedPlaylist}
            selectedPlaylistId={selectedPlaylistId}
            {...props}
          />
        )}
        contentContainerStyle={tw`pt-4`}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <Button
        onPress={() => selectDiscoverWeekly(selectedPlaylistId)}
        buttonStyle={[
          tw`bg-orange-600`,
          tw`py-2.5 rounded-md min-h-[38px] shadow-md`,
        ]}
        titleStyle={[tw`font-semibold text-base`]}
        title="select discover weekly"
        activeOpacity={0.8}
        loading={isLoading}
        disabled={!selectedPlaylistId}
      />
    </ThemedSafeAreaView>
  )
}

export default ChooseDiscoverWeeklyScreen
