import { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import baseApi from "../client"

export const fetchUserDiscoverWeeklyPlaylists = async () => {
  const { data } = await baseApi.get<SimplifiedPlaylist[]>(
    "/user-tracks/discover-weekly-playlists"
  )
  return data
}
