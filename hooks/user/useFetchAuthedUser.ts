import { fetchAuthedUser as fetchAuthedUserApi } from "@/api/endpoints/user"
import { userAtom } from "@/state/user"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import useAuth from "../auth/useAuth"

const useFetchAuthedUser = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [_, setUser] = useAtom(userAtom)
  const { isSignedIn } = useAuth()

  const fetchAuthedUser = async () => {
    try {
      const user = await fetchAuthedUserApi()
      setUser(user)
    } catch (err) {
      console.log("Error fetching authed user", err)
    } finally {
      console.log("Not loading anymore")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthedUser()
  }, [isSignedIn])

  return {
    isLoading,
    fetchAuthedUser,
  }
}

export default useFetchAuthedUser
