import {StyleSheet} from "react-native";
import {ThemeColors, spacing, fontSize, borderRadius} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: 12,
            marginTop: spacing.md,
            fontSize: fontSize.lg,
            backgroundColor: colors.inputBackground,
            color: colors.text,
        },
    });
