import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import baseApi from "../client"
import { TrackType, UserTrack } from "@/lib/types/user-track"

interface PageType {
  page: number
  limit: number
}

export const fetchUserTracksByType = async (
  userId: string,
  trackType: TrackType,
  { page = 1, limit = 20 }: PageType
) => {
  const { data } = await baseApi.get<UserTrack[]>(`/user-tracks/${userId}`, {
    params: {
      trackType,
      page,
      limit,
    },
  })
  return data
}

export const fetchUserDiscoverWeeklyPlaylists = async () => {
  const { data } = await baseApi.get<SimplifiedPlaylist[]>(
    "/user-tracks/discover-weekly-playlists"
  )
  return data
}

export const fetchWildfireWeekly = async (userId: string) => {
  const { data } = await baseApi.get<UserTrack[]>(
    "/user-tracks/wildfire-weekly",
    {
      params: {
        userId,
      },
    }
  )
  return data
}
