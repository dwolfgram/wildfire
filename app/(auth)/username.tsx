import { Text, TextInput } from "react-native"
import React, { useEffect } from "react"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { Button } from "@rneui/themed"
import tw from "twrnc"
import useCreateUsername from "@/hooks/user/useCreateUsername"
import useAuth from "@/hooks/auth/useAuth"
import { Redirect } from "expo-router"
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView"
import { useTheme } from "@react-navigation/native"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"
import { isSignedInAtom } from "@/state/auth"

const UsernameScreen = () => {
  const theme = useTheme()
  const [user] = useAtom(userAtom)
  const [isSignedIn] = useAtom(isSignedInAtom)
  const { setUsername, createUsername, username, error } = useCreateUsername()

  if (!isSignedIn) {
    return <Redirect href="(auth)" />
  }

  if (isSignedIn && user?.username && !user?.discoverWeeklySelected) {
    return <Redirect href="(auth)/choose-discover-weekly" />
  }

  return (
    <ThemedSafeAreaView className="h-full">
      <ThemedView className="h-[50vh] gap-6 px-10 items-center justify-center">
        <ThemedText type="subtitle">choose a username</ThemedText>
        <ThemedView className="w-full">
          <TextInput
            className="text-base text-black bg-gray-50 dark:bg-neutral-800 dark:text-white  px-4 pb-3 pt-2 text-center rounded-md"
            placeholderTextColor={theme.dark ? "#999" : "#666"}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            spellCheck={false}
            placeholder="username..."
            autoComplete="off"
            autoCorrect={false}
            onSubmitEditing={createUsername}
          />
          {error && <Text className="text-red-600 mt-2">{error}</Text>}
        </ThemedView>
        <ThemedView className="w-full">
          <Button
            onPress={createUsername}
            disabled={!username || Boolean(error)}
            containerStyle={tw`mt-4 w-full`}
            buttonStyle={tw`bg-orange-600 rounded-md py-2`}
            titleStyle={tw`font-semibold text-base`}
            disabledStyle={{
              backgroundColor: theme.dark ? "#333" : "#f9fafb",
            }}
            disabledTitleStyle={{
              color: theme.dark ? "#999" : "#aab4bd",
            }}
            title="done"
            activeOpacity={0.8}
          />
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  )
}

export default UsernameScreen
