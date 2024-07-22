import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { conversationQueryKeys } from "./conversation"
import {
  fetchSongHistory,
  fetchUserLikedSongsIds,
  likeSong,
  sendSong,
  unlikeSong,
} from "../endpoints/song"
import { Song, TrackType } from "@/lib/types/song"
import { userTracksQueryKeys } from "./user-tracks"
import useAuth from "@/hooks/auth/useAuth"

export const songQueryKeys = {
  all: ["song"] as const,
  getSongHistory: (songId: string) =>
    [...songQueryKeys.all, "history", songId] as const,
  getUserLikedSongsIds: () => [...songQueryKeys.all, "likeIds"] as const,
}

export const useFetchSongHistory = (songId: string) => {
  return useQuery({
    queryKey: songQueryKeys.getSongHistory(songId),
    queryFn: () => fetchSongHistory(songId),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export const useFetchLikeIds = () => {
  return useQuery({
    queryKey: songQueryKeys.getUserLikedSongsIds(),
    queryFn: () => fetchUserLikedSongsIds(),
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export const useSendSong = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      toUserIds,
      songData,
      historySongIds,
    }: {
      toUserIds: string[]
      songData: Partial<Song>
      historySongIds: string[]
    }) => sendSong(toUserIds, songData, historySongIds),
    onSuccess: (data) => {
      const queryKeys = [
        conversationQueryKeys.all,
        ...data.map((newSong) => songQueryKeys.getSongHistory(newSong.id)),
      ]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}

export const useLikeSong = () => {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  return useMutation({
    mutationFn: ({
      songData,
      historySongIds,
    }: {
      songData: Partial<Song>
      historySongIds: string[]
    }) => likeSong(songData, historySongIds),
    onSuccess: () => {
      const queryKeys = [
        songQueryKeys.getUserLikedSongsIds(),
        userTracksQueryKeys.playlists(session.user?.id!, TrackType.SAVED_TRACK),
      ]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}

export const useUnlikeSong = () => {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  return useMutation({
    mutationFn: (spotifyId: string) => unlikeSong(spotifyId),
    onSuccess: () => {
      const queryKeys = [
        songQueryKeys.getUserLikedSongsIds(),
        userTracksQueryKeys.playlists(session.user?.id!, TrackType.SAVED_TRACK),
      ]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
