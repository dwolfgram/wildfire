import TrackPlayer, { Event } from "react-native-track-player"

export default async function () {
  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, () =>
    console.log("PLAY BACK CHANGED")
  )
  TrackPlayer.addEventListener(Event.RemotePause, () =>
    console.log("PAUSED BIG BOI")
  )
  TrackPlayer.addEventListener(Event.RemotePlay, () => console.log("PLAYING"))
}
