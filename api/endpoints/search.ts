import { SpotifyTrack } from "@/lib/types/spotify-track"
import baseApi from "../client"
import { User } from "@/lib/types/user"

interface SpotifyTrackSearchResponse {
  tracks: {
    href: string
    items: SpotifyTrack[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }
}

export const searchSongs = async (query: string) => {
  const { data } = await baseApi.get<SpotifyTrackSearchResponse>(
    "/search/tracks",
    {
      params: {
        query,
      },
    }
  )
  return data
}

export const searchUsers = async (query: string) => {
  const { data } = await baseApi.get<User[]>("/search/users", {
    params: {
      query,
    },
  })
  return data
}
