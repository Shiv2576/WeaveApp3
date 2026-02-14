import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";

interface AddImageButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  imageCount?: number; // Optional state feedback
}

const AddImageButton: React.FC<AddImageButtonProps> = ({
  onPress,
  disabled = false,
  label = "Add Images",
  loading = false,
  imageCount = 0,
}) => {
  const hasImages = imageCount > 0;
  const baseColor = Theme.Colors.primary;
  const backgroundColor = disabled
    ? "#F3F4F4"
    : hasImages
      ? "#F8F9FA" // Subtle off-white when images exist
      : "#FFFFFF"; // Pure white when empty

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: baseColor,
          opacity: disabled || loading ? 0.8 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.92} // Gentle press dimming on light background
    >
      {loading ? (
        <ActivityIndicator color={baseColor} size="small" />
      ) : (
        <View style={styles.content}>
          <Ionicons
            name="add"
            size={20}
            color={baseColor}
            style={{ transform: [{ translateY: -0.5 }] }} // Micro vertical alignment
          />
          <Text style={[styles.text, { color: baseColor }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Theme.Spacing.borderRadiusMD,
    paddingVertical: Theme.Spacing.md - 2,
    paddingHorizontal: Theme.Spacing.lg,
    marginHorizontal: Theme.Spacing.md,
    marginVertical: Theme.Spacing.sm,
    ...Theme.Shadows.xs,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.Spacing.sm - 2,
  },
  text: {
    fontSize: Theme.Typography.fontSize.base - 1,
    fontWeight: Theme.Typography.fontWeight.semibold,
    letterSpacing: 0.25,
  },
});

export default AddImageButton;
