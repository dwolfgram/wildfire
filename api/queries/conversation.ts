import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  fetchConversationById,
  fetchUserConversations,
  markConversationAsSeen,
} from "../endpoints/conversation"
import useAuth from "@/hooks/auth/useAuth"

export const conversationQueryKeys = {
  all: ["conversation"] as const,
  getUserConversations: (userId: string) =>
    [...conversationQueryKeys.all, "user", userId] as const,
  getConversationById: (conversationId: string) =>
    [...conversationQueryKeys.all, conversationId] as const,
}

export const useFetchUserConversationsQuery = () => {
  const { session } = useAuth()
  return useQuery({
    queryKey: conversationQueryKeys.getUserConversations(session.user?.id!),
    queryFn: () => fetchUserConversations(),
    staleTime: 60 * 5 * 1000,
    placeholderData: keepPreviousData,
  })
}

export const useFetchConversationByIdQuery = (conversationId: string) => {
  return useQuery({
    queryKey: conversationQueryKeys.getConversationById(conversationId),
    queryFn: () => fetchConversationById(conversationId),
    staleTime: 60 * 5 * 1000,
    placeholderData: keepPreviousData,
    enabled: !!conversationId,
  })
}

export const useMarkConversationAsSeen = () => {
  const queryClient = useQueryClient()
  const { session } = useAuth()
  return useMutation({
    mutationFn: (conversationId: string) =>
      markConversationAsSeen(conversationId),
    onSuccess: (_, conversationId) => {
      const authUserId = session.user?.id!
      const queryKeys = [conversationQueryKeys.getUserConversations(authUserId)]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
