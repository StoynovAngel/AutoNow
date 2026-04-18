import {StyleSheet} from "react-native";
import type {ThemeColors} from "@/constants/theme";
import { spacing, fontSize, borderRadius, fontWeight} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        card: {
            backgroundColor: colors.glass,
            borderRadius: borderRadius.lg,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            overflow: "hidden",
            marginTop: spacing.sm,
        },
        image: {
            width: "100%",
            height: 160,
        },
        content: {
            padding: spacing.md,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.xs,
        },
        name: {
            fontSize: fontSize.xl,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            flexShrink: 1,
        },
        badge: {
            backgroundColor: colors.glassSelected,
            borderWidth: 1,
            borderColor: colors.glassSelectedBorder,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: borderRadius.sm,
            marginLeft: spacing.sm,
        },
        badgeText: {
            fontSize: fontSize.xs,
            fontWeight: fontWeight.medium,
            color: colors.primary,
        },
        description: {
            fontSize: fontSize.md,
            color: colors.textSecondary,
            marginBottom: spacing.sm,
        },
        address: {
            fontSize: fontSize.sm,
            color: colors.textDisabled,
        },
    });
