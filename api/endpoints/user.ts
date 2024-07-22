import { User } from "@/lib/types/user"
import baseApi from "../client"

type UserProfileResponse = Partial<User> & { isFollowing: boolean }

export const fetchUserProfile = async (userId: string) => {
  const { data } = await baseApi.get<UserProfileResponse>("/user/profile", {
    params: {
      userId,
    },
  })
  return data
}

export const fetchAuthedUser = async () => {
  const { data } = await baseApi.get<User>("/user/me")
  return data
}
