import { useMutation, useQueryClient } from "@tanstack/react-query"
import { conversationQueryKeys } from "./conversation"
import { sendSong } from "../endpoints/song"
import { Song } from "@/lib/types/song"

export const songQueryKeys = {
  all: ["song"] as const,
}

export const useSendSong = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      toUserIds,
      songData,
      userIdToCredit,
    }: {
      toUserIds: string[]
      songData: Partial<Song>
      userIdToCredit: string
    }) => sendSong(toUserIds, songData, userIdToCredit),
    onSuccess: () => {
      const queryKeys = [conversationQueryKeys.all]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
