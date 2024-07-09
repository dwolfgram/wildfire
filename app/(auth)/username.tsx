import { Text, TextInput } from "react-native"
import React from "react"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "@rneui/themed"
import tw from "twrnc"
import useCreateUsername from "@/hooks/user/useCreateUsername"
import useAuth from "@/hooks/auth/useAuth"
import { Redirect } from "expo-router"

const UsernameScreen = () => {
  const { session, isSignedIn } = useAuth()
  const { setUsername, createUsername, username, error } = useCreateUsername()

  if (isSignedIn && session.user?.username && !session.user?.discoverWeeklyId) {
    return <Redirect href="(auth)/choose-discover-weekly" />
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ThemedView className="h-[50vh] gap-6 px-10 items-center justify-center">
        <ThemedText type="subtitle">choose a username</ThemedText>
        <ThemedView className="w-full">
          <TextInput
            className="text-xl bg-gray-50 px-4 pb-3 pt-2 text-center rounded-md text-base"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={"#888"}
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
            title="done"
            activeOpacity={0.8}
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  )
}

export default UsernameScreen
