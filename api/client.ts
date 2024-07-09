import Constants from "expo-constants"
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

type FailedQueueItem = {
  resolve: (token: string) => void
  reject: (error: any) => void
}

const baseApi: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.141:4001/api/v1",
})

const fetchNewTokens = async (): Promise<TokenResponse> => {
  const refreshToken = getSpotifyRefreshToken()
  const response = await baseApi.post<TokenResponse>("/auth/refresh_token", {
    refreshToken,
  })
  return response.data
}

// TO DO: UPDATE SPOTIFY ACCESS,REFRSH TOKENS ALSO
const updateNewTokens = (tokens: TokenResponse) => {
  setAccessToken(tokens.wildfire_token)
  setSpotifyAccessToken(tokens.spotify_auth.access_token)
  setSpotifyRefreshToken(tokens.spotify_auth.refresh_token)
  baseApi.defaults.headers.common.Authorization = `Bearer ${tokens.wildfire_token}`
}

baseApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken()
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
    const originalRequest = error.config

    if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers["retry-after"]
      if (retryAfter) {
        const delay = parseInt(retryAfter, 10) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        return baseApi(originalRequest)
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return await addToFailedQueue(originalRequest)
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const tokens = await fetchNewTokens()
        updateNewTokens(tokens)
        originalRequest.headers.Authorization = `Bearer ${tokens.wildfire_token}`
        processQueue(null, tokens.wildfire_token)
        return baseApi(originalRequest)
      } catch (err) {
        processQueue(err, null)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default baseApi
