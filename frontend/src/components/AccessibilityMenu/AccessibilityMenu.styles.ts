import {StyleSheet} from "react-native";
import {borderRadius, fontSize, spacing, ThemeColors} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        trigger: {
            paddingHorizontal: spacing.md,
            alignSelf: "stretch",
            justifyContent: "center",
            backgroundColor: colors.surfaceLight,
        },
        triggerText: {
            fontSize: fontSize.md,
            fontWeight: "600",
            color: colors.text,
        },
        overlay: {
            flex: 1,
        },
        menu: {
            position: "absolute",
            top: 0,
            right: spacing.md,
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: spacing.sm,
            minWidth: 220,
            shadowColor: colors.black,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        sectionLabel: {
            fontSize: fontSize.xs,
            color: colors.textDisabled,
            fontWeight: "600",
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xs,
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },
        divider: {
            height: 1,
            backgroundColor: colors.borderLight,
            marginVertical: spacing.sm,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
        },
        rowLabel: {
            fontSize: fontSize.md,
            color: colors.text,
        },
        toggle: {
            paddingHorizontal: spacing.sm + 4,
            paddingVertical: spacing.xs + 2,
            borderRadius: borderRadius.sm,
            borderWidth: 1,
        },
        toggleOn: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        toggleOff: {
            backgroundColor: colors.transparent,
            borderColor: colors.border,
        },
        toggleText: {
            fontSize: fontSize.sm,
            fontWeight: "600",
        },
        toggleTextOn: {
            color: colors.white,
        },
        toggleTextOff: {
            color: colors.textSecondary,
        },
        option: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
        },
        optionActive: {
            backgroundColor: colors.surfaceLight,
        },
        optionText: {
            fontSize: fontSize.md,
            color: colors.text,
        },
        optionTextActive: {
            color: colors.primary,
            fontWeight: "600",
        },
        checkmark: {
            fontSize: fontSize.md,
            color: colors.primary,
        },
    });
