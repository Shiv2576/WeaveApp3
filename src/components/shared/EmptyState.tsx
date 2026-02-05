import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "document-outline",
  title,
  subtitle,
  actionText = "Go to Editor",
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={72} color={Theme.Colors.border} />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle - supports multiline with \n */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {/* Action Button */}
      {onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 48,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Theme.Spacing.borderRadiusMD,
    minWidth: 160,
    alignItems: "center",
    ...Theme.Shadows.sm,
  },
  actionText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.regular,
    color: Theme.Colors.textLight,
  },
});

export default EmptyState;
