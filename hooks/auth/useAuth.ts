import baseApi from "@/api/client"
import { useAtom, useSetAtom } from "jotai"
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
import { Platform } from "react-native"
import { isErrorWithMessage } from "@/utils/isErrorWithMessage"
import { API_URL } from "@/constants/api"

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
  tokenSwapURL: `${API_URL}/auth/token-swap`,
  tokenRefreshURL: `${API_URL}/auth/refresh-token-frontend`,
  showDialog: false,
  authType: "CODE",
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
    setTimeout(() => reject(new Error("Timeout: Sign in took too long")), 20000)
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
  const setIsPlaying = useSetAtom(isPlayingAtom)

  const swapCodeForTokens = async (code: string) => {
    try {
      const { data } = await axios.post<AccessToken>(
        `${API_URL}/auth/token-swap`,
        {
          code,
        }
      )
      return data
    } catch (err) {
      console.log("Error swapping code for tokens:", err)
      throw err
    }
  }

  const authenticateSpotify = async (uri?: string) => {
    try {
      await SpotifyAuth.endSession()
      const session = await SpotifyAuth.authorize({
        ...spotifyConfig,
        playURI: uri,
      })

      if (Platform.OS === "android") {
        const spotifySession = await swapCodeForTokens(session.accessToken)
        await handleSignInOrSignUp(spotifySession)
      } else {
        await handleSignInOrSignUp({
          access_token: session.accessToken,
          refresh_token: session.refreshToken,
          expires_in: 3600,
          token_type: "Bearer",
        })
      }

      const isConnected = await SpotifyRemote.isConnectedAsync()
      if (!isConnected) {
        await SpotifyRemote.connect(session.accessToken)
      }

      if (uri) {
        setIsPlaying(true)
      }

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
        throw new Error("No data returned from signing in or sign up.")
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
      // const formattedTokens = {
      //   access_token: session.accessToken,
      //   refresh_token: session.refreshToken,
      //   expires_in: 3600,
      //   token_type: "Bearer",
      // }
      // const data = await handleSignInOrSignUp(formattedTokens)
      return session
    } catch (err) {
      if (
        isErrorWithMessage(err) &&
        !err.message
          .toLowerCase()
          .includes("ensure the spotify app is installed")
      ) {
        Toast.show({
          type: "error",
          text1: "error signing in",
          text2: "close wildfire and spotify and then reopen and try again",
        })
      }
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
        `${API_URL}/auth/refresh-token`,
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

  const signInDemo = async () => {
    try {
      setIsSigningIn(true)
      const { data } = await baseApi.post<TokenResponse>("/auth/login/demo")
      if (!data || (!("spotify_auth" in data) && !("wildfire_token" in data))) {
        console.log("Bad sign in response!")
        throw new Error("No data returned from demo sign in.")
      }

      await setSpotifyAccessToken(data.spotify_auth.access_token)
      await setSpotifyRefreshToken(data.spotify_auth.refresh_token)
      await setAccessToken(data.wildfire_token)
      await setUser(data.user)

      return data
    } catch (err) {
      console.log("Error signing in:", err)
    } finally {
      setIsSigningIn(false)
    }
  }

  return {
    authenticateSpotify,
    signIn,
    refreshAccessToken,
    spotifyAccessToken,
    spotifyRefreshToken,
    accessToken,
    signInDemo,
    isSignedIn,
    isSigningIn,
    signOut,
    session: {
      user,
    },
  }
}

export default useAuth
