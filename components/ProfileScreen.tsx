import { Pressable, ScrollView, useColorScheme } from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { ThemedView } from "./ThemedView"
import { Avatar, Button } from "@rneui/themed"
import { ThemedText } from "./ThemedText"
import tw from "twrnc"
import { Link, useLocalSearchParams, usePathname, useRouter } from "expo-router"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { Ionicons } from "@expo/vector-icons"
import { ThemedSafeAreaView } from "./ThemedSafeAreaView"
import { FollowListTypes } from "./FollowListScreen"
import useFetchSavedTracks from "@/hooks/userTracks/useFetchSavedTracks"
import UserTrackList from "./UserTrackList"
import useFetchTopTracks from "@/hooks/userTracks/useFetchTopTracks copy"
import useFetchDiscoverTracks from "@/hooks/userTracks/useFetchDiscoverTracks"
import { useFollowUser, useUnfollowUser } from "@/api/queries/follow"
import { useFetchUserProfileQuery } from "@/api/queries/user"

interface ProfileScreenProps {
  linkHref: string
}

enum PLAYLIST_TYPES {
  "likes" = "likes",
  "top" = "top monthly listens",
  "discover" = "spotify discover weekly",
}

const ProfileScreen = ({ linkHref }: ProfileScreenProps) => {
  const colorScheme = useColorScheme()
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [playlistType, setPlaylistType] = useState(PLAYLIST_TYPES.likes)
  const [user] = useAtom(userAtom)
  const isMe = userId === user?.id || !userId

  const router = useRouter()
  const path = usePathname()

  const { data: userProfile, isFetching: isLoadingProfile } =
    useFetchUserProfileQuery((userId || user?.id) ?? "")
  const { mutateAsync: followUser, isPending: isFollowInProgress } =
    useFollowUser()
  const { mutateAsync: unfollowUser, isPending: isUnfollowInProgress } =
    useUnfollowUser()
  const { fetchSavedTracks, isLoadingSavedTracks, savedTracks } =
    useFetchSavedTracks()
  const { fetchTopTracks, isLoadingTopTracks, topTracks } = useFetchTopTracks()
  const { fetchDiscoverTracks, discoverTracks, isLoadingDiscoverTracks } =
    useFetchDiscoverTracks()

  useEffect(() => {
    if (playlistType === PLAYLIST_TYPES.likes && !savedTracks) {
      fetchSavedTracks(userId || user?.id!)
    } else if (playlistType === PLAYLIST_TYPES.top && !topTracks) {
      fetchTopTracks(userId || user?.id!)
    } else if (playlistType === PLAYLIST_TYPES.discover && !discoverTracks) {
      fetchDiscoverTracks(userId || user?.id!)
    }
  }, [playlistType])

  const handleButtonPress = useCallback(async () => {
    if (userProfile?.isFollowing) {
      await unfollowUser(userId!)
    } else {
      await followUser(userId!)
    }
  }, [userId, userProfile?.isFollowing, followUser, unfollowUser])

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
        <ThemedText className="font-semibold text-lg">
          {userProfile?.username}
        </ThemedText>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      <UserTrackList
        data={
          playlistType === PLAYLIST_TYPES.likes
            ? savedTracks
            : playlistType === PLAYLIST_TYPES.top
            ? topTracks
            : discoverTracks
        }
        isLoading={
          isLoadingSavedTracks || isLoadingDiscoverTracks || isLoadingTopTracks
        }
        linkHref={linkHref}
        header={
          <>
            <ThemedView className="pb-3 border-b border-gray-100 dark:border-neutral-800 px-5">
              <ThemedView className="items-center justify-center mt-3">
                <Avatar size={55} rounded source={{ uri: userProfile?.pfp }} />
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
                onPress={handleButtonPress}
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
                    ? "my profile"
                    : userProfile?.isFollowing
                    ? "unfollow"
                    : "follow"
                }
                activeOpacity={0.8}
                loading={
                  isFollowInProgress || isUnfollowInProgress || isLoadingProfile
                }
                disabled={
                  isMe ||
                  isFollowInProgress ||
                  isUnfollowInProgress ||
                  isLoadingProfile
                }
              />
            </ThemedView>
            <ThemedView className="mt-3">
              <ScrollView
                contentContainerStyle={tw`gap-1 px-5`}
                showsHorizontalScrollIndicator={false}
                horizontal
              >
                {Object.values(PLAYLIST_TYPES).map((type) => {
                  const selected = playlistType === type
                  const selectedTitleStyles = tw`text-orange-600`
                  return (
                    <Button
                      key={type}
                      buttonStyle={[
                        tw`rounded-md px-3 py-0 border-gray-200 border dark:border-neutral-800 h-[30px]`,
                      ]}
                      titleStyle={[
                        tw`text-sm font-medium text-black dark:text-white`,
                        selected && selectedTitleStyles,
                      ]}
                      title={type}
                      type="outline"
                      onPress={() => setPlaylistType(type)}
                    />
                  )
                })}
              </ScrollView>
            </ThemedView>
          </>
        }
      />
    </ThemedSafeAreaView>
  )
}

export default ProfileScreen
