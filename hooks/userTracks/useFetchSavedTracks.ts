import baseApi from "@/api/client"
import { TrackType, UserTrack } from "@/lib/types/user-track"
import { useCallback, useState } from "react"

const useFetchSavedTracks = () => {
  const [savedTracks, setSavedTracks] = useState<UserTrack[] | null>(null)
  const [isLoadingSavedTracks, setIsLoadingSavedTracks] = useState(false)

  const fetchSavedTracks = useCallback(async (userId: string) => {
    try {
      setIsLoadingSavedTracks(true)
      const { data } = await baseApi.get<UserTrack[]>(
        `/user-tracks/${userId}`,
        {
          params: {
            trackType: TrackType.SAVED_TRACK,
          },
        }
      )
      setSavedTracks(data)
    } catch (err) {
      console.log("error fetching user conversations", err)
    } finally {
      setIsLoadingSavedTracks(false)
    }
  }, [])

  return {
    fetchSavedTracks,
    savedTracks,
    isLoadingSavedTracks,
  }
}

export default useFetchSavedTracks
