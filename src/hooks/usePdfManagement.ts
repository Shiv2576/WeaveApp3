import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
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
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      return { size: 0, modificationTime: Date.now() };
    }

    return {
      size: fileInfo.size || 0,
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
  const [isInitialized, setIsInitialized] = useState(false);

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
            pdf.uri || "",
          );

          return {
            id:
              pdf.id ||
              `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: pdf.name || "Untitled.pdf",
            uri: pdf.uri || "",
            size: formatFileSize(rawSize), // Formatted string
            rawSize: rawSize, // Raw number in bytes
            date: pdf.date || new Date(modificationTime).toLocaleDateString(),
            modificationTime: modificationTime,
          };
        }),
      );

      setPdfs(formattedPdfs);
    } catch (error) {
      console.error("Error loading PDFs:", error);
      Alert.alert("Error", "Failed to load PDFs");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - this function doesn't depend on anything

  // Initialize PDFs on mount
  useEffect(() => {
    if (!isInitialized) {
      loadPdfs();
      setIsInitialized(true);
    }
  }, [isInitialized, loadPdfs]); // Only run once on mount

  const generateAndSavePdf = async (
    images: any[],
    pdfName?: string,
  ): Promise<PdfItem> => {
    try {
      setGeneratingPdf(true);

      console.log("=== Generating and Saving PDF ===");
      console.log("Images count:", images.length);
      console.log("PDF name:", pdfName);

      // 1. Generate PDF
      console.log("Step 1: Generating PDF...");
      const pdfPath = await generatePdf(images, pdfName);
      console.log("✓ PDF generated at:", pdfPath);

      // 2. Save to storage
      console.log("Step 2: Saving to storage...");
      const savedPdf = await savePdfToStorage(pdfPath, pdfName);
      console.log("✓ PDF saved successfully");

      return savedPdf;
    } catch (error) {
      console.error("=== Error generating and saving PDF ===");
      console.error("Error:", error);
      Alert.alert(
        "PDF Error",
        error instanceof Error ? error.message : "Failed to generate PDF",
      );
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
      console.log("Saving PDF to storage from:", pdfPath);

      // Check if source file exists
      const sourceFileInfo = await FileSystem.getInfoAsync(pdfPath);
      if (!sourceFileInfo.exists) {
        throw new Error("PDF file not found at source location");
      }

      console.log("Source file size:", sourceFileInfo.size, "bytes");

      // Get file info with size
      const { size: rawSize, modificationTime } =
        await getFileInfoWithSize(pdfPath);

      if (rawSize === 0) {
        throw new Error("PDF file is empty");
      }

      // Create a unique name if not provided
      const timestamp = Date.now();
      const fileName = pdfName || `document_${timestamp}.pdf`;

      // Get the document directory
      const docDir = FileSystem.documentDirectory;
      if (!docDir) {
        throw new Error("Cannot access document directory");
      }

      const destinationUri = `${docDir}${fileName}`;

      // Check if file already exists
      let finalUri = destinationUri;
      let counter = 1;
      let fileExists = await FileSystem.getInfoAsync(finalUri);

      while (fileExists.exists) {
        const nameWithoutExt = fileName.replace(/\.pdf$/i, "");
        const newName = `${nameWithoutExt}_${counter}.pdf`;
        finalUri = `${docDir}${newName}`;
        fileExists = await FileSystem.getInfoAsync(finalUri);
        counter++;
      }

      console.log("Copying to:", finalUri);

      // Copy the file
      await FileSystem.copyAsync({
        from: pdfPath,
        to: finalUri,
      });

      console.log("File copied successfully");

      // Get updated file info
      const { size: finalRawSize, modificationTime: finalModTime } =
        await getFileInfoWithSize(finalUri);

      // Extract filename from final URI
      const finalFileName = finalUri.split("/").pop() || fileName;

      // Create PDF item
      const newPdf: PdfItem = {
        id: `pdf_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        name: finalFileName,
        uri: finalUri,
        size: formatFileSize(finalRawSize),
        rawSize: finalRawSize,
        date: new Date(finalModTime).toLocaleDateString(),
        modificationTime: finalModTime,
      };

      console.log("New PDF item created:", newPdf);

      // Add to the list
      setPdfs((prev) => [newPdf, ...prev]);

      return newPdf;
    } catch (error) {
      console.error("Error saving PDF to storage:", error);
      throw new Error(
        `Failed to save PDF: ${error instanceof Error ? error.message : String(error)}`,
      );
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
      // Delete the temporary file
      FileSystem.deleteAsync(pdfToRename.uri, { idempotent: true }).catch(
        (error) => {
          console.error("Error discarding PDF:", error);
        },
      );
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
    generateAndSavePdf,
    savePdfToStorage,
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
