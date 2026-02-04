import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { PdfItem, PdfToRename, ImageItem } from "../types";
import {
  sharePdf,
  renamePdf,
  listAllPdfs,
  deletePdfFile,
  getPdfFileInfo,
  openPdf,
} from "../services/pdfService";

export const usePdfManagement = () => {
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [pdfToRename, setPdfToRename] = useState<PdfToRename | null>(null);
  const [loading, setLoading] = useState(false);
  const [renaming, setRenaming] = useState(false);

  // Load all PDFs from documents directory
  const loadPdfs = useCallback(async (): Promise<void> => {
    try {
      const pdfList = await listAllPdfs();
      setPdfs(pdfList);
    } catch (error) {
      console.error("Error loading PDFs:", error);
      Alert.alert("Error", "Failed to load PDFs");
      throw error;
    }
  }, []);

  // Rename/save PDF with custom name
  const handleRenamePdf = async (
    newName: string,
  ): Promise<{ newUri: string; newName: string }> => {
    if (!pdfToRename) {
      throw new Error("No PDF to rename");
    }

    if (!newName.trim()) {
      throw new Error("Please enter a valid PDF name");
    }

    setRenaming(true);
    try {
      console.log("Renaming PDF:", pdfToRename.currentName, "→", newName);

      const newUri = await renamePdf(pdfToRename.uri, newName);

      console.log("PDF renamed to:", newUri);

      // Refresh PDF list
      await loadPdfs();

      return { newUri, newName };
    } catch (error: any) {
      console.error("Rename failed:", error);
      Alert.alert("Error", `Failed to rename PDF: ${error.message}`);
      throw error;
    } finally {
      setRenaming(false);
    }
  };

  // Open/View PDF
  const handleOpenPdf = async (
    pdfUri: string,
    fileName: string,
  ): Promise<void> => {
    try {
      await openPdf(pdfUri, fileName);
    } catch (error: any) {
      console.error("Error opening PDF:", error);
      Alert.alert("Error", `Failed to open PDF: ${error.message}`);
      throw error;
    }
  };

  // Share PDF
  const handleSharePdf = async (
    pdfUri: string,
    fileName: string,
  ): Promise<void> => {
    try {
      await sharePdf(pdfUri, fileName);
    } catch (error: any) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", `Failed to share PDF: ${error.message}`);
      throw error;
    }
  };

  // Delete PDF with confirmation
  const handleDeletePdf = async (
    pdfUri: string,
    fileName: string,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        "Delete PDF",
        `Are you sure you want to delete "${fileName}"?`,
        [
          {
            text: "Cancel",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deletePdfFile(pdfUri);
                await loadPdfs(); // Refresh the list
                Alert.alert("Success", "PDF deleted successfully");
                resolve(true);
              } catch (error: any) {
                Alert.alert("Error", `Failed to delete PDF: ${error.message}`);
                resolve(false);
              }
            },
          },
        ],
      );
    });
  };

  // Discard PDF without saving
  const discardPdf = (): void => {
    if (pdfToRename) {
      // Optional: Delete the temporary file
      deletePdfFile(pdfToRename.uri).catch((error) => {
        console.error("Error discarding PDF:", error);
      });
    }
    setPdfToRename(null);
  };

  // Helper: Get PDF count
  const getPdfCount = (): number => pdfs.length;

  // Helper: Check if has PDFs
  const hasPdfs = (): boolean => pdfs.length > 0;

  return {
    // State
    pdfs,
    pdfToRename,
    loading,
    renaming,

    // State setters
    setPdfs,
    setPdfToRename,

    // Actions
    loadPdfs,
    handleRenamePdf,
    handleOpenPdf,
    handleSharePdf,
    handleDeletePdf,
    discardPdf,

    // Helpers
    getPdfCount,
    hasPdfs,
  };
};
