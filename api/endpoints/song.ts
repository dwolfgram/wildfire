import baseApi from "../client"
import { Song } from "@/lib/types/song"

export const sendSong = async (
  toUserIds: string[],
  songData: Partial<Song>,
  userIdToCredit: string
) => {
  const { data } = await baseApi.post<Song[]>("/song/send", {
    toUserIds,
    song: songData,
    userIdToCredit,
  })
  return data
}
