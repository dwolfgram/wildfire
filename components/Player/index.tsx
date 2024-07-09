import { View, Text } from "react-native"
import React, { useState } from "react"
import MiniPlayer from "./mini-player"
import Modal from "react-native-modal"
import FullScreenPlayer from "./full-screen"
import { ThemedView } from "../ThemedView"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { TAB_BAR_HEIGHT } from "@/constants/tabBar"
import { ThemedSafeAreaView } from "../ThemedSafeAreaView"

const Player = () => {
  const { bottom } = useSafeAreaInsets()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleTogglePlayer = () => {
    setIsModalOpen((prev) => !prev)
  }

  return (
    <>
      <View
        style={{ bottom: TAB_BAR_HEIGHT + bottom + 10 }}
        className="absolute w-full"
      >
        <MiniPlayer onPress={handleTogglePlayer} />
      </View>
      <Modal
        isVisible={isModalOpen}
        onBackButtonPress={() => {
          setIsModalOpen(false)
          return true
        }}
        hasBackdrop={true}
        customBackdrop={<ThemedView className="h-full w-full" />}
        backdropOpacity={1}
        backdropTransitionInTiming={1}
        backdropTransitionOutTiming={180}
        swipeDirection={["down"]}
        swipeThreshold={100}
        animationOutTiming={180}
        animationInTiming={180}
        onSwipeComplete={() => {
          setIsModalOpen(false)
        }}
        className="w-full h-full self-center p-0"
      >
        <FullScreenPlayer onPress={handleTogglePlayer} />
      </Modal>
    </>
  )
}

export default Player
