import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query"
import { fetchUserProfile } from "../endpoints/user"
import useAuth from "@/hooks/auth/useAuth"
import {
  fetchUserDiscoverWeeklyPlaylists,
  fetchUserTracksByType,
  fetchWildfireWeekly,
} from "../endpoints/user-tracks"
import { TrackType } from "@/lib/types/user-track"

const isValidTrackType = (trackType: any): trackType is TrackType => {
  if (!trackType) return false
  return Object.values(TrackType).includes(trackType)
}

export const userTracksQueryKeys = {
  all: ["userTracks"] as const,
  playlists: (userId: string, trackType: TrackType) =>
    [...userTracksQueryKeys.all, "playlists", userId, trackType] as const,
  getDiscoverWeeklyPlaylists: (userId: string) =>
    [...userTracksQueryKeys.all, "discoverPlaylists", userId] as const,
  wildfireWeekly: (userId: string) =>
    [...userTracksQueryKeys.all, "wildfireWeekly", userId] as const,
}

export const useFetchUserTracksByType = (
  userId: string,
  trackType: TrackType,
  options: { limit: number }
) => {
  return useInfiniteQuery({
    queryKey: userTracksQueryKeys.playlists(userId, trackType),
    queryFn: (pageParam) =>
      fetchUserTracksByType(userId, trackType, {
        page: pageParam.pageParam,
        limit: options.limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length === 0 ? null : lastPageParam + 1
    },
    staleTime: 60 * 5 * 1000,
    enabled: !!userId && !!trackType && isValidTrackType(trackType),
  })
}

export const useFetchWildfireWeeklyQuery = (userId: string) => {
  return useQuery({
    queryKey: userTracksQueryKeys.wildfireWeekly(userId),
    queryFn: () => fetchWildfireWeekly(userId),
    placeholderData: keepPreviousData,
    enabled: !!userId,
  })
}

export const useFetchUserDiscoverWeeklyPlaylists = () => {
  const { session } = useAuth()
  return useQuery({
    queryKey: userTracksQueryKeys.getDiscoverWeeklyPlaylists(session.user?.id!),
    queryFn: () => fetchUserDiscoverWeeklyPlaylists(),
    placeholderData: keepPreviousData,
  })
}
