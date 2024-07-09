import { Device } from "@spotify/web-api-ts-sdk"
import baseApi from "../client"

export const fetchDeviceList = async () => {
  const { data } = await baseApi.get<Device[]>("/spotify/devices")
  return data
}

export const playSong = async (
  songUri: string,
  deviceId: string,
  position?: number
) => {
  const { data } = await baseApi.put<{ success: boolean }>(
    "/spotify/start-resume",
    {
      songUri,
      deviceId,
      position,
    }
  )
  return data
}

export const pauseSong = async (deviceId: string) => {
  const { data } = await baseApi.put<{ success: boolean }>("/spotify/pause", {
    deviceId,
  })
  return data
}
