import { View, Text } from "react-native"
import React, { useEffect } from "react"
import Modal from "react-native-modal"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import tw from "@/lib/tailwind"
import { Button } from "@rneui/themed"
import { useSetAtom } from "jotai"
import { hasShownSpotifyWarningModalAtom } from "@/state/modals"

interface SpotifyWarningModalProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
}

const SpotifyWarningModal = ({
  isOpen,
  setIsOpen,
}: SpotifyWarningModalProps) => {
  const setHasShownSpotifyWarningModalAtom = useSetAtom(
    hasShownSpotifyWarningModalAtom
  )

  useEffect(() => {
    if (isOpen) {
      setHasShownSpotifyWarningModalAtom(true)
    }
  }, [isOpen])

  return (
    <View>
      <Modal
        isVisible={isOpen}
        onBackButtonPress={() => setIsOpen(false)}
        hasBackdrop={true}
        onBackdropPress={() => setIsOpen(false)}
        swipeDirection={["down"]}
        swipeThreshold={100}
        animationOutTiming={180}
        animationInTiming={180}
        onSwipeComplete={() => setIsOpen(false)}
      >
        <View className="w-full h-[300px] justify-between rounded-md p-4 bg-gray-50 dark:bg-neutral-800">
          <View>
            <ThemedText className="font-semibold text-xl dark:text-white">
              important info
            </ThemedText>
            <ThemedText className="mt-2 dark:text-gray-300">
              wildfire can't control playback when in the background or your
              phone is locked
            </ThemedText>
            <ThemedText className="mt-2 dark:text-gray-300">
              spotify will take over control of what songs are playing in those
              cases
            </ThemedText>
            <ThemedText className="mt-2 dark:text-gray-300">
              ya lame, sorry :/
            </ThemedText>
          </View>
          <Button
            onPress={() => setIsOpen(false)}
            buttonStyle={[tw`bg-orange-600`, tw`py-1 rounded-md min-h-[38px]`]}
            titleStyle={[tw`font-semibold text-base`]}
            title={"ok"}
            activeOpacity={0.8}
          />
        </View>
      </Modal>
    </View>
  )
}

export default SpotifyWarningModal
