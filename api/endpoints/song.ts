import baseApi from "../client"
import { Song, SongWithCombinedHistory } from "@/lib/types/song"

export const sendSong = async (
  toUserIds: string[],
  songData: Partial<Song>,
  historySongIds: string[]
) => {
  const { data } = await baseApi.post<Song[]>("/song/send", {
    toUserIds,
    song: songData,
    historySongIds,
  })
  return data
}

export const fetchSongHistory = async (songId: string) => {
  const { data } = await baseApi.get<Song[]>("/song/history", {
    params: {
      songId,
    },
  })
  return data
}

export const fetchUserLikedSongsIds = async () => {
  const { data } = await baseApi.get<Partial<Song>[]>("/song/likes")
  return data
}

export const likeSong = async (
  songData: Partial<Song>,
  historySongIds: string[]
) => {
  const { data } = await baseApi.post<Partial<Song>>("/song/like", {
    song: songData,
    historySongIds,
  })
  return data
}

export const unlikeSong = async (spotifyId: string) => {
  const { data } = await baseApi.post<{ success: boolean }>("/song/unlike", {
    spotifyId,
  })
  return data
}
