import { Song } from "@/lib/types/song"
import { SpotifyTrack } from "@/lib/types/spotify-track"
import { UserTrack } from "@/lib/types/user-track"

function isSong(data: Song | SpotifyTrack): data is Song {
  return (data as Song).spotifyId !== undefined
}

export function formatSpotifyTrackToSong(
  data: SpotifyTrack | Song
): Partial<Song> {
  if (isSong(data)) {
    return data
  }

  const song: Partial<Song> = {
    spotifyId: data.id,
    albumImage: data.album.images[0]?.url || "",
    albumName: data.album.name,
    spotifyUri: data.uri,
    name: data.name,
    artistName: data.artists[0]?.name || "",
    artistUri: data.artists[0]?.uri || "",
    durationMs: data.duration_ms,
  }

  return song
}
