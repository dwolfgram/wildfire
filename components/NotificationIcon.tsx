import { Pressable, View, Text } from "react-native"
import React, { useEffect } from "react"
import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useFetchUnreadNotificationCount } from "@/api/queries/notifications"
import * as Notifications from "expo-notifications"
import { useTheme } from "@react-navigation/native"

const NotificationIcon = () => {
  const theme = useTheme()
  const { data } = useFetchUnreadNotificationCount()

  useEffect(() => {
    Notifications.setBadgeCountAsync(data?.count || 0)
  }, [data?.count])

  return (
    <Link href="(tabs)/home/notifications" push asChild>
      <Pressable className="active:opacity-60" hitSlop={10}>
        <View className="relative">
          <Ionicons
            name="notifications"
            size={22}
            color={theme.dark ? "#fff" : "#11181C"}
          />
          {data?.count ? (
            <View
              className={`absolute left-[10px] bg-orange-600 items-center justify-center rounded-full ${
                data.count > 10 ? "w-[20px] h-[20px]" : "w-[18px] h-[18px]"
              }`}
            >
              <Text
                className={`text-white font-medium ${
                  data.count > 10 ? "text-[10px]" : "text-xs"
                }`}
              >
                {data.count < 10 ? data.count : "9+"}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Link>
  )
}

export default NotificationIcon
