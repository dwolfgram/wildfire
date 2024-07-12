import { View, Text } from "react-native"
import React, { useEffect, useState } from "react"
import MiniPlayer from "./mini-player"
import Modal from "react-native-modal"
import FullScreenPlayer from "./full-screen"
import { ThemedView } from "../ThemedView"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TAB_BAR_HEIGHT } from "@/constants/tabBar"
import useProgress from "@/hooks/player/useProgress"
import TrackPlayer, {
  Capability,
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player"

const Player = () => {
  const { progress, setProgress } = useProgress()
  const { bottom } = useSafeAreaInsets()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleTogglePlayer = () => {
    setIsModalOpen((prev) => !prev)
  }

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    console.log(event)
  })

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      })
      console.log("setup boi")
      const state = await TrackPlayer.getPlaybackState()
      console.log(state)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setupPlayer()
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
