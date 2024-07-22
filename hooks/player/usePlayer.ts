import { Song } from "@/lib/types/song"
import {
  addToQueueAtom,
  currentSongAtom,
  isPlayingAtom,
  nextSongInQueueAtom,
  playNextAtom,
  playPreviousAtom,
  previousSongInQueueAtom,
  togglePlayPauseAtom,
} from "@/state/player"
import { useAtom } from "jotai"
import { useCallback, useState } from "react"
import useAuth from "../auth/useAuth"
import { remote as SpotifyRemote } from "react-native-spotify-remote"
import { isErrorWithMessage } from "@/utils/isErrorWithMessage"
import Toast from "react-native-toast-message"
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av"
import { Sound } from "expo-av/build/Audio"

const usePlayer = () => {
  const { authenticateSpotify } = useAuth()
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const [currentSong] = useAtom(currentSongAtom)
  const [nextSongInQueue] = useAtom(nextSongInQueueAtom)
  const [previousSongInQueue] = useAtom(previousSongInQueueAtom)
  const [_, skipToNextInQueue] = useAtom(playNextAtom)
  const [_____, skipToPreviousInQueue] = useAtom(playPreviousAtom)
  const [__, togglePlayPause] = useAtom(togglePlayPauseAtom)
  const [___, addToQueue] = useAtom(addToQueueAtom)
  const [currentSound, setCurrentSound] = useState<Sound | null>(null)

  const ensureSpotifyIsReady = async (uri?: string) => {
    try {
      const isConnected = await SpotifyRemote.isConnectedAsync()
      if (!isConnected) {
        await authenticateSpotify(uri)
        // setIsPlaying(true)
        throw new Error("reauthed, skipping rest of actions.")
      }
    } catch (err) {
      console.log("Error ensuring spotify is ready.")
      // Toast.show({
      //   type: "error",
      //   text1: "spotify app disconnected",
      //   text2: "if problems persist exit spotify and wildfire and then reopen",
      //   position: "top",
      //   topOffset: 54,
      //   visibilityTime: 7000,
      // })
      throw err
    }
  }

  const playCurrentSong = useCallback(async (song: Partial<Song>) => {
    try {
      // setIsPlaying(true)
      // if (!currentSound) {
      //   const { sound } = await Audio.Sound.createAsync(
      //     require("@/assets/sounds/silence.mp3")
      //   )
      //   setCurrentSound(sound)
      //   await Audio.setAudioModeAsync({
      //     staysActiveInBackground: true,
      //     interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      //     interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      //     playsInSilentModeIOS: true,
      //   })
      //   await sound.setIsLoopingAsync(true)
      //   await sound.playAsync()
      // }
      await ensureSpotifyIsReady(song.spotifyUri)
      await SpotifyRemote.playUri(song.spotifyUri!)
    } catch (err) {
      if (isErrorWithMessage(err) && !err.message.includes("reauthed")) {
        console.log("Pausing song due to error.", err)
        setIsPlaying(false)
      }
      throw err
    }
  }, [])

  const addToQueueAndPlay = useCallback(
    async (songs: Partial<Song>[], startIndex: number) => {
      try {
        addToQueue({
          newSongs: songs,
          startIndex,
        })
        await playCurrentSong(songs[startIndex])
        await SpotifyRemote.queueUri(songs[startIndex + 1].spotifyUri!)
        await SpotifyRemote.queueUri(songs[startIndex + 2].spotifyUri!)
      } catch (err) {
        console.log("Error adding to queue and playing")
      }
    },
    []
  )

  const playSong = useCallback(
    async (
      currentPosition: number,
      setCurrentPosition: (value: number) => void
    ) => {
      try {
        // if no more songs, play button repeats the last song
        if (!nextSongInQueue && currentPosition === 0) {
          await playCurrentSong(currentSong!)
          return
        }

        // setIsPlaying(true)
        await ensureSpotifyIsReady(currentSong?.spotifyUri)
        await SpotifyRemote.resume()
        // await currentSound?.playAsync()
      } catch (err) {
        console.log("Error playing song", err)
        if (isErrorWithMessage(err) && err.message.includes("reauthed")) {
          // await pauseSong()
          // await SpotifyRemote.seek(currentPosition)
          // await playSong(currentPosition)
          // console.log("show toast!")
          setCurrentPosition(0)
          Toast.show({
            type: "error",
            text1: "spotify lost connection",
            text2:
              "we had to your reset playback position due to spotify disconnecting",
            position: "top",
            topOffset: 54,
            visibilityTime: 7000,
          })
        } else {
          setIsPlaying(false)
        }
      }
    },
    [nextSongInQueue, currentSong]
  )

  const pauseSong = useCallback(async () => {
    try {
      // setIsPlaying(false)
      await ensureSpotifyIsReady()
      await SpotifyRemote.pause()
      // await currentSound?.pauseAsync()
    } catch (err) {
      if (isErrorWithMessage(err) && err.message.includes("reauthed")) {
        setIsPlaying(true)
      }
      console.log("Error pausing song", err)
    }
  }, [])

  const playNextSong = useCallback(
    async (setCurrentPosition: (value: number) => void) => {
      try {
        if (nextSongInQueue) {
          skipToNextInQueue()
          setCurrentPosition(0)
          await playCurrentSong(nextSongInQueue)
        } else {
          setIsPlaying(false)
          setCurrentPosition(0)
          await pauseSong()
        }
      } catch (err) {
        console.log("Error playing next song")
      }
    },
    [nextSongInQueue, pauseSong]
  )

  const playPreviousSong = useCallback(
    async (
      currentPosition: number,
      setCurrentPosition: (value: number) => void
    ) => {
      try {
        if (currentPosition > 2000) {
          if (isPlaying) {
            setCurrentPosition(0)
            await playCurrentSong(currentSong!)
          } else {
            await seek(0, setCurrentPosition)
          }
        } else {
          if (previousSongInQueue) {
            skipToPreviousInQueue()
            setCurrentPosition(0)
            await playCurrentSong(previousSongInQueue)
          } else {
            await seek(0, setCurrentPosition)
          }
        }
      } catch (err) {
        console.log(err)
        console.log("Error playing previous song")
      }
    },
    [previousSongInQueue, isPlaying, currentSong]
  )

  const seek = useCallback(
    async (position: number, setCurrentPosition: (value: number) => void) => {
      try {
        await ensureSpotifyIsReady()
        await SpotifyRemote.seek(position)
        setCurrentPosition(position)
      } catch (err) {
        console.log("error seeking")
      }
    },
    [playSong, currentSong?.spotifyUri]
  )

  return {
    seek,
    hasNext: !!nextSongInQueue,
    hasPrevious: !!previousSongInQueue,
    playPreviousSong,
    playNextSong,
    currentSong,
    togglePlayPause,
    addToQueueAndPlay,
    isPlaying,
    pauseSong,
    playSong,
  }
}

export default usePlayer
