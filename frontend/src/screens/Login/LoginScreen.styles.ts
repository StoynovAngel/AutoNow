import { StyleSheet } from "react-native";
import { ThemeColors, spacing, fontSize, borderRadius } from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xxl,
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: spacing.xs,
      color: colors.text,
    },
    subtitle: {
      fontSize: fontSize.lg,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.xl,
    },
    inputGroup: { marginBottom: spacing.md },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      fontSize: fontSize.lg,
      backgroundColor: colors.inputBackground,
      color: colors.text,
    },
    inputError: { borderColor: colors.error },
    fieldError: {
      color: colors.error,
      fontSize: fontSize.sm,
      marginTop: spacing.xs,
      marginLeft: spacing.xs,
    },
    apiError: {
      color: colors.error,
      fontSize: fontSize.md,
      textAlign: "center",
      marginBottom: spacing.md,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: "center",
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: colors.white, fontSize: 17, fontWeight: "600" },
    link: { textAlign: "center", color: colors.textSecondary, fontSize: fontSize.md },
    linkBold: { color: colors.primary, fontWeight: "600" },
  });
