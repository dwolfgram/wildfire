import baseApi from "@/api/client"
import { TrackType, UserTrack } from "@/lib/types/user-track"
import { useCallback, useState } from "react"

const useFetchTopTracks = () => {
  const [topTracks, setTopTracks] = useState<UserTrack[] | null>(null)
  const [isLoadingTopTracks, setIsLoadingTopTracks] = useState(false)

  const fetchTopTracks = useCallback(async (userId: string) => {
    try {
      setIsLoadingTopTracks(true)
      const { data } = await baseApi.get<UserTrack[]>(
        `/user-tracks/${userId}`,
        {
          params: {
            trackType: TrackType.TOP_LISTEN,
          },
        }
      )
      setTopTracks(data)
    } catch (err) {
      console.log("error fetching user conversations", err)
    } finally {
      setIsLoadingTopTracks(false)
    }
  }, [])

  return {
    fetchTopTracks,
    topTracks,
    isLoadingTopTracks,
  }
}

export default useFetchTopTracks
