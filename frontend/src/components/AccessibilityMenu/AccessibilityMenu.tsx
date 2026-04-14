import { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocaleStore, Locale } from "@/stores/localeStore";
import { useThemeStore } from "@/stores/themeStore";
import { useTranslation } from "@/hooks/useTranslation";
import { createStyles } from "./AccessibilityMenu.styles";

const LANGUAGES: { code: Locale; labelKey: string }[] = [
  { code: "en", labelKey: "common.english" },
  { code: "bg", labelKey: "common.bulgarian" },
];

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const triggerRef = useRef<View>(null);
  const { locale, setLocale } = useLocaleStore();
  const { mode, colors, toggleMode } = useThemeStore();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isDark = mode === "dark";

  const handleOpen = () => {
    triggerRef.current?.measureInWindow((_x, y, _w, h) => {
      setMenuTop(y + h + 4);
      setOpen(true);
    });
  };

  const handleSelectLocale = (code: Locale) => {
    setLocale(code);
  };

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        style={styles.trigger}
        onPress={handleOpen}
        accessibilityLabel={t("common.accessibility")}
        accessibilityRole="button"
      >
        <Text style={styles.triggerText}>{t("common.accessibility")}</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.menu, { top: menuTop }]}>
              {/* Dark Mode Section */}
              <Text style={styles.sectionLabel}>{t("common.darkMode")}</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t("common.darkMode")}</Text>
                <TouchableOpacity
                  style={[styles.toggle, isDark ? styles.toggleOn : styles.toggleOff]}
                  onPress={toggleMode}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      isDark ? styles.toggleTextOn : styles.toggleTextOff,
                    ]}
                  >
                    {isDark ? t("common.on") : t("common.off")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Language Section */}
              <Text style={styles.sectionLabel}>{t("common.language")}</Text>
              {LANGUAGES.map(({ code, labelKey }) => {
                const active = locale === code;
                return (
                  <TouchableOpacity
                    key={code}
                    style={[styles.option, active && styles.optionActive]}
                    onPress={() => handleSelectLocale(code)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        active && styles.optionTextActive,
                      ]}
                    >
                      {t(labelKey)}
                    </Text>
                    {active && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
