import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { PdfItem, PdfToRename } from "../types";
import {
  sharePdf,
  renamePdf,
  generatePdf,
  listAllPdfs,
  deletePdfFile,
  getPdfFileInfo,
  openPdf,
} from "../services/pdfService";

// Helper function to format size
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// Helper to get file info with size
const getFileInfoWithSize = async (
  fileUri: string,
): Promise<{ size: number; modificationTime: number }> => {
  try {
    // Get basic file info
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      return { size: 0, modificationTime: Date.now() };
    }

    // Get approximate size using download (most reliable)
    let size = 0;
    try {
      const result = await FileSystem.getInfoAsync(fileUri, { size: true });
      // @ts-ignore - size might be available
      size = result.size || 0;
    } catch (sizeError) {
      console.log("Could not get exact size, using default:", sizeError);
      size = 1024; // Default 1KB for PDFs
    }

    return {
      size,
      modificationTime: fileInfo.modificationTime || Date.now(),
    };
  } catch (error) {
    console.error("Error getting file info:", error);
    return { size: 1024, modificationTime: Date.now() }; // Default 1KB
  }
};

export const usePdfManagement = () => {
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [pdfToRename, setPdfToRename] = useState<PdfToRename | null>(null);
  const [loading, setLoading] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Load all PDFs from documents directory
  const loadPdfs = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const pdfList = await listAllPdfs();

      // Transform the PDF list to match PdfItem interface
      const formattedPdfs: PdfItem[] = await Promise.all(
        pdfList.map(async (pdf) => {
          // Get file size and modification time
          const { size: rawSize, modificationTime } = await getFileInfoWithSize(
            pdf.uri || pdf.path || "",
          );

          return {
            id:
              pdf.id ||
              `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: pdf.name || "Untitled.pdf",
            uri: pdf.uri || pdf.path || "",
            size: formatFileSize(rawSize), // Formatted string
            rawSize: rawSize, // Raw number in bytes
            date:
              pdf.date ||
              pdf.createdAt ||
              new Date(modificationTime).toLocaleDateString(),
            modificationTime: modificationTime,
          };
        }),
      );

      setPdfs(formattedPdfs);
    } catch (error) {
      console.error("Error loading PDFs:", error);
      Alert.alert("Error", "Failed to load PDFs");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ NEW: Generate AND save in one step
  const generateAndSavePdf = async (
    images: any[],
    pdfName?: string,
  ): Promise<PdfItem> => {
    try {
      setGeneratingPdf(true);

      // 1. Generate PDF
      const pdfPath = await generatePdf(images, pdfName);

      // 2. Save to storage
      const savedPdf = await savePdfToStorage(pdfPath, pdfName);

      return savedPdf;
    } catch (error) {
      console.error("Error generating and saving PDF:", error);
      throw error;
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Save PDF to app's storage (add to the list)
  const savePdfToStorage = async (
    pdfPath: string,
    pdfName?: string,
  ): Promise<PdfItem> => {
    try {
      // Get file info with size
      const { size: rawSize, modificationTime } =
        await getFileInfoWithSize(pdfPath);

      if (rawSize === 0) {
        throw new Error("PDF file is empty or not found");
      }

      // Create a unique name if not provided
      const timestamp = Date.now();
      const fileName = pdfName || `document_${timestamp}.pdf`;

      // Copy to app's document directory
      const documentsDir = FileSystem.Directory;
      const newPath = `${documentsDir}${fileName}`;

      // Handle duplicate names
      let finalPath = newPath;
      let finalName = fileName;
      let counter = 1;

      while (true) {
        const exists = await FileSystem.getInfoAsync(finalPath);
        if (!exists.exists) break;

        const nameWithoutExt = fileName.replace(/\.pdf$/i, "");
        const extension = ".pdf";
        finalName = `${nameWithoutExt}_${counter}${extension}`;
        finalPath = `${documentsDir}${finalName}`;
        counter++;
      }

      // Copy the file
      await FileSystem.copyAsync({
        from: pdfPath,
        to: finalPath,
      });

      // Get updated file info
      const { size: finalRawSize, modificationTime: finalModTime } =
        await getFileInfoWithSize(finalPath);

      // Create PDF item
      const newPdf: PdfItem = {
        id: `pdf_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        name: finalName,
        uri: finalPath,
        size: formatFileSize(finalRawSize),
        date: new Date(finalModTime).toLocaleDateString(),
      };

      // Add to the list
      setPdfs((prev) => [newPdf, ...prev]);

      return newPdf;
    } catch (error) {
      console.error("Error saving PDF:", error);
      throw error;
    }
  };

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

  // Get PDF by ID
  const getPdfById = (id: string) => {
    return pdfs.find((pdf) => pdf.id === id);
  };

  return {
    // State
    pdfs,
    pdfToRename,
    loading,
    renaming,
    generatingPdf,

    // State setters
    setPdfs,
    setPdfToRename,

    // Actions
    loadPdfs,
    generateAndSavePdf, // ✅ Combined generate and save
    savePdfToStorage, // Keep this for importing existing PDFs
    handleRenamePdf,
    handleOpenPdf,
    handleSharePdf,
    handleDeletePdf,
    discardPdf,

    // Helpers
    getPdfCount,
    hasPdfs,
    getPdfById,
  };
};
