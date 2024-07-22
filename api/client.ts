import { TokenResponse } from "@/hooks/auth/useAuth"
import {
  getAccessToken,
  getSpotifyRefreshToken,
  setAccessToken,
  setSpotifyAccessToken,
  setSpotifyRefreshToken,
} from "@/state/auth"
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { setUser } from "@/state/user"
import { RESET } from "jotai/utils"
import Toast from "react-native-toast-message"

type FailedQueueItem = {
  resolve: (token: string) => void
  reject: (error: any) => void
}

const API_URL = process.env.EXPO_PUBLIC_API_URL

const baseApi: AxiosInstance = axios.create({
  baseURL: API_URL,
})

const fetchNewTokens = async (): Promise<TokenResponse> => {
  const refreshToken = await getSpotifyRefreshToken()
  const response = await axios.post<TokenResponse>(
    `${API_URL}/auth/refresh-token`,
    {
      refreshToken,
    }
  )
  return response.data
}

const updateNewTokens = async (tokens: TokenResponse) => {
  await setAccessToken(tokens.wildfire_token)
  await setSpotifyAccessToken(tokens.spotify_auth.access_token)
  await setSpotifyRefreshToken(tokens.spotify_auth.refresh_token)
  baseApi.defaults.headers.common.Authorization = `Bearer ${tokens.wildfire_token}`
}

const logout = async () => {
  await setAccessToken("")
  await setSpotifyAccessToken("")
  await setSpotifyRefreshToken("")
  await setUser(RESET)
  Toast.show({
    type: "error",
    text1: "error",
    text2: "unable to refesh your login session",
  })
}

baseApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: FailedQueueItem[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

const addToFailedQueue = (
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token: string) => {
        config.headers.Authorization = `Bearer ${token}`
        resolve(baseApi(config))
      },
      reject: (error: any) => {
        reject(error)
      },
    })
  })
}

baseApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest: InternalAxiosRequestConfig & { _retry: boolean } =
      error.config

    if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers["retry-after"]
      if (retryAfter) {
        const delay = parseInt(retryAfter, 10) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        return baseApi(originalRequest)
      }
    }

    if (error.response?.status === 401 && !isRefreshing) {
      originalRequest._retry = true
      isRefreshing = true

      try {
        const tokens = await fetchNewTokens()
        await updateNewTokens(tokens)
        originalRequest.headers.Authorization = `Bearer ${tokens.wildfire_token}`
        processQueue(null, tokens.wildfire_token)
        return baseApi(originalRequest)
      } catch (err) {
        processQueue(err, null)
        await logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (isRefreshing) {
      return await addToFailedQueue(originalRequest)
    }
    console.log(
      "Request failed with status other than 401 or 429:",
      error.response?.status
    )
    return Promise.reject(error)
  }
)

export default baseApi
