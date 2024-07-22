declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SPOTIFY_CLIENT_ID: string
      EXPO_PUBLIC_API_URL: string
      NODE_ENV: "development" | "production"
      PORT?: string
      PWD: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
