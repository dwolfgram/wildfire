import { useSearchTracksQuery } from "@/api/queries/search"
import { SpotifyTrack } from "@/lib/types/spotify-track"
import { useEffect, useState } from "react"
import usePrevious from "../usePrevious"

export type TrackSearchResults = SpotifyTrack[] | null

const useSearchTracks = () => {
  const [tracksSearchQuery, setTracksSearchQuery] = useState("")
  const [isSearchTriggered, setIsSearchTriggered] = useState(false)

  const {
    data,
    isLoading,
    isRefetching,
    isFetching,
    isError,
    status,
    fetchStatus,
  } = useSearchTracksQuery(
    tracksSearchQuery,
    isSearchTriggered && !!tracksSearchQuery
  )

  const previousFetchStatus = usePrevious(fetchStatus)

  const searchTracks = () => {
    setIsSearchTriggered(true)
  }

  useEffect(() => {
    if (
      previousFetchStatus === "fetching" &&
      fetchStatus === "idle" &&
      status === "success"
    ) {
      setIsSearchTriggered(false)
    }
  }, [previousFetchStatus, fetchStatus, status])

  return {
    tracksSearchQuery,
    setTracksSearchQuery,
    searchTracks,
    tracksSearchResults: data?.tracks.items ?? null,
    isSearchingTracks: isLoading || isRefetching || isFetching,
    isError,
  }
}

export default useSearchTracks
