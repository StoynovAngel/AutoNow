import { StyleSheet } from "react-native";
import { ThemeColors, spacing, fontSize, borderRadius } from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: "700",
      color: colors.text,
      marginBottom: spacing.sm,
    },
    email: {
      fontSize: fontSize.lg,
      color: colors.primary,
      marginBottom: spacing.md,
    },
    placeholder: {
      fontSize: fontSize.md,
      color: colors.textDisabled,
      marginBottom: spacing.xxl,
    },
    logoutButton: {
      paddingHorizontal: spacing.xl,
      paddingVertical: 14,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.error,
    },
    logoutText: {
      color: colors.error,
      fontSize: fontSize.lg,
      fontWeight: "600",
    },
  });
