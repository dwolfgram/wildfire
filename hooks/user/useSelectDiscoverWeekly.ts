import baseApi from "@/api/client"
import { User } from "@/lib/types/user"
import { userAtom } from "@/state/user"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"

const useSelectDiscoverWeekly = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useAtom(userAtom)

  const selectDiscoverWeekly = useCallback(async (playlistId: string) => {
    try {
      setIsLoading(true)
      if (!playlistId) {
        return
      }
      const { data } = await baseApi.patch<User>("/user/update", {
        discoverWeeklyId: playlistId,
      })
      await setUser({
        ...user,
        ...data,
      })
    } catch (err) {
      console.log("error updating discover weekly", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    selectDiscoverWeekly,
    isLoading,
  }
}

export default useSelectDiscoverWeekly
