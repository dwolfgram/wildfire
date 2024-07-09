import { View, Text, Image, FlatList, TextInput, Pressable } from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import tw from "@/lib/tailwind"
import { useTheme } from "@react-navigation/native"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { Button } from "@rneui/themed"
import { Ionicons } from "@expo/vector-icons"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { User } from "@/lib/types/user"
import { Song } from "@/lib/types/song"
import useFuse from "@/hooks/useFuse"
import { useFetchFollowersQuery } from "@/api/queries/follow"
import { FetchFollowersResponse } from "@/api/endpoints/follow"
import { useSendSong } from "@/api/queries/song"

const FollowerItem = ({
  item: user,
  selectedUsers,
  selectUser,
}: {
  item: User
  selectedUsers: string[]
  selectUser: (userId: string) => void
  index: number
}) => {
  const isSelected = selectedUsers.includes(user.id)
  return (
    <ThemedView className="items-center justify-center w-1/3 mb-5">
      <Pressable className="relative" onPress={() => selectUser(user.id)}>
        <Image
          className="rounded-full mb-1.5"
          source={{ uri: user.pfp }}
          height={60}
          width={60}
        />
        {isSelected && (
          <View className="absolute rounded-full bottom-[-3px] right-[-5px] border-[2px] border-white dark:border-neutral-900">
            <ThemedView className=" bg-orange-600 p-0.5 rounded-full">
              <Ionicons name="checkmark-sharp" size={20} color="#fff" />
            </ThemedView>
          </View>
        )}
      </Pressable>
      <ThemedText className="font-normal">{user.username}</ThemedText>
    </ThemedView>
  )
}

const SendSongModal = () => {
  const theme = useTheme()
  const [user] = useAtom(userAtom)
  const { song: songString, userIdToCredit } = useLocalSearchParams()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { mutateAsync: sendSong, isPending: isSending } = useSendSong()
  const {
    data: followers,
    isLoading,
    error,
  } = useFetchFollowersQuery(user?.id ?? "")
  const { filterQuery, setFilterQuery, filterResults } = useFuse<
    FetchFollowersResponse[number]
  >(followers ?? [], ["username"])
  const router = useRouter()

  const song = JSON.parse(songString as string) as Partial<Song>

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    } else {
      setSelectedUsers((prev) => [...prev, userId])
    }
  }

  const handleSendSong = async () => {
    if (!userIdToCredit) {
      console.log("MISSING USER TO CREDIT!")
    }
    const sentSongs = await sendSong({
      toUserIds: selectedUsers,
      songData: song,
      userIdToCredit: userIdToCredit as string,
    })

    if (sentSongs?.length && sentSongs.length > 0) {
      // success toast
      router.back()
    }
  }

  // useEffect(() => {
  //   if (isError) {
  //     console.log("THERES AN ERROR")
  //   }
  // }, [isError])

  return (
    <ThemedSafeAreaView
      edges={{ top: "off", bottom: "maximum" }}
      className="h-full"
    >
      <ThemedView className="border-b border-gray-100 dark:border-neutral-800 pb-3 px-5">
        <View className="self-center flex-row items-center mt-4">
          <Image
            className="mr-2"
            source={{ uri: song.albumImage }}
            width={35}
            height={35}
          />
          <View className="max-w-[200px]">
            <ThemedText
              className="text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {song.name}
            </ThemedText>
            <ThemedText className="text-sm text-gray-600 dark:text-neutral-400">
              {song.artistName}
            </ThemedText>
          </View>
        </View>
        <TextInput
          value={filterQuery}
          onChangeText={setFilterQuery}
          className="w-full mt-3 text-neutral-900 dark:text-white bg-gray-50 dark:bg-neutral-800 px-3 pt-2.5 pb-3 rounded-md text-sm"
          placeholder="filter your followers"
          placeholderTextColor={theme.dark ? "#777" : "#aab4bd"}
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          autoCorrect={false}
        />
      </ThemedView>
      <FlatList
        data={filterResults}
        renderItem={(props) => (
          <FollowerItem
            selectUser={handleSelectUser}
            selectedUsers={selectedUsers}
            {...props}
          />
        )}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pt-4 pb-3`}
        ListEmptyComponent={
          <ThemedView className="items-center justify-center pt-1">
            <ThemedText className="opacity-50">
              {isLoading ? "loading..." : "you have 0 followers to send to"}
            </ThemedText>
          </ThemedView>
        }
        showsVerticalScrollIndicator={false}
      />
      <View className="px-5">
        <Button
          onPress={handleSendSong}
          buttonStyle={[
            tw`bg-orange-600`,
            tw`py-2.5 rounded-md min-h-[38px] shadow-md`,
          ]}
          titleStyle={[tw`font-semibold text-base`]}
          title="send song"
          activeOpacity={0.8}
          loading={isSending}
          disabled={selectedUsers.length === 0 || isSending}
        />
      </View>
    </ThemedSafeAreaView>
  )
}

export default SendSongModal
