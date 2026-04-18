import Constants from "expo-constants";
import { Platform } from "react-native";

function getDefaultApiUrl(): string {
  if (Platform.OS === "web") return "http://localhost:8080";
  return `http://${Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost"}:8080`;
}

export const API_URL: string =
  Constants.expoConfig?.extra?.apiUrl ?? getDefaultApiUrl();
