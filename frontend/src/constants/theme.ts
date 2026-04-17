export type ThemeColors = { [K in keyof typeof lightColors]: string };

export const lightColors = {
  background: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceLight: "#aa9cfe",

  text: "#1A1A1A",
  textSecondary: "#5C5C5C",
  textDisabled: "#9E9E9E",

  primary: "#2D6A4F",
  primaryLight: "#40916C",

  accent: "#B5651D",

  error: "#C0392B",
  errorLight: "#E74C3C",

  warning: "#D4A017",

  success: "#2D6A4F",

  border: "#D6D3CC",
  borderLight: "#E8E6E1",

  inputBackground: "#FFFFFF",
  inputBorder: "#D6D3CC",
  inputFocusBorder: "#2D6A4F",

  white: "#FFFFFF",
  black: "#1A1A1A",
  transparent: "transparent",

  glass: "rgba(255, 255, 255, 0.6)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
  glassSelected: "rgba(45, 106, 79, 0.25)",
  glassSelectedBorder: "rgba(45, 106, 79, 0.4)",
} as const;

export const darkColors: ThemeColors = {
  background: "#121212",
  surface: "#1E1E1E",
  surfaceLight: "#2A2A2A",

  text: "#E8E6E1",
  textSecondary: "#A8A8A8",
  textDisabled: "#6B6B6B",

  primary: "#40916C",
  primaryLight: "#52B788",

  accent: "#D4913A",

  error: "#E5534B",
  errorLight: "#F2716B",

  warning: "#E8A638",

  success: "#40916C",

  border: "#333333",
  borderLight: "#3D3D3D",

  inputBackground: "#1E1E1E",
  inputBorder: "#333333",
  inputFocusBorder: "#40916C",

  white: "#FFFFFF",
  black: "#121212",
  transparent: "transparent",

  glass: "rgba(30, 30, 30, 0.6)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
  glassSelected: "rgba(82, 183, 136, 0.25)",
  glassSelectedBorder: "rgba(82, 183, 136, 0.4)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 16,
  xl: 20,
  xxl: 28,
  title: 32,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

// iOS: San Francisco, Android: Roboto.
export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};
