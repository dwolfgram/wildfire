import { View, Text, AppState, AppStateStatus } from "react-native"
import React, { useEffect, useState } from "react"
import MiniPlayer from "./mini-player"
import Modal from "react-native-modal"
import FullScreenPlayer from "./full-screen"
import { ThemedView } from "../ThemedView"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TAB_BAR_HEIGHT } from "@/constants/tabBar"
import useProgress from "@/hooks/player/useProgress"
import {
  remote as SpotifyRemote,
  PlayerState,
} from "react-native-spotify-remote"
import { useAtom } from "jotai"
import { isPlayingAtom, queueAtom } from "@/state/player"

const Player = () => {
  const { progress, setProgress } = useProgress()
  const { bottom } = useSafeAreaInsets()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [_, setIsPlaying] = useAtom(isPlayingAtom)

  const handleTogglePlayer = () => {
    setIsModalOpen((prev) => !prev)
  }

  const handleRemoteConnected = () => console.log("REMOTE CONNECTED!")
  const handleRemoteDisconnected = () => {
    setIsPlaying(false)
    console.log("REMOTE DISCONNECTED!")
  }

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        console.log("CLOSING!")
      }
      if (nextAppState === "active") {
        console.log("JK ACTIVE BOI")
      }
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    )
    console.log("Subscribing!")

    // Cleanup the subscription on unmount
    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    const remoteConnectedListener = SpotifyRemote.addListener(
      "remoteConnected",
      handleRemoteConnected
    )
    const remoteDisconnectedListener = SpotifyRemote.addListener(
      "remoteDisconnected",
      handleRemoteDisconnected
    )
    const playerStateListener = SpotifyRemote.addListener(
      "playerStateChanged",
      async (data: PlayerState) => {
        // @ts-ignore
        setIsPlaying(!data[0].isPaused)
      }
    )

    return () => {
      remoteConnectedListener.remove()
      remoteDisconnectedListener.remove()
      playerStateListener.remove()
    }
  }, [])

  return (
    <>
      <View
        style={{ bottom: TAB_BAR_HEIGHT + bottom + 10 }}
        className="absolute w-full"
      >
        <MiniPlayer
          progress={progress}
          setProgress={setProgress}
          onPress={handleTogglePlayer}
        />
      </View>
      <Modal
        isVisible={isModalOpen}
        onBackButtonPress={() => setIsModalOpen(false)}
        hasBackdrop={true}
        customBackdrop={<ThemedView className="h-full w-full" />}
        backdropOpacity={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={180}
        swipeDirection={["down"]}
        swipeThreshold={100}
        animationOutTiming={180}
        animationInTiming={180}
        onSwipeComplete={() => setIsModalOpen(false)}
        className="w-full h-full self-center p-0"
      >
        <FullScreenPlayer
          progress={progress}
          setProgress={setProgress}
          onPress={handleTogglePlayer}
        />
      </Modal>
    </>
  )
}

export default Player
