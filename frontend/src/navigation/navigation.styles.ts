import { StyleSheet, TextStyle } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createHeaderScreenOptions = (colors: ThemeColors) =>
  ({
    headerTitle: "",
    headerShadowVisible: false,
    headerStyle: { backgroundColor: "#00E8C5" },
  }) as const;

export const createHeaderTitleStyle = (colors: ThemeColors): TextStyle =>
  ({
    color: colors.text,
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Courier New",
  });

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
