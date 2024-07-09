import useAuth from "@/hooks/auth/useAuth"
import { Redirect, Stack } from "expo-router"

export default function AuthLayout() {
  const { isSignedIn, session } = useAuth()

  if (isSignedIn && session.user?.username && session.user.discoverWeeklyId) {
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
