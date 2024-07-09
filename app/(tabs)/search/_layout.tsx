import { Stack } from "expo-router"

export default function SearchTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="send-song"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  )
}
