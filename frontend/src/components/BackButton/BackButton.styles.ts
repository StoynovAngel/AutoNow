import {StyleSheet} from "react-native";
import {ThemeColors, spacing, fontSize, fontWeight} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        button: {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
        },
        text: {
            fontSize: fontSize.lg,
            color: colors.primary,
            fontWeight: fontWeight.medium,
        },
    });
