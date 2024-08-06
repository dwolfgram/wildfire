import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ThemedView } from "./ThemedView"
import { Button } from "@rneui/themed"
import { ThemedText } from "./ThemedText"
import tw from "twrnc"
import { Link, useLocalSearchParams, usePathname, useRouter } from "expo-router"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { Ionicons } from "@expo/vector-icons"
import { ThemedSafeAreaView } from "./ThemedSafeAreaView"
import { FollowListTypes } from "./FollowListScreen"
import UserTrackList from "./UserTrackList"
import { useFollowUser, useUnfollowUser } from "@/api/queries/follow"
import { useFetchUserProfileQuery } from "@/api/queries/user"
import {
  useFetchUserTracksByType,
  useFetchWildfireWeeklyQuery,
} from "@/api/queries/user-tracks"
import { Song, TrackType } from "@/lib/types/song"
import useAuth from "@/hooks/auth/useAuth"
import Avatar from "./Avatar"
import { User } from "@/lib/types/user"
import { FlashList } from "@shopify/flash-list"

interface ProfileScreenProps {
  linkHref: string
}

enum PLAYLIST_TYPES {
  "likes" = "likes",
  "top" = "top monthly listens",
  "discover" = "spotify discover weekly",
  "wildfire" = "wildfire weekly",
}

const trackTypesFromPlaylistTypes: any = {
  [PLAYLIST_TYPES.likes]: TrackType.SAVED_TRACK,
  [PLAYLIST_TYPES.top]: TrackType.TOP_LISTEN,
  [PLAYLIST_TYPES.discover]: TrackType.DISCOVER_WEEKLY,
}

const ProfileScreen = ({ linkHref }: ProfileScreenProps) => {
  const flatListRef = useRef<FlashList<Song>>(null)
  const colorScheme = useColorScheme()
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [playlistType, setPlaylistType] = useState(PLAYLIST_TYPES.likes)
  const [user] = useAtom(userAtom)
  const isMe = userId === user?.id || !userId
  const { signOut } = useAuth()

  const router = useRouter()
  const path = usePathname()

  const {
    data: userProfile,
    isFetching: isLoadingProfile,
    refetch: refetchProfile,
    isRefetching: isRefetchingProfile,
  } = useFetchUserProfileQuery((userId || user?.id) ?? "")
  const { mutateAsync: followUser, isPending: isFollowInProgress } =
    useFollowUser()
  const { mutateAsync: unfollowUser, isPending: isUnfollowInProgress } =
    useUnfollowUser()
  const {
    data: userTracks,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchTracks,
    isRefetching: isRefetchingTracks,
  } = useFetchUserTracksByType(
    userId || user?.id!,
    trackTypesFromPlaylistTypes[playlistType],
    { limit: 20 }
  )
  const { data: wildfireTracks, isLoading: isLoadingWildfireWeekly } =
    useFetchWildfireWeeklyQuery(userId || user?.id!)

  const handleScrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
  }

  const handleButtonPress = useCallback(async () => {
    if (userProfile?.isFollowing) {
      await unfollowUser(userId!)
    } else {
      await followUser(userId!)
    }
  }, [userId, userProfile?.isFollowing, followUser, unfollowUser])

  const handleRefresh = async () => {
    await refetchProfile()
    await refetchTracks()
  }

  return (
    <ThemedSafeAreaView
      edges={{ bottom: "off", top: "maximum" }}
      className="h-full"
    >
      <ThemedView className="flex-row items-center justify-between mt-1 px-5">
        <Pressable onPress={() => router.back()} className="min-w-[20px]">
          {userId && (
            <Ionicons
              name="chevron-back"
              size={26}
              color={colorScheme === "dark" ? "#FFF" : "#222"}
            />
          )}
        </Pressable>
        <Pressable onPress={handleScrollToTop}>
          <ThemedText className="font-semibold text-lg">
            {userProfile?.username ? `@${userProfile?.username}` : ""}
          </ThemedText>
        </Pressable>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <ThemedView className="px-5 h-full flex-1">
        <UserTrackList
          data={
            (playlistType === PLAYLIST_TYPES.wildfire
              ? wildfireTracks
              : userTracks?.pages.flatMap((page) => page)) || []
          }
          ref={flatListRef}
          isLoading={isLoading}
          linkHref={linkHref}
          onRefresh={handleRefresh}
          isRefreshing={isRefetchingProfile || isRefetchingTracks}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
          onEndReachedThreshold={0.5}
          footer={
            isFetchingNextPage ? (
              <ActivityIndicator className="mt-3" size="small" />
            ) : undefined
          }
          header={
            <>
              <ThemedView className="pb-3 border-b border-gray-100 dark:border-neutral-800">
                <ThemedView className="items-center justify-center mt-3">
                  <Avatar user={userProfile as User} size={55} />
                  <ThemedText className="text-base font-medium mt-2">
                    {userProfile?.displayName?.toLowerCase()}
                  </ThemedText>
                  <ThemedView className="flex-row items-center mt-2">
                    <Link
                      href={{
                        pathname: `${path}/follow-list`,
                        params: {
                          type: FollowListTypes.followers,
                          userId: userId || user?.id!,
                        },
                      }}
                      push
                      asChild
                    >
                      <Pressable>
                        <ThemedView className="flex-row items-center mr-4 gap-x-1">
                          <ThemedText className="text-base font-semibold">
                            {userProfile?._count?.followers}
                          </ThemedText>
                          <ThemedText className="text-sm">followers</ThemedText>
                        </ThemedView>
                      </Pressable>
                    </Link>
                    <Link
                      href={{
                        pathname: `${path}/follow-list`,
                        params: {
                          type: FollowListTypes.following,
                          userId: userId || user?.id!,
                        },
                      }}
                      push
                      asChild
                    >
                      <Pressable>
                        <ThemedView className="flex-row items-center gap-x-1">
                          <ThemedText className="text-base font-semibold">
                            {userProfile?._count?.following}
                          </ThemedText>
                          <ThemedText className="text-sm">following</ThemedText>
                        </ThemedView>
                      </Pressable>
                    </Link>
                  </ThemedView>
                </ThemedView>
                <Button
                  onPress={isMe ? signOut : handleButtonPress}
                  containerStyle={tw`mt-4`}
                  buttonStyle={[
                    userProfile?.isFollowing
                      ? tw`bg-gray-100`
                      : tw`bg-orange-600`,
                    tw`py-1 rounded-md min-h-[38px]`,
                  ]}
                  titleStyle={[
                    userProfile?.isFollowing && tw`text-gray-800`,
                    tw`font-semibold text-base`,
                  ]}
                  title={
                    isMe
                      ? "sign out"
                      : userProfile?.isFollowing
                      ? "unfollow"
                      : "follow"
                  }
                  activeOpacity={0.8}
                  loading={
                    isFollowInProgress ||
                    isUnfollowInProgress ||
                    isLoadingProfile
                  }
                  loadingProps={{
                    color: colorScheme === "dark" ? "#eee" : "#000",
                  }}
                  disabledStyle={{
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#f9fafb",
                  }}
                  disabledTitleStyle={{
                    color: colorScheme === "dark" ? "#999" : "#aab4bd",
                  }}
                  disabled={
                    isFollowInProgress ||
                    isUnfollowInProgress ||
                    isLoadingProfile
                  }
                />
              </ThemedView>
              <ThemedView className="mt-3">
                <ScrollView
                  contentContainerStyle={tw`gap-1`}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                >
                  {Object.values(PLAYLIST_TYPES).map((type) => {
                    const selected = playlistType === type
                    const selectedTitleStyles =
                      "text-orange-600 dark:text-orange-600"
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setPlaylistType(type)}
                        className={`rounded-md px-3 border-gray-200 border dark:border-neutral-800 h-[30px] justify-center active:opacity-60`}
                      >
                        <Text
                          className={`text-sm font-medium text-black dark:text-white ${
                            selected && selectedTitleStyles
                          }`}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    )
                  })}
                </ScrollView>
              </ThemedView>
            </>
          }
        />
      </ThemedView>
    </ThemedSafeAreaView>
  )
}

export default ProfileScreen
