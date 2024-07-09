import {
  useFetchDeviceList,
  usePauseSong,
  usePlaySong,
} from "@/api/queries/player"
import { Song } from "@/lib/types/song"
import {
  addToQueueAtom,
  currentSongAtom,
  isPlayingAtom,
  nextSongInQueueAtom,
  playNextAtom,
  playPreviousAtom,
  previousSongInQueueAtom,
  selectedDeviceAtom,
  togglePlayPauseAtom,
} from "@/state/player"
import { useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react"

const usePlayer = () => {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const [currentSong] = useAtom(currentSongAtom)
  const [nextSongInQueue] = useAtom(nextSongInQueueAtom)
  const [previousSongInQueue] = useAtom(previousSongInQueueAtom)
  const [_, skipToNextInQueue] = useAtom(playNextAtom)
  const [_____, skipToPreviousInQueue] = useAtom(playPreviousAtom)
  const [__, togglePlayPause] = useAtom(togglePlayPauseAtom)
  const [___, addToQueue] = useAtom(addToQueueAtom)
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom)

  const { data: deviceList } = useFetchDeviceList()
  const { mutateAsync: playSongApi } = usePlaySong()
  const { mutateAsync: pauseSongApi } = usePauseSong()

  const [currentPosition, setCurrentPosition] = useState(0)
  const [isLoadingSong, setIsLoadingSong] = useState(false)

  const playCurrentSong = useCallback(
    async (song: Partial<Song>, position: number) => {
      try {
        setIsLoadingSong(true)
        if (!selectedDevice?.id) {
          console.log("NO DEVICE SELECTED!")
          return
        }
        await playSongApi({
          songUri: song?.spotifyUri!,
          deviceId: selectedDevice?.id,
          position,
        })
        setIsPlaying(true)
      } catch (err) {
        setIsLoadingSong(false)
        setIsPlaying(false)
        throw err
      } finally {
        setIsLoadingSong(false)
      }
    },
    [currentSong, isPlaying, currentPosition, selectedDevice?.id]
  )

  const playNextSong = useCallback(async () => {
    try {
      if (nextSongInQueue) {
        await playCurrentSong(nextSongInQueue, 0)
        skipToNextInQueue()
      }
    } catch (err) {
      console.log("Error playing next song")
    }
  }, [playCurrentSong, nextSongInQueue])

  const playPreviousSong = useCallback(async () => {
    try {
      if (previousSongInQueue) {
        await playCurrentSong(previousSongInQueue, 0)
        skipToPreviousInQueue()
      }
    } catch (err) {
      console.log("Error playing next song")
    }
  }, [playCurrentSong])

  const addToQueueAndPlay = useCallback(
    async (songs: Partial<Song>[]) => {
      try {
        addToQueue(songs)
        await playCurrentSong(songs[0], 0)
      } catch (err) {
        console.log("Error adding to queue and playing")
      }
    },
    [playCurrentSong, addToQueue]
  )

  const playSong = useCallback(async () => {
    try {
      if (currentSong) {
        await playCurrentSong(currentSong, currentPosition)
      }
    } catch (err) {
      console.log("Error playing song")
    }
  }, [playCurrentSong, currentSong, currentPosition])

  const pauseSong = useCallback(async () => {
    try {
      if (!selectedDevice?.id) {
        console.log("NO DEVICE ID - PAUSING")
        return
      }
      console.log(selectedDevice.id)
      await pauseSongApi({ deviceId: selectedDevice.id })
      setIsPlaying(false)
    } catch (err) {
      console.log("Error pausing song")
    }
  }, [playCurrentSong, selectedDevice, selectedDevice?.id])

  useEffect(() => {
    if (deviceList?.length) {
      console.log(deviceList)
      const mobileDevices = deviceList.filter(
        (device) => device.type.toLowerCase() === "smartphone"
      )
      if (mobileDevices.length > 0) {
        console.log("Connecting to mobile phone.")
        setSelectedDevice(mobileDevices[0])
      } else if (deviceList.length > 0) {
        setSelectedDevice(deviceList[0])
      }
    }
  }, [deviceList, setSelectedDevice])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && currentSong && !isLoadingSong) {
      interval = setInterval(() => {
        setCurrentPosition((position) => {
          if (position >= currentSong.durationMs!) {
            playNextSong()
            return 0
          }
          return position + 1000
        })
      }, 1000)
    } else if (!isPlaying && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, currentSong, playNextSong, isLoadingSong])

  useEffect(() => {
    console.log(currentSong?.spotifyUri)
    setCurrentPosition(0)
  }, [currentSong?.spotifyUri])

  return {
    playPreviousSong,
    playNextSong,
    currentSong,
    currentPosition,
    togglePlayPause,
    addToQueueAndPlay,
    isPlaying,
    pauseSong,
    playSong,
  }
}

export default usePlayer
