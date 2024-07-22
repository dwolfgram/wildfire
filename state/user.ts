import { User } from "@/lib/types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { atomWithStorage, createJSONStorage, RESET } from "jotai/utils"
import store from "./store"

const storage = createJSONStorage(() => AsyncStorage)

export const userAtom = atomWithStorage<User | undefined>(
  "user",
  undefined,
  // @ts-expect-error types error
  storage,
  { getOnInit: true }
)

export const getUser = () => {
  const { get } = store
  return get(userAtom)
}

export const setUser = async (user: User | undefined | typeof RESET) => {
  const { set } = store
  await set(userAtom, user)
}
