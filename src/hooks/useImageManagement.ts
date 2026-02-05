import { useState } from "react";
import { ImageItem } from "../types";
import { rotateImage } from "../services/imageService";

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

  return {
    images,
    loading,
    generatingPdf,
    setImages,
    addImages,
    removeImage,
    clearAllImages,
    rotateImage: rotateImageHandler,
    getImageCount: () => images.length,
    hasImages: () => images.length > 0,
  };
};
