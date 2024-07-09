import { useSearchUsersQuery } from "@/api/queries/search" // Import the query hook
import { User } from "@/lib/types/user"
import { useEffect, useState } from "react"
import usePrevious from "../usePrevious"

export type UserSearchResults = User[] | null

const useSearchUsers = () => {
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [isSearchTriggered, setIsSearchTriggered] = useState(false)

  const {
    data,
    isFetching,
    isLoading,
    isRefetching,
    isError,
    status,
    fetchStatus,
  } = useSearchUsersQuery(
    userSearchQuery,
    isSearchTriggered && !!userSearchQuery
  )

  const previousFetchStatus = usePrevious(fetchStatus)

  const searchUsers = () => {
    setIsSearchTriggered(true)
  }

  useEffect(() => {
    if (
      previousFetchStatus === "fetching" &&
      fetchStatus === "idle" &&
      status === "success"
    ) {
      setIsSearchTriggered(false)
    }
  }, [previousFetchStatus, fetchStatus, status])

  return {
    userSearchQuery,
    setUserSearchQuery,
    searchUsers,
    userSearchResults: data ?? null,
    isSearchingUsers: isLoading || isRefetching || isFetching,
    isError,
  }
}

export default useSearchUsers
