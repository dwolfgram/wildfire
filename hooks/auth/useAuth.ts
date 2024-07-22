import baseApi from "@/api/client"
import { useAtom } from "jotai"
import {
  accessTokenAtom,
  isSignedInAtom,
  spotifyAccessTokenAtom,
  spotifyRefreshTokenAtom,
} from "@/state/auth"
import { makeRedirectUri } from "expo-auth-session"
import { useState } from "react"
import { userAtom } from "@/state/user"
import { User } from "@/lib/types/user"
import {
  ApiConfig,
  ApiScope,
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  SpotifySession,
} from "react-native-spotify-remote"
import { AccessToken } from "@spotify/web-api-ts-sdk"
import { isPlayingAtom } from "@/state/player"
import Toast from "react-native-toast-message"
import { RESET } from "jotai/utils"
import axios from "axios"

interface Tokens {
  access_token: string
  refresh_token: string
  token_type: string
  scope: string
  expires_in: number
}

export interface TokenResponse {
  spotify_auth: Tokens
  wildfire_token: string
  user?: User
}

const redirectUri = makeRedirectUri({
  scheme: "com.wildfire.rn",
})

export const spotifyConfig: ApiConfig = {
  clientID: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
  redirectURL: redirectUri,
  tokenSwapURL: "http://192.168.1.141:4001/api/v1/auth/token-swap",
  tokenRefreshURL:
    "http://192.168.1.141:4001/api/v1/auth/refresh-token-frontend",
  showDialog: false,
  scopes: [
    ApiScope.AppRemoteControlScope,
    ApiScope.PlaylistModifyPrivateScope,
    ApiScope.PlaylistModifyPublicScope,
    ApiScope.PlaylistReadCollaborativeScope,
    ApiScope.PlaylistReadPrivateScope,
    ApiScope.StreamingScope,
    ApiScope.UserLibraryModifyScope,
    ApiScope.UserLibraryReadScope,
    ApiScope.UserModifyPlaybackStateScope,
    ApiScope.UserReadCurrentlyPlaying,
    ApiScope.UserReadCurrentlyPlayingScope,
    ApiScope.UserReadEmailScope,
    ApiScope.UserReadPlaybackPosition,
    ApiScope.UserReadPlaybackStateScope,
    ApiScope.UserReadPrivateScope,
    ApiScope.UserTopReadScope,
  ],
}

const MAX_LOGIN_TIMEOUT = () =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout: Sign in took too long")), 10000)
  )

const useAuth = () => {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  const [spotifyAccessToken, setSpotifyAccessToken] = useAtom(
    spotifyAccessTokenAtom
  )
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useAtom(
    spotifyRefreshTokenAtom
  )
  const [isSignedIn] = useAtom(isSignedInAtom)
  const [user, setUser] = useAtom(userAtom)
  const [_, setIsPlaying] = useAtom(isPlayingAtom)

  const authenticateSpotify = async (uri?: string) => {
    try {
      await SpotifyAuth.endSession()
      const session = await SpotifyAuth.authorize({
        ...spotifyConfig,
        playURI: uri,
      })

      if (uri) {
        setIsPlaying(true)
      }

      const isConnected = await SpotifyRemote.isConnectedAsync()
      if (!isConnected) {
        await SpotifyRemote.connect(session.accessToken)
      }

      await handleSignInOrSignUp({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        expires_in: 3600,
        token_type: "Bearer",
      })

      console.log("isConnected", isConnected)
      // await SpotifyRemote.playUri("spotify:track:3CDGdnri4kiyWKlcl25bYJ")

      return session
    } catch (err) {
      console.log("error authenticating spotify!")
      throw err
    }
  }

  const handleSignInOrSignUp = async (spotifyData: AccessToken) => {
    try {
      const { data } = await baseApi.post<TokenResponse>("/auth/login", {
        spotifyData,
      })
      if (!data || (!("spotify_auth" in data) && !("wildfire_token" in data))) {
        console.log("Bad sign in response!")
        throw new Error("No data returned from token swap.")
      }

      await setSpotifyAccessToken(data.spotify_auth.access_token)
      await setSpotifyRefreshToken(data.spotify_auth.refresh_token)
      await setAccessToken(data.wildfire_token)
      await setUser(data.user)
      return data
    } catch (err) {
      //err.response.data.errors[0].message
      console.log("Error swapping for tokens:")
      throw err
    }
  }

  const signIn = async () => {
    try {
      setIsSigningIn(true)
      const session = await Promise.race<SpotifySession>([
        authenticateSpotify(),
        MAX_LOGIN_TIMEOUT(),
      ])
      const formattedTokens = {
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        expires_in: 3600,
        token_type: "Bearer",
      }
      const data = await handleSignInOrSignUp(formattedTokens)
      return data
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "error signing in",
        text2: "close wildfire and spotify and then reopen and try again",
      })
      console.log("Error signing in:", err)
    } finally {
      setIsSigningIn(false)
    }
  }

  const signOut = async () => {
    await setAccessToken("")
    await setSpotifyAccessToken("")
    await setSpotifyRefreshToken("")
    await setUser(RESET)
  }

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post<TokenResponse>(
        "http://192.168.1.141:4001/api/v1/auth/refresh-token",
        {
          refreshToken: spotifyRefreshToken,
        }
      )
      await setSpotifyAccessToken(data.spotify_auth.access_token)
      await setSpotifyRefreshToken(data.spotify_auth.refresh_token)
      await setAccessToken(data.wildfire_token)
      return data
    } catch (err) {
      console.log("Error refreshing token:", err)
    }
  }

  return {
    authenticateSpotify,
    signIn,
    refreshAccessToken,
    spotifyAccessToken,
    spotifyRefreshToken,
    accessToken,
    isSignedIn,
    isSigningIn,
    signOut,
    session: {
      user,
    },
  }
}

export default useAuth
