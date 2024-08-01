import * as Notifications from "expo-notifications"

const useSetNotificationBadge = () => {
  const resetBadgeCount = async () => {
    await Notifications.setBadgeCountAsync(0)
  }
  const setBadgeCount = async (number: number) => {
    await Notifications.setBadgeCountAsync(number)
  }

  return {
    resetBadgeCount,
    setBadgeCount,
  }
}

export default useSetNotificationBadge
