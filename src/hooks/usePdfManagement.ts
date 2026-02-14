import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { File, Directory, Paths } from "expo-file-system";
import { ImageItem, PdfItem, PdfToRename } from "../types";
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
    const file = new File(fileUri);

    if (!file.exists) {
      return { size: 0, modificationTime: Date.now() };
    }

    return {
      size: file.size || 0,
      modificationTime: Date.now(),
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
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      loadPdfs();
      setIsInitialized(true);
    }
  }, [isInitialized, loadPdfs]);

  const generateAndSavePdf = async (
    images: ImageItem[],
    pdfName?: string,
  ): Promise<PdfItem> => {
    try {
      setGeneratingPdf(true);

      console.log("=== Generating and Saving PDF ===");
      console.log("Images count:", images.length);
      console.log("PDF name:", pdfName);

      console.log("Step 1: Generating PDF...");
      const pdfPath = await generatePdf(images, pdfName);
      console.log("✓ PDF generated at:", pdfPath);

      // No need to create a new File - generatePdf already saved it
      console.log("Step 2: Creating PDF record...");

      // Get file name from path or use provided name
      const fileName = pdfPath.split("/").pop() || `document_${Date.now()}.pdf`;

      const newPdf: PdfItem = {
        id: `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: fileName,
        uri: pdfPath,
        size: formatFileSize(images.length * 100 * 1024), // Estimate based on images
        rawSize: images.length * 100 * 1024,
        date: new Date().toLocaleDateString(),
      };

      console.log("Step 3: Adding to PDF list...");
      console.log("PDF details:", {
        name: newPdf.name,
        size: newPdf.size,
        path: newPdf.uri,
      });

      setPdfs((prev) => [newPdf, ...prev]);

      console.log("✓ PDF added to list successfully");
      console.log("Total PDFs now:", pdfs.length + 1);

      return newPdf;
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
      try {
        const file = new File(pdfToRename.uri);
        if (file.exists) {
          file.delete();
        }
      } catch (error) {
        console.error("Error discarding PDF:", error);
      }
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
