import baseApi from "@/api/client"
import { TrackType, UserTrack } from "@/lib/types/user-track"
import { useCallback, useState } from "react"

const useFetchDiscoverTracks = () => {
  const [discoverTracks, setDiscoverTracks] = useState<UserTrack[] | null>(null)
  const [isLoadingDiscoverTracks, setIsLoadingDiscoverTracks] = useState(false)

  const fetchDiscoverTracks = useCallback(async (userId: string) => {
    try {
      setIsLoadingDiscoverTracks(true)
      const { data } = await baseApi.get<UserTrack[]>(
        `/user-tracks/${userId}`,
        {
          params: {
            trackType: TrackType.DISCOVER_WEEKLY,
          },
        }
      )
      setDiscoverTracks(data)
    } catch (err) {
      console.log("error fetching user conversations", err)
    } finally {
      setIsLoadingDiscoverTracks(false)
    }
  }, [])

  return {
    fetchDiscoverTracks,
    discoverTracks,
    isLoadingDiscoverTracks,
  }
}

export default useFetchDiscoverTracks
