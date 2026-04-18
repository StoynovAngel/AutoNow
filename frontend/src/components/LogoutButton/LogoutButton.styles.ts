import {StyleSheet} from "react-native";
import type {ThemeColors} from "@/constants/theme";
import { spacing} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        button: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.error,
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing.md,
        },
        icon: {
            fontSize: 18,
            color: colors.white,
        },
    });
