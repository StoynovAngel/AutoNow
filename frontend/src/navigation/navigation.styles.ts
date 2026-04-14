import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";
import AccessibilityMenu from "@/components/AccessibilityMenu/AccessibilityMenu";

export const createHeaderScreenOptions = (colors: ThemeColors) =>
  ({
    headerTitle: "",
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerRight: () => AccessibilityMenu(),
  }) as const;

export const createTabBarStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    },
  });

export const createTabBarColors = (colors: ThemeColors) =>
  ({
    activeTintColor: colors.primary,
    inactiveTintColor: colors.textDisabled,
  }) as const;
