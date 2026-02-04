import { useState } from "react";
import { ImageItem } from "../types";
import { rotateImage } from "../services/imageService";
import { generatePdf } from "../services/pdfService";

export const useImageManagement = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const addImages = (newImages: ImageItem[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAllImages = () => {
    setImages([]);
  };

  const rotateImageHandler = async (id: string, degrees: number) => {
    setLoading(true);
    try {
      const imageIndex = images.findIndex((img) => img.id === id);
      if (imageIndex === -1) return;

      const imageToRotate = images[imageIndex];
      const rotated = await rotateImage(imageToRotate, degrees);

      setImages((prev) => {
        const updated = [...prev];
        updated[imageIndex] = {
          ...rotated,
          id: imageToRotate.id,
          fileName: imageToRotate.fileName,
        };
        return updated;
      });
    } catch (error) {
      console.error("Error rotating image:", error);
    } finally {
      setLoading(false);
    }
  };

  // PDF generation function
  const generatePdfHandler = async (pdfName?: string): Promise<string> => {
    setGeneratingPdf(true);
    try {
      // Since EditedImage extends ImageItem, we can pass images directly
      // TypeScript will accept ImageItem[] where EditedImage[] is expected
      const pdfPath = await generatePdf(images, pdfName);
      return pdfPath;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setGeneratingPdf(false);
    }
  };

  return {
    images,
    loading,
    generatingPdf,
    setImages,
    addImages,
    removeImage,
    clearAllImages,
    rotateImage: rotateImageHandler,
    generatePdf: generatePdfHandler, // Exported PDF generation function
    getImageCount: () => images.length,
    hasImages: () => images.length > 0,
  };
};
