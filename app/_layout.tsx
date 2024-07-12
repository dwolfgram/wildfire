import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { Provider as JotaiProvider, useAtom } from "jotai"
import { useFonts } from "expo-font"
import { ErrorBoundaryProps, Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import "react-native-reanimated"
import { useColorScheme } from "@/hooks/useColorScheme"
import store from "@/state/store"
import { useDeviceContext } from "twrnc"
import tw from "@/lib/tailwind"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { isPlayingAtom } from "@/state/player"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import Toast from "react-native-toast-message"
import { toastConfig } from "@/lib/toast"
import TrackPlayer from "react-native-track-player"
import TrackPlayerService from "@/lib/service"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

TrackPlayer.registerPlaybackService(() => TrackPlayerService)

export default function RootLayout() {
  useDeviceContext(tw)
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    KArcade: require("../assets/fonts/ka1.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, animation: "none" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
      <Toast config={toastConfig} />
    </JotaiProvider>
  )
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <ThemedView style={{ flex: 1, backgroundColor: "red" }}>
      <ThemedText>{props.error.message}</ThemedText>
      <ThemedText onPress={props.retry}>Try Again?</ThemedText>
    </ThemedView>
  )
}
