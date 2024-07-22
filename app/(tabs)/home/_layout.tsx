import { fetchSpotifyTrackById } from "@/api/endpoints/player"
import { formatSpotifyTrackToSong } from "@/utils/spotifyTrackToSong"
import { Stack, useRouter } from "expo-router"
import { useShareIntent } from "expo-share-intent"
import { useEffect } from "react"

export default function HomeTabLayout() {
  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntent()
  const router = useRouter()

  const handleShareIntent = async (shareUrl: string) => {
    const spotifyId = shareUrl.split("/").pop()
    if (!spotifyId) return
    const spotifyTrack = await fetchSpotifyTrackById(spotifyId)
    router.push({
      pathname: "(tabs)/home/send-song",
      params: {
        song: JSON.stringify(formatSpotifyTrackToSong(spotifyTrack)),
      },
    })
  }

  useEffect(() => {
    if (hasShareIntent) {
      handleShareIntent(shareIntent.webUrl ?? "")
    }
  }, [hasShareIntent])

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="conversation" options={{ headerShown: false }} />
      <Stack.Screen name="wildfire-weekly" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="song-history" options={{ headerShown: false }} />
      <Stack.Screen
        name="send-song"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  )
}
