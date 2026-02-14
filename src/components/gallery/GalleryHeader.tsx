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
    <View style={styles.wrapper}>
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
                  color={
                    loading ? Theme.Colors.textMuted : Theme.Colors.primary
                  }
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingVertical: 25,
    marginVertical: -25,
    marginHorizontal: -20,
    backgroundColor: Theme.Colors.background,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.Colors.surface,
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderWidth: 0.8,
    borderColor: "#B8C1C7",
    borderRadius: Theme.Spacing.borderRadiusMD,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    fontFamily: "serif",
    color: "#fffff",
    letterSpacing: 0.25,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.sm - 1,
    fontWeight: Theme.Typography.fontWeight.regular,
    fontFamily: "serif",
    color: "#fffff",
    letterSpacing: 0.25,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.Spacing.sm,
  },
  countBadge: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.Spacing.borderRadiusRound,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    fontFamily: "serif",
    color: "#9CA5AB",
    letterSpacing: 0.25,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.Colors.background,
    borderWidth: 0.8,
    borderColor: "#B8C1C7",
  },
  actionButtonDisabled: {
    opacity: 0.5,
    borderColor: "#D0D6DB",
  },
});

export default GalleryHeader;
