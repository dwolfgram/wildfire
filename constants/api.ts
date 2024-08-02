export const API_URL = __DEV__
  ? "http://192.168.1.141:4001/api/v1"
  : process.env.EXPO_PUBLIC_API_URL
