import { useQuery, keepPreviousData } from "@tanstack/react-query"

import { searchSongs, searchUsers } from "../endpoints/search"

const searchQueryKeys = {
  all: ["search"] as const,
  query: (type: string, q: string) =>
    [...searchQueryKeys.all, type, q] as const,
}

export const useSearchTracksQuery = (
  query: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: searchQueryKeys.query("songs", query),
    queryFn: () => searchSongs(query),
    staleTime: 60 * 5 * 1000,
    enabled,
    placeholderData: keepPreviousData,
  })
}

export const useSearchUsersQuery = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: searchQueryKeys.query("users", query),
    queryFn: () => searchUsers(query),
    staleTime: 60 * 5 * 1000,
    enabled,
    placeholderData: keepPreviousData,
  })
}
