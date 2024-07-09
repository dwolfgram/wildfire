import baseApi from "@/api/client"
import { useAtom } from "jotai"
import {
  accessTokenAtom,
  isSignedInAtom,
  spotifyAccessTokenAtom,
  spotifyRefreshTokenAtom,
} from "@/state/auth"
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"
import { useState } from "react"
import { userAtom } from "@/state/user"
import { User } from "@/lib/types/user"

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

interface RefreshTokenResponse extends Tokens {}

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
}

const redirectUri = makeRedirectUri({
  scheme: "com.wildfire.rn",
})

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

  const [_, __, asyncAuthRequest] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      scopes: [
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-read-playback-position",
        "user-top-read",
        "user-read-recently-played",
        "user-library-modify",
        "user-library-read",
        "user-read-email",
        "user-read-private",
        "app-remote-control",
        "streaming",
      ],
      usePKCE: false,
      redirectUri,
    },
    discovery
  )

  const handleSignInOrSignUp = async (code: string, redirectUri: string) => {
    try {
      const { data } = await baseApi.post<TokenResponse>("/auth/token_swap", {
        code,
        redirectUri,
      })
      if (!data || (!("spotify_auth" in data) && !("wildfire_token" in data))) {
        console.log("Bad sign in response!")
        throw new Error("No data returned from token swap.")
      }
      setSpotifyAccessToken(data.spotify_auth.access_token)
      setSpotifyRefreshToken(data.spotify_auth.refresh_token)
      setAccessToken(data.wildfire_token)
      setUser(data.user)
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
      const response = await asyncAuthRequest()
      if (response?.type === "success") {
        const { code } = response.params
        const data = await handleSignInOrSignUp(code, redirectUri)
        return data
      } else if (response.type === "error") {
        // show toast
      }
    } catch (err) {
      // show toast
      console.log("Error signing in", err)
    } finally {
      setIsSigningIn(false)
    }
  }

  const refreshAccessToken = async () => {
    try {
      const { data } = await baseApi.post<TokenResponse>(
        "/auth/refresh_token",
        {
          refreshToken: spotifyRefreshToken,
        }
      )
      setSpotifyAccessToken(data.spotify_auth.access_token)
      setSpotifyRefreshToken(data.spotify_auth.refresh_token)
      setAccessToken(data.wildfire_token)
      return data
    } catch (err) {
      console.log("Error refreshing token:", err)
    }
  }

  return {
    signIn,
    refreshAccessToken,
    spotifyAccessToken,
    spotifyRefreshToken,
    accessToken,
    isSignedIn,
    isSigningIn,
    session: {
      user,
    },
  }
}

export default useAuth
