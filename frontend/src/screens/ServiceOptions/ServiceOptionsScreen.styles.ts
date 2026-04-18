import {StyleSheet} from "react-native";
import {ThemeColors, spacing, fontSize, fontWeight} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        wrapper: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            paddingBottom: spacing.lg,
            textAlign: "center",
        },
        container: {
            paddingHorizontal: spacing.lg,
            alignItems: "center",
            width: "100%",
        },
        card: {
            width: "100%",
            maxWidth: 320,
        },
        cardTitle: {
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.xs,
            textAlign: "center",
        },
        cardDescription: {
            fontSize: fontSize.md,
            color: colors.textSecondary,
            textAlign: "center",
        },
    });
