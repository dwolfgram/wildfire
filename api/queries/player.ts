import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { fetchDeviceList, pauseSong, playSong } from "../endpoints/player"
import useAuth from "@/hooks/auth/useAuth"

export const playerQueryKeys = {
  all: ["player"] as const,
  devices: (userId: string) =>
    [...playerQueryKeys.all, "devices", userId] as const,
}

export const useFetchDeviceList = () => {
  const { session } = useAuth()
  return useQuery({
    queryKey: playerQueryKeys.devices(session.user?.id!),
    queryFn: () => fetchDeviceList(),
    placeholderData: keepPreviousData,
  })
}

export const usePlaySong = () => {
  return useMutation({
    mutationFn: ({
      songUri,
      deviceId,
      position,
    }: {
      songUri: string
      deviceId: string
      position?: number
    }) => playSong(songUri, deviceId, position),
  })
}

export const usePauseSong = () => {
  return useMutation({
    mutationFn: ({ deviceId }: { deviceId: string }) => pauseSong(deviceId),
  })
}
