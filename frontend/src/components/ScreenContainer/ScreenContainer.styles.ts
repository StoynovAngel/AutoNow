import {StyleSheet} from "react-native";
import type {ThemeColors} from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        centered: {
            justifyContent: "center",
            alignItems: "center",
        },
    });
