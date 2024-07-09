import baseApi from "@/api/client"
import { User } from "@/lib/types/user"
import { userAtom } from "@/state/user"
import { usernameValidationRules } from "@/utils/usernameValidation"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"

const useCreateUsername = () => {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [user, setUser] = useAtom(userAtom)

  function validateUsername(value: string): boolean {
    for (const rule of usernameValidationRules) {
      if (!rule.check(value)) {
        setError(rule.message)
        return false
      }
    }
    setError("")
    return true
  }

  const createUsername = useCallback(async () => {
    try {
      if (!validateUsername(username)) {
        return
      }
      const { data } = await baseApi.patch<User>("/user/update", {
        username,
      })
      setUser({
        ...user,
        ...data,
      })
    } catch (err) {
      console.log("error updating username", err)
    }
  }, [username])

  useEffect(() => {
    // reset error after typing
    if (!username || error) {
      setError("")
    }
  }, [username])

  return {
    username,
    createUsername,
    setUsername,
    error,
  }
}

export default useCreateUsername
