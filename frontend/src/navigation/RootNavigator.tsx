import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { createStyles } from "./RootNavigator.styles";

export default function RootNavigator() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const token = useAuthStore((s) => s.token);
  const colors = useThemeStore((s) => s.colors);
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return token ? <MainTabs /> : <AuthStack />;
}
