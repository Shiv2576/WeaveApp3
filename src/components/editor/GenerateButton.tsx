import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";

interface GeneratePdfButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  imageCount?: number;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  imageCount = 0,
  label = "Generate PDF",
  variant = "primary",
  size = "medium",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          container: styles.secondaryButton,
          text: styles.secondaryText,
          icon: Theme.Colors.secondary,
        };
      case "outline":
        return {
          container: styles.outlineButton,
          text: styles.outlineText,
          icon: Theme.Colors.primary,
        };
      default: // primary
        return {
          container: styles.primaryButton,
          text: styles.primaryText,
          icon: Theme.Colors.textLight,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          container: styles.smallButton,
          text: styles.smallText,
          iconSize: 16,
        };
      case "large":
        return {
          container: styles.largeButton,
          text: styles.largeText,
          iconSize: 24,
        };
      default: // medium
        return {
          container: styles.mediumButton,
          text: styles.mediumText,
          iconSize: 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonText = imageCount > 0 ? `${label} (${imageCount})` : label;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.container,
        sizeStyles.container,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline"
              ? Theme.Colors.primary
              : Theme.Colors.textLight
          }
        />
      ) : (
        <View style={styles.content}>
          <Ionicons
            name="document-text-outline"
            size={sizeStyles.iconSize}
            color={variantStyles.icon}
            style={styles.icon}
          />
          <Text style={[styles.text, variantStyles.text, sizeStyles.text]}>
            {buttonText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.Spacing.borderRadiusMD,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Theme.Shadows.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: Theme.Spacing.sm,
  },
  text: {
    fontWeight: Theme.Typography.fontWeight.semibold,
    letterSpacing: Theme.Typography.letterSpacing.tight,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: Theme.Colors.primary,
    borderWidth: 0,
  },
  primaryText: {
    color: Theme.Colors.textLight,
  },
  secondaryButton: {
    backgroundColor: Theme.Colors.secondary,
    borderWidth: 0,
  },
  secondaryText: {
    color: Theme.Colors.textLight,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Theme.Colors.primary,
  },
  outlineText: {
    color: Theme.Colors.primary,
  },
  // Size styles
  smallButton: {
    paddingVertical: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.md,
  },
  smallText: {
    fontSize: Theme.Typography.fontSize.sm,
  },
  mediumButton: {
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
  },
  mediumText: {
    fontSize: Theme.Typography.fontSize.base,
  },
  largeButton: {
    paddingVertical: Theme.Spacing.lg,
    paddingHorizontal: Theme.Spacing.xl,
  },
  largeText: {
    fontSize: Theme.Typography.fontSize.lg,
  },
  // States
  disabledButton: {
    opacity: 0.5,
  },
});

export default GeneratePdfButton;
