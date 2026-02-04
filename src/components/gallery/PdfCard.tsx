import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";
import { PdfItem } from "../../types";

interface PdfCardProps {
  pdf: PdfItem;
  onOpen: (uri: string, name: string) => void;
  onShare: (uri: string, name: string) => void;
  onDelete: (uri: string, name: string) => void;
}

const PdfCard: React.FC<PdfCardProps> = ({
  pdf,
  onOpen,
  onShare,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {/* PDF Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="document-text" size={32} color={Theme.Colors.error} />
      </View>

      {/* PDF Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {pdf.name}
        </Text>
        <Text style={styles.meta}>
          {pdf.size} • Created: {pdf.date}
        </Text>
        {/* Optional: Show raw size for debugging */}
        {/* <Text style={styles.debugMeta}>
          ID: {pdf.id.substring(0, 8)}... • Modified: {new Date(pdf.modificationTime).toLocaleTimeString()}
        </Text> */}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {/* Open/View */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onOpen(pdf.uri, pdf.name)}
          activeOpacity={0.7}
        >
          <Ionicons name="eye-outline" size={22} color={Theme.Colors.info} />
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare(pdf.uri, pdf.name)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="share-outline"
            size={22}
            color={Theme.Colors.success}
          />
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(pdf.uri, pdf.name)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color={Theme.Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Spacing.borderRadiusMD,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    ...Theme.Shadows.sm,
  },
  iconContainer: {
    marginRight: Theme.Spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textMuted,
  },
  debugMeta: {
    fontSize: Theme.Typography.fontSize.xxs,
    color: Theme.Colors.textDisabled,
    marginTop: 2,
    fontFamily: "monospace",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Theme.Spacing.sm,
  },
  actionButton: {
    padding: Theme.Spacing.xs,
    borderRadius: Theme.Spacing.borderRadiusSM,
    backgroundColor: Theme.Colors.background,
  },
});

export default PdfCard;
