// GalleryScreen.tsx (COMPLETE)
import React, { useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { usePdfManagement } from "../hooks/usePdfManagement";
import GalleryHeader from "../components/gallery/GalleryHeader";
import PdfList from "../components/gallery/PdfList";
import EmptyState from "../components/shared/EmptyState";
import SPACING from "../styles/themeConstants";
import { PdfItem } from "../types";

interface GalleryScreenProps {
  onSwitchToEditor: () => void;
}

const Gallery: React.FC<GalleryScreenProps> = ({ onSwitchToEditor }) => {
  const { pdfs, loadPdfs, handleOpenPdf, handleSharePdf, handleDeletePdf } =
    usePdfManagement();

  useEffect(() => {
    loadPdfs();
  });

  const handleDelete = (pdfUri: string, fileName: string) => {
    Alert.alert(
      "Delete PDF",
      `Are you sure you want to delete "${fileName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await handleDeletePdf(pdfUri, fileName);
              loadPdfs(); // ✅ Reload after delete
              Alert.alert("Success", "PDF deleted successfully");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete PDF");
            }
          },
        },
      ],
    );
  };

  const handleOpen = async (pdfUri: string, fileName: string) => {
    try {
      await handleOpenPdf(pdfUri, fileName);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to open PDF");
    }
  };

  const handleShare = async (pdfUri: string, fileName: string) => {
    try {
      await handleSharePdf(pdfUri, fileName);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to share PDF");
    }
  };

  const handlePdfOpen = async (pdf: PdfItem) => {
    await handleOpenPdf(pdf.uri, pdf.name);
  };

  const handlePdfShare = async (pdf: PdfItem) => {
    await handleSharePdf(pdf.uri, pdf.name);
  };

  // Delete
  const handlePdfDelete = async (pdf: PdfItem) => {
    await handleDeletePdf(pdf.uri, pdf.name);
  };

  return (
    <View style={styles.container}>
      <GalleryHeader
        title="Gallery"
        subtitle="Your generated PDFs"
        count={pdfs.length}
        onRefresh={loadPdfs}
      />

      {pdfs.length > 0 ? (
        <PdfList
          pdfs={pdfs}
          onOpenPdf={handlePdfOpen}
          onSharePdf={handlePdfShare}
          onDeletePdf={handlePdfDelete}
        />
      ) : (
        <EmptyState
          icon="document-outline"
          title="No PDFs Yet"
          subtitle={`Generate your first PDF in the Editor tab\nYour PDFs will appear here automatically`}
          actionText="Go to Editor"
          onAction={onSwitchToEditor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.Spacing.xl,
  },
});

export default Gallery;
