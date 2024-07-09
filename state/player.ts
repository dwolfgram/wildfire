import { Song } from "@/lib/types/song"
import { Device } from "@spotify/web-api-ts-sdk"
import { atom } from "jotai"

export const queueAtom = atom<Partial<Song>[]>([])
export const currentSongIndexAtom = atom(0)
export const isPlayingAtom = atom(false)
export const selectedDeviceAtom = atom<Device | null>(null)

export const currentSongAtom = atom<Partial<Song> | null>((get) => {
  const queue = get(queueAtom)
  const currentIndex = get(currentSongIndexAtom)
  return queue[currentIndex] || null
})

export const nextSongInQueueAtom = atom<Partial<Song> | null>((get) => {
  const queue = get(queueAtom)
  const currentIndex = get(currentSongIndexAtom)
  return queue[currentIndex + 1] || null
})

export const previousSongInQueueAtom = atom<Partial<Song> | null>((get) => {
  const queue = get(queueAtom)
  const currentIndex = get(currentSongIndexAtom)
  return queue[currentIndex - 1] || null
})

export const playNextAtom = atom(null, (get, set) => {
  const queue = get(queueAtom)
  const currentIndex = get(currentSongIndexAtom)
  if (currentIndex < queue.length - 1) {
    set(currentSongIndexAtom, currentIndex + 1)
    set(isPlayingAtom, true)
  }
})

export const playPreviousAtom = atom(null, (get, set) => {
  const currentIndex = get(currentSongIndexAtom)
  if (currentIndex > 0) {
    set(currentSongIndexAtom, currentIndex - 1)
    set(isPlayingAtom, true)
  }
})

export const togglePlayPauseAtom = atom(null, (get, set) => {
  set(isPlayingAtom, !get(isPlayingAtom))
})

export const addToQueueAtom = atom(
  null,
  (get, set, newSongs: Partial<Song>[]) => {
    set(queueAtom, [...newSongs])
    set(currentSongIndexAtom, 0)
  }
)
