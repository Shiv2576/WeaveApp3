import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ImageItem } from "../types";

export const useImagePicker = () => {
  const [images, setImages] = useState<ImageItem[]>([]);

  const pickImages = async (): Promise<ImageItem[]> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        id: Date.now().toString() + Math.random(),
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName || "image.jpg",
      }));

      // Update the state
      setImages((prev) => [...prev, ...newImages]);

      // Return the new images immediately
      return newImages;
    }

    return [];
  };

  return { images, pickImages, setImages };
};
