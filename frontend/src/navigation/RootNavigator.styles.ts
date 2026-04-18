import { StyleSheet } from "react-native";
import type { ThemeColors } from "@/constants/theme";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
  });
