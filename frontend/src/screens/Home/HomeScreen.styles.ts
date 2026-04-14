import { StyleSheet } from "react-native";
import { ThemeColors, spacing, fontSize, borderRadius, fontWeight } from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: fontSize.lg,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    listContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    cardName: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      color: colors.text,
      flexShrink: 1,
    },
    badge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      marginLeft: spacing.sm,
    },
    badgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: colors.white,
    },
    cardDescription: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    cardAddress: {
      fontSize: fontSize.sm,
      color: colors.textDisabled,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      fontSize: fontSize.lg,
      color: colors.textDisabled,
      textAlign: "center",
    },
    errorText: {
      fontSize: fontSize.lg,
      color: colors.error,
      textAlign: "center",
    },
  });
