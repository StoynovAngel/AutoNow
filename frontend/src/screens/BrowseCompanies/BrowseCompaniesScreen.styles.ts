import {StyleSheet} from "react-native";
import {ThemeColors, spacing, fontSize} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        listContent: {
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.lg,
        },
        centered: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
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
