import { User } from "@/lib/types/user"
import baseApi from "../client"
import { Follow } from "@/lib/types/follow"

export type FetchFollowersResponse = (User & { isFollowingBack: boolean })[]
type FetchFollowingResponse = (User & { isFollowingBack: boolean })[]

export const fetchFollowers = async (userId: string) => {
  const { data } = await baseApi.get<FetchFollowersResponse>("/followers", {
    params: {
      userId,
    },
  })

  return data
}

export const fetchFollowing = async (userId: string) => {
  const { data } = await baseApi.get<FetchFollowingResponse>("/following", {
    params: {
      userId,
    },
  })

  return data
}

export const followUser = async (userId: string) => {
  const { data } = await baseApi.post<Follow>("/follow", {
    userId,
  })
  return data
}

export const unfollowUser = async (userId: string) => {
  const { data } = await baseApi.post<{ success: boolean }>("/unfollow", {
    userId,
  })
  return data
}
