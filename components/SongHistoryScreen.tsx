import { View, FlatList, Pressable, useColorScheme, Image } from "react-native"
import React, { useMemo } from "react"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { Link, useLocalSearchParams, useRouter, useSegments } from "expo-router"
import { useFetchSongHistory } from "@/api/queries/song"
import { ThemedView } from "@/components/ThemedView"
import { Ionicons } from "@expo/vector-icons"
import { ThemedText } from "@/components/ThemedText"
import { Song, SongWithCombinedHistory, TrackType } from "@/lib/types/song"
import tw from "@/lib/tailwind"
import { useAtom } from "jotai"
import { currentSongAtom } from "@/state/player"
import Avatar from "./Avatar"
import { User } from "@/lib/types/user"

interface SongHistoryListItemProps {
  item: SongWithCombinedHistory["combinedHistory"][number]
  profileHref: string
}

interface SongHistoryRowProps {
  left: {
    id: string
    pfp: string
    username: string
  }
  right?: {
    id: string
    pfp: string
    username: string
  }
  trackType: TrackType
  profileHref: string
}

const SongHistoryRow = ({
  left,
  right,
  trackType,
  profileHref,
}: SongHistoryRowProps) => (
  <ThemedView
    className={`flex-row items-center border-b border-gray-50 dark:border-neutral-800 py-3 ${
      right ? "justify-between" : "justify-center"
    }`}
  >
    <Link
      href={{ pathname: profileHref, params: { userId: left.id } }}
      asChild
      push
    >
      <Pressable
        className="active:opacity-60 items-center gap-y-1 w-[33%]"
        hitSlop={10}
      >
        <View>
          <Avatar user={left as User} size={40} />
        </View>
        <ThemedText className="text-sm" numberOfLines={1} ellipsizeMode="tail">
          {left.username}
        </ThemedText>
        {!right && (
          <View className="flex-row items-center">
            <Ionicons name="flame" size={14} color={"#ea580c"} />
            <ThemedText className="text-xs ml-0.5 text-orange-600">
              {trackType.toLowerCase().replace("_", " ")}
            </ThemedText>
          </View>
        )}
      </Pressable>
    </Link>
    {right && (
      <>
        <View className="items-center gap-y-0.5 w-[33%]">
          <View className="flex-row items-center gap-x-1">
            <Ionicons name="flame" size={18} color={"#ea580c"} />
            <Ionicons name="arrow-forward" size={18} color={"#ea580c"} />
          </View>
          <ThemedText className="text-xs text-orange-600">
            {trackType.toLowerCase().replace("_", " ")}
          </ThemedText>
        </View>
        <Link
          href={{
            pathname: profileHref,
            params: { userId: right.id },
          }}
          asChild
          push
        >
          <Pressable
            className="active:opacity-60 items-center gap-y-1 w-[33%]"
            hitSlop={10}
          >
            <View>
              <Avatar user={right as User} size={40} />
            </View>
            <ThemedText
              className="text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {right.username}
            </ThemedText>
          </Pressable>
        </Link>
      </>
    )}
  </ThemedView>
)

const SongHistoryListItem = ({
  item,
  profileHref,
}: SongHistoryListItemProps) => {
  console.log(item.name)
  const getLeftRight = () => {
    if (item.trackType === TrackType.SENT_TRACK) {
      return {
        left: {
          id: item.sender?.id!,
          pfp: item.sender?.pfp!,
          username: item.sender?.username!,
        },
        right: {
          id: item.receiver?.id!,
          pfp: item.receiver?.pfp!,
          username: item.receiver?.username!,
        },
      }
    }

    return {
      left: {
        id: item.user?.id!,
        pfp: item.user?.pfp!,
        username: item.user?.username!,
      },
    }
  }

  const layout = getLeftRight()

  return (
    <SongHistoryRow
      left={layout?.left}
      right={layout?.right}
      trackType={item.trackType!}
      profileHref={profileHref}
    />
  )
}

const SongHistoryScreen = ({ profileHref }: { profileHref: string }) => {
  const { songId } = useLocalSearchParams()
  const { data: songWithHistory } = useFetchSongHistory(songId as string)
  const [currentSong] = useAtom(currentSongAtom)
  const hasCurrentSong = useMemo(() => Boolean(currentSong), [currentSong])

  const colorScheme = useColorScheme()
  const router = useRouter()

  const data = songWithHistory || []

  return (
    <ThemedSafeAreaView className="h-full px-5">
      <ThemedView className="flex-row items-center justify-between mt-1">
        <Pressable onPress={() => router.back()} className="min-w-[20px]">
          <Ionicons
            name="chevron-back"
            size={26}
            color={colorScheme === "dark" ? "#FFF" : "#222"}
          />
        </Pressable>
        <ThemedText className="font-semibold text-lg">song history</ThemedText>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <FlatList
        data={data}
        contentContainerStyle={[
          tw`pt-2`,
          hasCurrentSong && { paddingBottom: 70 },
        ]}
        renderItem={(props) => (
          <SongHistoryListItem profileHref={profileHref} {...props} />
        )}
        keyExtractor={(item) => item.id!}
        showsVerticalScrollIndicator={false}
      />
    </ThemedSafeAreaView>
  )
}

export default SongHistoryScreen
