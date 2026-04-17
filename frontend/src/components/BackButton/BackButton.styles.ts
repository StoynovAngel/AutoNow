import {StyleSheet} from "react-native";
import {ThemeColors, spacing, fontSize, fontWeight} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        button: {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            alignSelf: "flex-start",
        },
        text: {
            fontSize: fontSize.lg,
            color: colors.primary,
            fontWeight: fontWeight.medium,
        },
    });
