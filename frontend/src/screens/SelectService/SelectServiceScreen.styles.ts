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
        grid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: spacing.md,
            maxWidth: 340,
        },
        card: {
            width: 150,
            minHeight: 120,
            alignItems: "center",
            justifyContent: "center",
        },
        cardText: {
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            textAlign: "center",
        },
    });
