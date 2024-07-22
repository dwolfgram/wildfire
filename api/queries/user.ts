import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchAuthedUser, fetchUserProfile } from "../endpoints/user"
import useAuth from "@/hooks/auth/useAuth"

export const userQueryKeys = {
  all: ["user"] as const,
  getProfile: (userId: string) =>
    [...userQueryKeys.all, "profile", userId] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
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

export const useFetchAuthedUserQuery = () => {
  const { isSignedIn } = useAuth()
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: () => fetchAuthedUser(),
    staleTime: 10 * 60 * 1000,
    enabled: isSignedIn,
    placeholderData: keepPreviousData,
  })
}
