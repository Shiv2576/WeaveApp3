import React from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GalleryHeader from "../components/gallery/GalleryHeader";
import PdfGrid from "../components/gallery/PdfList";
import { PdfItem } from "../types";
import usePdfManagement from "../hooks/usePdfManagement";

interface GalleryScreenProps {
  pdfs: PdfItem[];
  loading?: boolean;
  onAddPdf?: () => void;
  onSearch?: () => void;
  onOpenPdf?: (pdf: PdfItem) => void;
  onSharePdf?: (pdf: PdfItem) => void;
  onDeletePdf?: (pdf: PdfItem) => void;
  onSwitchToEditor?: () => void;
  onRefresh?: () => void;
  showDebugInfo?: boolean;
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({
  pdfs = [],
  loading = false,
  onAddPdf,
  onSearch,
  onOpenPdf,
  onSharePdf,
  onDeletePdf,
  onSwitchToEditor,
  onRefresh,
  showDebugInfo = false,
}) => {
  const handleOpenPdf = (pdf: PdfItem) => {
    onOpenPdf?.(pdf);
  };

  const handleSharePdf = (pdf: PdfItem) => {
    onSharePdf?.(pdf);
  };

  const handleDeletePdf = (pdf: PdfItem) => {
    Alert.alert(
      "Delete PDF",
      `Are you sure you want to delete "${pdf.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeletePdf?.(pdf),
        },
      ],
    );
  };

  const handleSwitchToEditor = () => {
    onSwitchToEditor?.();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F4" }}>
      <GalleryHeader
        title="Gallery"
        subtitle="Your documents"
        count={pdfs.length}
        onAdd={onAddPdf}
        onSearch={onSearch}
        showActions={true}
        loading={loading}
      />

      <PdfGrid
        pdfs={pdfs}
        onOpenPdf={handleOpenPdf}
        onSharePdf={handleSharePdf}
        onDeletePdf={handleDeletePdf}
        onSwitchToEditor={handleSwitchToEditor}
        loading={loading}
        showDebugInfo={showDebugInfo}
      />
    </View>
  );
};

export default GalleryScreen;
