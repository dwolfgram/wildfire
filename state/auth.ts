import { atom } from "jotai"
import store from "./store"

export const accessTokenAtom = atom("")
export const spotifyAccessTokenAtom = atom("")
export const spotifyRefreshTokenAtom = atom("")
export const isSignedInAtom = atom(
  (get) =>
    Boolean(get(accessTokenAtom)) &&
    Boolean(
      get(spotifyAccessTokenAtom) && Boolean(get(spotifyRefreshTokenAtom))
    )
)

export const getAccessToken = () => {
  const { get } = store
  return get(accessTokenAtom)
}

export const setAccessToken = (accessToken: string) => {
  const { set } = store
  return set(accessTokenAtom, accessToken)
}

export const getSpotifyAccessToken = () => {
  const { get } = store
  return get(spotifyAccessTokenAtom)
}

export const setSpotifyAccessToken = (accessToken: string) => {
  const { set } = store
  return set(spotifyAccessTokenAtom, accessToken)
}

export const getSpotifyRefreshToken = () => {
  const { get } = store
  return get(spotifyRefreshTokenAtom)
}

export const setSpotifyRefreshToken = (refreshToken: string) => {
  const { set } = store
  return set(spotifyRefreshTokenAtom, refreshToken)
}
