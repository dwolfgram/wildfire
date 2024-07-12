import { isPlayingAtom } from "@/state/player"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import {
  PlayerState,
  remote as SpotifyRemote,
} from "react-native-spotify-remote"
import usePlayer from "./usePlayer"

const useSpotifyTrackProgress = () => {
  const [progress, setProgress] = useState<number>(0)
  const [isPlaying] = useAtom(isPlayingAtom)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { playNextSong, currentSong } = usePlayer()

  useEffect(() => {
    const updateProgress = async () => {
      if (!isPlaying) return

      try {
        const playerState: PlayerState = await SpotifyRemote.getPlayerState()
        if (playerState.track.uri !== currentSong?.spotifyUri) return
        setProgress(playerState.playbackPosition)

        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        if (isPlaying) {
          const remainingDuration =
            playerState.track.duration - (playerState.playbackPosition + 1000)
          timerRef.current = setTimeout(async () => {
            setProgress(0)
            await playNextSong(setProgress)
          }, remainingDuration)
        }
      } catch (error) {
        console.log("Error fetching player state: ", error)
      }
    }

    const interval = setInterval(updateProgress, 1000)

    return () => {
      clearInterval(interval)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isPlaying, currentSong?.spotifyUri])

  return {
    progress,
    setProgress,
  }
}

export default useSpotifyTrackProgress
