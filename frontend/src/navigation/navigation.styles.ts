import type { TextStyle } from "react-native";
import { StyleSheet } from "react-native";
import type { ThemeColors } from "@/constants/theme";

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

export const createIslandHeaderStyles = (colors: ThemeColors, topInset: number) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: topInset,
      backgroundColor: colors.background,
    },
    island: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 12,
      marginVertical: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
    },
    logo: {
      width: 36,
      height: 36,
    },
  });

export const mainContentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
