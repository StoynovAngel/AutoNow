import { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useTranslation } from "@/hooks/useTranslation";
import { createStyles } from "./HomeScreen.styles";

export default function HomeScreen() {
  const userEmail = useAuthStore((s) => s.userEmail);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const colors = useThemeStore((s) => s.colors);
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      {userEmail && <Text style={styles.email}>{userEmail}</Text>}
      <Text style={styles.placeholder}>{t("home.placeholder")}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={clearAuth}>
        <Text style={styles.logoutText}>{t("home.logout")}</Text>
      </TouchableOpacity>
    </View>
  );
}
