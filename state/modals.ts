import { atomWithStorage, createJSONStorage } from "jotai/utils"
import AsyncStorage from "@react-native-async-storage/async-storage"

const storage = createJSONStorage(() => AsyncStorage)

export const hasShownSpotifyWarningModalAtom = atomWithStorage<boolean>(
  "hasShownSpotifyWarningModal",
  false,
  // @ts-expect-error types error
  storage,
  { getOnInit: true }
)
