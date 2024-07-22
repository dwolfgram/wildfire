import * as SecureStore from "expo-secure-store"

export const secureStorage = {
  getItem: async (key: string) => {
    try {
      const value = await SecureStore.getItemAsync(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error getting item from SecureStore", error)
      return null
    }
  },
  setItem: async (key: string, value: unknown) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error setting item in SecureStore", error)
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (error) {
      console.error("Error removing item from SecureStore", error)
    }
  },
}
