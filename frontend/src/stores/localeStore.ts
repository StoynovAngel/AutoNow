import { create } from "zustand";
import { getLocales } from "expo-localization";
import * as SecureStore from "expo-secure-store";

export type Locale = "en" | "bg";

const LOCALE_KEY = "app_locale";

function getDeviceLocale(): Locale {
  const deviceLang = getLocales()[0]?.languageCode;
  return deviceLang === "bg" ? "bg" : "en";
}

interface LocaleState {
  locale: Locale;
  isHydrated: boolean;
  setLocale: (locale: Locale) => void;
  setHydrated: () => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: getDeviceLocale(),
  isHydrated: false,

  setLocale: (locale) => {
    set({ locale });
    SecureStore.setItemAsync(LOCALE_KEY, locale);
  },

  setHydrated: () => set({ isHydrated: true }),
}));

export async function hydrateLocale(): Promise<void> {
  const stored = await SecureStore.getItemAsync(LOCALE_KEY);
  if (stored === "en" || stored === "bg") {
    useLocaleStore.setState({ locale: stored });
  }
  useLocaleStore.getState().setHydrated();
}
