import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { lightColors, darkColors, ThemeColors } from "@/constants/theme";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "app_theme";

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  colors: lightColors,

  setMode: (mode) => {
    set({ mode, colors: mode === "dark" ? darkColors : lightColors });
    SecureStore.setItemAsync(THEME_KEY, mode);
  },

  toggleMode: () => {
    const next = get().mode === "light" ? "dark" : "light";
    get().setMode(next);
  },
}));

export async function hydrateTheme(): Promise<void> {
  const stored = await SecureStore.getItemAsync(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    useThemeStore.getState().setMode(stored);
  }
}
