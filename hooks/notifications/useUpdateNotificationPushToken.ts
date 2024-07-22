import baseApi from "@/api/client"
import { User } from "@/lib/types/user"
import { userAtom } from "@/state/user"
import { usernameValidationRules } from "@/utils/usernameValidation"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"

const useUpdateNotificationPushToken = () => {
  const [user, setUser] = useAtom(userAtom)

  const updateUserNotificationToken = useCallback(
    async (notificationToken?: string) => {
      try {
        const { data } = await baseApi.patch<User>("/user/update", {
          notificationToken,
        })
        await setUser({
          ...user,
          ...data,
        })
        return data
      } catch (err) {
        console.log("error updating notificationToken", err)
      }
    },
    []
  )

  return {
    updateUserNotificationToken,
  }
}

export default useUpdateNotificationPushToken
