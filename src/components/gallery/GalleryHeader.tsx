import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";

interface GalleryHeaderProps {
  title?: string;
  subtitle?: string;
  count?: number;
  showActions?: boolean;
  onAdd?: () => void;
  onSearch?: () => void;
  loading?: boolean;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title = "Gallery",
  subtitle = "Your documents",
  count = 0,
  showActions = true,
  onAdd,
  onSearch,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Left side: Title and subtitle */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right side: Count and actions */}
      <View style={styles.rightSection}>
        {/* Count badge */}
        {count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}

        {/* Action buttons */}
        {showActions && (
          <View style={styles.actions}>
            {onSearch && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onSearch}
                disabled={loading}
              >
                <Ionicons
                  name="search"
                  size={22}
                  color={Theme.Colors.primary}
                />
              </TouchableOpacity>
            )}

            {onAdd && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onAdd}
                disabled={loading}
              >
                <Ionicons name="add" size={22} color={Theme.Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.Colors.surface,
    paddingHorizontal: Theme.Spacing.screenPadding,
    paddingVertical: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textMuted,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.Spacing.sm,
  },
  countBadge: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.Spacing.borderRadiusRound,
    minWidth: 28,
    alignItems: "center",
  },
  countText: {
    color: Theme.Colors.textLight,
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.Spacing.xs,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.Colors.background,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
});

export default GalleryHeader;
