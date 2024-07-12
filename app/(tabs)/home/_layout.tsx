import { Stack } from "expo-router"

export default function HomeTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="conversation" options={{ headerShown: false }} />
      <Stack.Screen name="wildfire-weekly" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="send-song"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  )
}
