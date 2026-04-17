import { StyleSheet, TextStyle } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createHeaderScreenOptions = (colors: ThemeColors) =>
  ({
    headerTitle: "",
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
  }) as const;

export const createHeaderTitleStyle = (colors: ThemeColors): TextStyle =>
  ({
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
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
