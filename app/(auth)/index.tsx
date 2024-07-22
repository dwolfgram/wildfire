import { Image, ScrollView, View } from "react-native"
import React from "react"
import tw from "twrnc"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { Button } from "@rneui/themed"

import * as WebBrowser from "expo-web-browser"
import { ThemedText } from "@/components/ThemedText"
import useAuth from "@/hooks/auth/useAuth"
import { Redirect } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

WebBrowser.maybeCompleteAuthSession() // required for web only

const LoginScreen = () => {
  const { signIn, session, isSignedIn, isSigningIn } = useAuth()

  if (isSignedIn && session.user && !session.user?.username) {
    return <Redirect href="(auth)/username" />
  }

  if (isSignedIn && session.user?.username && !session.user?.discoverWeeklyId) {
    return <Redirect href="(auth)/choose-discover-weekly" />
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={tw`h-full items-center justify-center gap-[50px]`}
      >
        <View className="items-center">
          <ThemedText className="text-neutral-900" type="title">
            wildfire
          </ThemedText>
          <ThemedText className="font-normal text-neutral-900" type="subtitle">
            share music with your friends
          </ThemedText>
        </View>
        <Image
          className="w-[120px] h-[143px]"
          source={require("@/assets/images/ski-free.png")}
          resizeMode="contain"
        />
        <Button
          icon={
            <View className="mr-4">
              <FontAwesome5 name="spotify" size={24} color="#191414" />
            </View>
          }
          loading={isSigningIn}
          disabled={isSigningIn}
          buttonStyle={tw`w-full bg-[#1DB954] px-5 py-3 min-h-[60px] rounded-full`}
          title="Continue with Spotify"
          titleStyle={tw`text-[#191414] font-semibold`}
          onPress={async () => await signIn()}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoginScreen
