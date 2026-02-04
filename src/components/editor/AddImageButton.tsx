import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";
import { ActivityIndicator } from "react-native";

interface AddImageButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
}

const AddImageButton: React.FC<AddImageButtonProps> = ({
  onPress,
  disabled = false,
  label = "Add Images",
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <>
          <Ionicons name="add" size={22} color="white" />
          <Text style={styles.text}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.Spacing.borderRadiusMD,
    gap: Theme.Spacing.sm,
    margin: Theme.Spacing.md,
    ...Theme.Shadows.sm,
  },
  text: {
    color: Theme.Colors.textLight,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AddImageButton;
