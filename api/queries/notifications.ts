import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query"

import {
  fetchUnreadNotificationCount,
  fetchUserNotifications,
  markNotificationsAsSeen,
} from "../endpoints/notifications"

export const notificationQueryKeys = {
  all: ["notification"] as const,
  getUnreadCount: () => [...notificationQueryKeys.all, "unread"] as const,
  getUserNotifications: () => [...notificationQueryKeys.all, "user"] as const,
}

export const useFetchUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationQueryKeys.getUnreadCount(),
    queryFn: () => fetchUnreadNotificationCount(),
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export const useFetchUsersNotifications = ({ limit }: { limit: number }) => {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.getUserNotifications(),
    queryFn: (pageParam) => fetchUserNotifications(pageParam.pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.length === 0 ? null : lastPageParam + 1
    },
    staleTime: 60 * 5 * 1000,
  })
}

export const useMarkNotificationsAsSeen = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => markNotificationsAsSeen(),
    onSuccess: () => {
      const queryKeys = [notificationQueryKeys.getUnreadCount()]
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
  })
}
