import { Song } from "@/lib/types/song"
import baseApi from "../client"
import { Conversation } from "@/lib/types/conversation"

export const fetchUserConversations = async () => {
  const { data } = await baseApi.get<Conversation[]>("/conversation/all")
  return data
}

export const fetchConversationById = async (conversationId: string) => {
  const { data } = await baseApi.get<Conversation>(
    `/conversation/${conversationId}`
  )
  return data
}

export const markConversationAsSeen = async (conversationId: string) => {
  const { data } = await baseApi.post<Song[]>("/conversation/seen", {
    conversationId,
  })
  return data
}
