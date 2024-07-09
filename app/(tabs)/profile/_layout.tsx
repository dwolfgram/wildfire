import { Stack } from "expo-router"

export default function ProfileTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="follow-list" options={{ headerShown: false }} />
      <Stack.Screen
        name="send-song"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  )
}
