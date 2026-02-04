// theme.ts
export const Colors = {
  // Primary Colors
  primary: "#061E29", // Deep Navy Blue
  primaryLight: "#1D546D", // Ocean Blue
  secondary: "#5F9598", // Teal Green
  accent: "#5F9598", // Same as secondary for consistency

  // Neutral Colors
  background: "#F3F4F4", // Light Gray
  surface: "#FFFFFF", // White
  card: "#FFFFFF", // White

  // Text Colors
  textPrimary: "#061E29", // Deep Navy Blue
  textSecondary: "#1D546D", // Ocean Blue
  textTertiary: "#5F9598", // Teal Green
  textLight: "#F3F4F4", // Light Gray
  textMuted: "#8B9599", // Medium Gray (derived)
  textDisabled: "#C5C9CA", // Light Gray (derived)

  // Status Colors
  success: "#4CAF50", // Green
  error: "#FF3B30", // Red
  warning: "#FF9500", // Orange
  info: "#007AFF", // Blue

  // Border Colors
  border: "#E5E7E8", // Light Gray (derived)
  borderLight: "#F3F4F4", // Light Gray
  borderDark: "#061E29", // Deep Navy Blue

  // Overlay Colors
  overlay: "rgba(6, 30, 41, 0.6)", // Dark overlay
  overlayLight: "rgba(243, 244, 244, 0.8)", // Light overlay
} as const;

export const Spacing = {
  // Base spacing unit (4px)
  base: 4,

  // Spacing scale (multiples of base)
  xs: 4, // 4px
  sm: 8, // 8px
  md: 16, // 16px
  lg: 24, // 24px
  xl: 32, // 32px
  xxl: 48, // 48px
  xxxl: 64, // 64px

  // Component-specific spacing
  screenPadding: 16,
  cardPadding: 16,
  buttonPaddingVertical: 12,
  buttonPaddingHorizontal: 20,
  inputPaddingVertical: 12,
  inputPaddingHorizontal: 16,

  // Border radius
  borderRadiusXS: 4,
  borderRadiusSM: 8,
  borderRadiusMD: 12,
  borderRadiusLG: 16,
  borderRadiusXL: 24,
  borderRadiusRound: 9999,
} as const;

export const Typography = {
  // Font families (using default system fonts - customize as needed)
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
    light: "System",
  },

  // Font sizes
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
    display: 40,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Font weights
  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const Shadows = {
  // Elevation levels
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  xs: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  sm: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  lg: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  xl: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const Gradients = {
  primary: ["#061E29", "#1D546D"],
  secondary: ["#1D546D", "#5F9598"],
  light: ["#F3F4F4", "#FFFFFF"],
  accent: ["#5F9598", "#7AB5B8"],
} as const;

// Component-specific theme configurations
export const Components = {
  Button: {
    primary: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
      textColor: Colors.textLight,
    },
    secondary: {
      backgroundColor: Colors.secondary,
      borderColor: Colors.secondary,
      textColor: Colors.textLight,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: Colors.primary,
      textColor: Colors.primary,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      textColor: Colors.primary,
    },
  },

  Card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.borderRadiusMD,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  Input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadiusMD,
    paddingVertical: Spacing.inputPaddingVertical,
    paddingHorizontal: Spacing.inputPaddingHorizontal,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },

  Tab: {
    active: {
      backgroundColor: Colors.primary,
      color: Colors.textLight,
    },
    inactive: {
      backgroundColor: Colors.background,
      color: Colors.textMuted,
    },
  },
} as const;

// Animation constants
export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: "easeInOut",
    linear: "linear",
    spring: "spring",
  },
} as const;

// Breakpoints for responsive design
export const Breakpoints = {
  small: 375,
  medium: 768,
  large: 1024,
  xlarge: 1280,
} as const;

// Export everything as a single theme object
export const Theme = {
  Colors,
  Spacing,
  Typography,
  Shadows,
  Gradients,
  Components,
  Animation,
  Breakpoints,
} as const;

// Type exports
export type ThemeColors = typeof Colors;
export type ThemeSpacing = typeof Spacing;
export type ThemeTypography = typeof Typography;
export type ThemeShadows = typeof Shadows;
export type ThemeComponents = typeof Components;

export default Theme;
