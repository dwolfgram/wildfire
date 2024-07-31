import axios from "axios"

interface SendNotificationParams {
  title: string
  body: string
  expoPushToken: string
  data?: Record<string, string>
}

const useSendNotification = () => {
  const sendPushNotification = async ({
    title,
    body,
    expoPushToken,
    data,
  }: SendNotificationParams) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    }

    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })
  }

  return {
    sendPushNotification,
  }
}

export default useSendNotification
