import { isSignedInAtom } from "@/state/auth"
import { userAtom } from "@/state/user"
import { Redirect, Stack } from "expo-router"
import { useAtom } from "jotai"

export default function AuthLayout() {
  const [user] = useAtom(userAtom)
  const [isSignedIn] = useAtom(isSignedInAtom)

  if (isSignedIn && user?.username && user.discoverWeeklyId) {
    return <Redirect href="(tabs)/home" />
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="username"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="choose-discover-weekly"
        options={{ headerShown: false, animation: "none" }}
      />
    </Stack>
  )
}
