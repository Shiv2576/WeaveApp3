import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";

interface GalleryHeaderProps {
  title?: string;
  subtitle?: string;
  count?: number;
  onRefresh?: () => void;
  loading?: boolean;
  refreshing?: boolean;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title = "Gallery",
  subtitle = "Your documents",
  count = 0,
  onRefresh,
  loading = false,
  refreshing = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Left side: Title and subtitle */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right side: Count and refresh button */}
      <View style={styles.rightSection}>
        {/* Count badge - only show if count > 0 */}
        {count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              (loading || refreshing) && styles.actionButtonDisabled,
            ]}
            onPress={onRefresh}
            disabled={loading || refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={Theme.Colors.primary} />
            ) : (
              <Ionicons
                name="refresh"
                size={20}
                color={loading ? Theme.Colors.textMuted : Theme.Colors.primary}
              />
            )}
          </TouchableOpacity>
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
    justifyContent: "center",
  },
  countText: {
    color: Theme.Colors.textLight,
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
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
  actionButtonDisabled: {
    opacity: 0.5,
    borderColor: Theme.Colors.borderLight,
  },
});

export default GalleryHeader;
