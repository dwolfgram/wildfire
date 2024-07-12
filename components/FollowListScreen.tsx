import { View, Text, Pressable, useColorScheme } from "react-native"
import React, { useCallback, useEffect, useMemo } from "react"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { useLocalSearchParams, useRouter } from "expo-router"
import FollowList from "@/components/FollowList"
import { Ionicons } from "@expo/vector-icons"

import {
  useFetchFollowersQuery,
  useFetchFollowingQuery,
  useFollowUser,
  useUnfollowUser,
} from "@/api/queries/follow"
import Toast from "react-native-toast-message"

export enum FollowListTypes {
  followers = "followers",
  following = "following",
}

interface FollowListScreenProps {
  linkHref: string
}

const FollowListScreen = ({ linkHref }: FollowListScreenProps) => {
  const colorScheme = useColorScheme()
  const { type, userId } = useLocalSearchParams<{
    type: FollowListTypes
    userId: string
  }>()
  const {
    data: followers = [],
    isLoading: isLoadingFollowers,
    error: followersError,
  } = useFetchFollowersQuery(userId!, type === FollowListTypes.followers)
  const {
    data: followings = [],
    isLoading: isLoadingFollowing,
    error: followingError,
  } = useFetchFollowingQuery(userId!, type === FollowListTypes.following)
  const router = useRouter()

  const { mutateAsync: followUser } = useFollowUser()
  const { mutateAsync: unfollowUser } = useUnfollowUser()

  const handleFollowUnFollow = useCallback(
    async (user: (typeof followers)[number]) => {
      const action = user.isFollowingBack ? unfollowUser : followUser
      await action(user.id)
      user.isFollowingBack = !user.isFollowingBack
    },
    [unfollowUser, followUser]
  )

  useEffect(() => {
    let message = ""
    if (followersError) {
      message = "unable to fetch followers"
    } else {
      message = "uable to fetch following"
    }
    if (followersError || followingError) {
      Toast.show({
        type: "error",
        text1: "error",
        text2: message,
        position: "top",
        topOffset: 54,
        visibilityTime: 5000,
      })
    }
  }, [followersError, followingError])

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
        <ThemedText className="font-semibold text-lg">{type}</ThemedText>
        <ThemedView className="min-w-[20px]"></ThemedView>
      </ThemedView>
      {}
      <FollowList
        data={type === FollowListTypes.followers ? followers : followings}
        onFollowUnfollow={handleFollowUnFollow}
        linkHref={linkHref}
        isLoading={isLoadingFollowers || isLoadingFollowing}
      />
    </ThemedSafeAreaView>
  )
}

export default FollowListScreen
