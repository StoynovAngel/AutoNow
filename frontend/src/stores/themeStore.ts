import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { lightColors, darkColors, ThemeColors } from "@/constants/theme";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "app_theme";
const BLOBS_KEY = "app_show_blobs";

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  showBlobs: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  toggleBlobs: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  colors: lightColors,
  showBlobs: true,

  setMode: (mode) => {
    set({ mode, colors: mode === "dark" ? darkColors : lightColors });
    SecureStore.setItemAsync(THEME_KEY, mode);
  },

  toggleMode: () => {
    const next = get().mode === "light" ? "dark" : "light";
    get().setMode(next);
  },

  toggleBlobs: () => {
    const next = !get().showBlobs;
    set({ showBlobs: next });
    SecureStore.setItemAsync(BLOBS_KEY, String(next));
  },
}));

export async function hydrateTheme(): Promise<void> {
  const stored = await SecureStore.getItemAsync(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    useThemeStore.getState().setMode(stored);
  }
  const blobs = await SecureStore.getItemAsync(BLOBS_KEY);
  if (blobs === "false") {
    useThemeStore.setState({ showBlobs: false });
  }
}
