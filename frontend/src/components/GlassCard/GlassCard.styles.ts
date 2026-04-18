import {StyleSheet} from "react-native";
import type {ThemeColors} from "@/constants/theme";
import { spacing, borderRadius} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        card: {
            backgroundColor: colors.glass,
            borderRadius: borderRadius.lg + 4,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            padding: spacing.xl,
            shadowColor: colors.black,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
        },
        cardPressed: {
            backgroundColor: colors.glassSelected,
            borderColor: colors.glassSelectedBorder,
            transform: [{scale: 0.96}],
        },
    });
