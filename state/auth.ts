import { atom } from "jotai"
import store from "./store"
import { secureStorage } from "./secureStoreAtom"
import { atomWithStorage, unwrap } from "jotai/utils"

export const accessTokenAtom = atomWithStorage<string>(
  "accessToken",
  "",
  secureStorage,
  { getOnInit: true }
)

export const spotifyAccessTokenAtom = atomWithStorage<string>(
  "spotifyAccessToken",
  "",
  secureStorage,
  {
    getOnInit: true,
  }
)

export const spotifyRefreshTokenAtom = atomWithStorage<string>(
  "spotifyRefreshToken",
  "",
  secureStorage,
  {
    getOnInit: true,
  }
)

export const isSignedInAtom = atom((get) => {
  const accessToken = get(unwrap(accessTokenAtom))
  const spotifyAccessToken = get(unwrap(spotifyAccessTokenAtom))
  const spotifyRefreshToken = get(unwrap(spotifyRefreshTokenAtom))

  return (
    Boolean(accessToken) &&
    Boolean(spotifyAccessToken) &&
    Boolean(spotifyRefreshToken)
  )
})

export const getAccessToken = async () => {
  const { get } = store
  return await get(accessTokenAtom)
}

export const setAccessToken = async (accessToken: string) => {
  const { set } = store
  await set(accessTokenAtom, accessToken)
}

export const getSpotifyAccessToken = async () => {
  const { get } = store
  return await get(spotifyAccessTokenAtom)
}

export const setSpotifyAccessToken = async (spotifyAccessToken: string) => {
  const { set } = store
  await set(spotifyAccessTokenAtom, spotifyAccessToken)
}

export const getSpotifyRefreshToken = async () => {
  const { get } = store
  return await get(spotifyRefreshTokenAtom)
}

export const setSpotifyRefreshToken = async (refreshToken: string) => {
  const { set } = store
  await set(spotifyRefreshTokenAtom, refreshToken)
}
