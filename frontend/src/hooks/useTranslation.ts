import { useCallback } from "react";
import { useLocaleStore } from "@/stores/localeStore";
import en from "@/constants/locales/en.json";
import bg from "@/constants/locales/bg.json";

const translations = { en, bg } as const;

type Translations = typeof en;

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const strings: Translations = translations[locale];

  const t = useCallback(
    (key: string): string => getNestedValue(strings, key),
    [strings],
  );

  return { t, locale };
}

// For use outside React components (e.g., Axios interceptors)
export function translate(key: string): string {
  const locale = useLocaleStore.getState().locale;
  return getNestedValue(translations[locale], key);
}
