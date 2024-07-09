import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
} from "../endpoints/follow"
import useAuth from "@/hooks/auth/useAuth"
import { userQueryKeys } from "./user"

const followQueryKeys = {
  all: ["follow"] as const,
  getFollowers: (userId: string) =>
    [...followQueryKeys.all, "followers", userId] as const,
  getFollowing: (userId: string) =>
    [...followQueryKeys.all, "following", userId] as const,
}

export const useFetchFollowersQuery = (
  userId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: followQueryKeys.getFollowers(userId),
    queryFn: () => fetchFollowers(userId),
    staleTime: 60 * 5 * 1000,
    enabled: Boolean(userId) && enabled,
    placeholderData: keepPreviousData,
  })
}

export const useFetchFollowingQuery = (
  userId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: followQueryKeys.getFollowing(userId),
    queryFn: () => fetchFollowing(userId),
    staleTime: 60 * 5 * 1000,
    enabled: Boolean(userId) && enabled,
    placeholderData: keepPreviousData,
  })
}

export const useFollowUser = () => {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_, userId) => {
      const authUserId = session.user?.id!
      const queryKeys = [
        followQueryKeys.getFollowing(userId),
        followQueryKeys.getFollowers(userId),
        followQueryKeys.getFollowers(authUserId),
        followQueryKeys.getFollowing(authUserId),
        userQueryKeys.getProfile(userId),
        userQueryKeys.getProfile(authUserId),
      ]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}

export const useUnfollowUser = () => {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      const authUserId = session.user?.id!
      const queryKeys = [
        followQueryKeys.getFollowing(userId),
        followQueryKeys.getFollowers(userId),
        followQueryKeys.getFollowers(authUserId),
        followQueryKeys.getFollowing(authUserId),
        userQueryKeys.getProfile(userId),
        userQueryKeys.getProfile(authUserId),
      ]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
