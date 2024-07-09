import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "../endpoints/user"

export const userQueryKeys = {
  all: ["user"] as const,
  getProfile: (userId: string) =>
    [...userQueryKeys.all, "profile", userId] as const,
}

export const useFetchUserProfileQuery = (
  userId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: userQueryKeys.getProfile(userId),
    queryFn: () => fetchUserProfile(userId),
    staleTime: 60 * 5 * 1000,
    enabled: Boolean(userId) && enabled,
    placeholderData: keepPreviousData,
  })
}
