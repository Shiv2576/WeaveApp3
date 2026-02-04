import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";
import { PdfItem } from "../../types";
import PdfCard from "./PdfCard";

interface PdfGridProps {
  pdfs: PdfItem[];
  onOpenPdf: (pdf: PdfItem) => void; // Changed from (uri: string, name: string)
  onSharePdf: (pdf: PdfItem) => void; // Changed from (uri: string, name: string)
  onDeletePdf: (pdf: PdfItem) => void; // Changed from (uri: string, name: string)
  onSwitchToEditor?: () => void;
  emptyMessage?: string;
  emptySubtitle?: string;
  loading?: boolean;
  showDebugInfo?: boolean;
}

const PdfGrid: React.FC<PdfGridProps> = ({
  pdfs,
  onOpenPdf,
  onSharePdf,
  onDeletePdf,
  onSwitchToEditor,
  emptyMessage = "No PDFs Yet",
  emptySubtitle = "Generate your first PDF in the Editor tab",
  loading = false,
  showDebugInfo = false,
}) => {
  // Sort by modification time (newest first)
  const sortedPdfs = React.useMemo(() => {
    return [...pdfs].sort((a, b) => b.modificationTime - a.modificationTime);
  }, [pdfs]);

  const renderPdfItem = ({ item }: { item: PdfItem }) => (
    <PdfCard
      pdf={item}
      onOpen={() => onOpenPdf(item)}
      onShare={() => onSharePdf(item)}
      onDelete={() => onDeletePdf(item)}
    />
  );

  // Debug view to see all PDF data
  const renderDebugView = () => {
    if (!showDebugInfo) return null;

    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>
          Debug Info ({sortedPdfs.length} PDFs)
        </Text>
        {sortedPdfs.map((pdf, index) => (
          <View key={pdf.id} style={styles.debugItem}>
            <Text style={styles.debugText}>
              {index + 1}. {pdf.name}
            </Text>
            <Text style={styles.debugText}>
              Size: {pdf.rawSize} bytes • Modified:{" "}
              {new Date(pdf.modificationTime).toLocaleString()}
            </Text>
            <Text style={styles.debugText}>
              URI: {pdf.uri.substring(0, 50)}...
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons
          name="sync"
          size={48}
          color={Theme.Colors.primary}
          style={styles.loadingIcon}
        />
        <Text style={styles.loadingText}>Loading PDFs...</Text>
      </View>
    );
  }

  if (sortedPdfs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="document-outline"
          size={64}
          color={Theme.Colors.border}
        />
        <Text style={styles.emptyTitle}>{emptyMessage}</Text>
        <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>

        {onSwitchToEditor && (
          <TouchableOpacity
            style={styles.switchButton}
            onPress={onSwitchToEditor}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={Theme.Colors.textLight}
              style={styles.switchIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <>
      {renderDebugView()}
      <FlatList
        data={sortedPdfs}
        renderItem={renderPdfItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              Showing {sortedPdfs.length} PDF
              {sortedPdfs.length !== 1 ? "s" : ""}
            </Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: Theme.Spacing.screenPadding,
    paddingBottom: Theme.Spacing.xxl,
  },
  listHeader: {
    marginBottom: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  listHeaderText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textMuted,
    fontWeight: Theme.Typography.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.Spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Theme.Spacing.xl,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.Spacing.borderRadiusMD,
    gap: Theme.Spacing.sm,
    ...Theme.Shadows.sm,
  },
  switchIcon: {
    marginRight: Theme.Spacing.xs,
  },
  switchText: {
    color: Theme.Colors.textLight,
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    marginBottom: Theme.Spacing.md,
  },
  loadingText: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.textMuted,
  },
  debugContainer: {
    backgroundColor: Theme.Colors.background,
    padding: Theme.Spacing.md,
    margin: Theme.Spacing.md,
    borderRadius: Theme.Spacing.borderRadiusMD,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  debugTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  debugItem: {
    paddingVertical: Theme.Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.borderLight,
  },
  debugText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textMuted,
    fontFamily: "monospace",
    marginBottom: 2,
  },
});

export default PdfGrid;
