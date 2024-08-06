import React from "react"
import { Link, useRouter } from "expo-router"
import { User } from "@/lib/types/user"
import { Pressable, Text, View } from "react-native"
import { Image } from "react-native"

interface AvatarProps {
  user: User
  size?: number
  textSize?: number
}

const Avatar = ({ user, size = 50, textSize = 20 }: AvatarProps) => {
  return (
    <>
      {user && user.pfp ? (
        <Image
          className="rounded-full"
          source={{ uri: user?.pfp }}
          height={size}
          width={size}
        />
      ) : user && !user.pfp ? (
        <View
          className="rounded-full items-center justify-center bg-teal-500 dark:bg-teal-800"
          style={{ width: size, height: size }}
        >
          <Text
            style={{ fontSize: textSize }}
            className={`font-medium text-teal-50 dark:text-teal-400`}
          >
            {user?.username?.slice(0, 1).toUpperCase()}
          </Text>
        </View>
      ) : null}
    </>
  )
}

export default Avatar
