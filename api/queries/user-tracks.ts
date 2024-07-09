import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "../endpoints/user"
import useAuth from "@/hooks/auth/useAuth"
import { fetchUserDiscoverWeeklyPlaylists } from "../endpoints/user-tracks"

export const userTracksQueryKeys = {
  all: ["userTracks"] as const,
  getDiscoverWeeklyPlaylists: (userId: string) =>
    [...userTracksQueryKeys.all, "discoverPlaylists", userId] as const,
}

export const useFetchUserDiscoverWeeklyPlaylists = () => {
  const { session } = useAuth()
  return useQuery({
    queryKey: userTracksQueryKeys.getDiscoverWeeklyPlaylists(session.user?.id!),
    queryFn: () => fetchUserDiscoverWeeklyPlaylists(),
    placeholderData: keepPreviousData,
  })
}
