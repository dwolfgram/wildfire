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
import { useAtom, useSetAtom } from "jotai"
import { useCallback, useState } from "react"
import useAuth from "../auth/useAuth"
import { remote as SpotifyRemote } from "react-native-spotify-remote"
import { isErrorWithMessage } from "@/utils/isErrorWithMessage"
import Toast from "react-native-toast-message"
import * as Haptics from "expo-haptics"

const usePlayer = () => {
  const { authenticateSpotify } = useAuth()
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const [currentSong] = useAtom(currentSongAtom)
  const [nextSongInQueue] = useAtom(nextSongInQueueAtom)
  const [previousSongInQueue] = useAtom(previousSongInQueueAtom)
  const skipToNextInQueue = useSetAtom(playNextAtom)
  const skipToPreviousInQueue = useSetAtom(playPreviousAtom)
  const togglePlayPause = useSetAtom(togglePlayPauseAtom)
  const addToQueue = useSetAtom(addToQueueAtom)

  const ensureSpotifyIsReady = async (uri?: string) => {
    try {
      const isConnected = await SpotifyRemote.isConnectedAsync()
      if (!isConnected) {
        await authenticateSpotify(uri)
        setIsPlaying(true)
        throw new Error("reauthed, skipping rest of actions.")
      }
    } catch (err) {
      console.log("Error ensuring spotify is ready.")
      throw err
    }
  }

  const playCurrentSong = useCallback(async (song: Partial<Song>) => {
    try {
      await ensureSpotifyIsReady(song.spotifyUri)
      await SpotifyRemote.playUri(song.spotifyUri!)
      console.log("PLAYING SONG")
      setIsPlaying(true)
    } catch (err) {
      if (isErrorWithMessage(err) && !err.message.includes("reauthed")) {
        console.log("Pausing song due to error.", err)
        setIsPlaying(false)
      } else {
        console.log("PLAYING SONG ERROR")
        setIsPlaying(true)
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
      } catch (err) {
        if (isErrorWithMessage(err) && err.message.includes("reauthed")) {
          setIsPlaying(true)
        }
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
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        // if no more songs, play button repeats the last song
        if (!nextSongInQueue && currentPosition === 0) {
          await playCurrentSong(currentSong!)
          return
        }

        await ensureSpotifyIsReady(currentSong?.spotifyUri)
        await SpotifyRemote.resume()
        setIsPlaying(true)
      } catch (err) {
        console.log("Error playing song", err)
        if (isErrorWithMessage(err) && err.message.includes("reauthed")) {
          setIsPlaying(true)
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
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      await ensureSpotifyIsReady()
      await SpotifyRemote.pause()
      setIsPlaying(false)
    } catch (err) {
      if (isErrorWithMessage(err) && err.message.includes("reauthed")) {
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
      console.log("Error pausing song", err)
    }
  }, [])

  const playNextSong = useCallback(
    async (setCurrentPosition: (value: number) => void) => {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
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
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
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
