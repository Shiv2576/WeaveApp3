import React from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useImageManagement } from "../hooks/useImageManagement";
import { useImagePicker } from "../hooks/imagePicker";
import AddImageButton from "../components/editor/AddImageButton";
import GeneratePdfButton from "../components/editor/GenerateButton";
import ImageGrid from "../components/editor/ImageGrid";

interface EditorProps {
  onGeneratePdf?: (pdfPath: string) => void; // Optional callback for when PDF is generated
  onClearImages?: () => void;
}

const Editor: React.FC<EditorProps> = ({ onGeneratePdf, onClearImages }) => {
  const {
    images,
    loading: imagesLoading,
    generatingPdf,
    addImages,
    removeImage,
    clearAllImages,
    rotateImage,
    generatePdf: generatePdfFromHook, // Get generatePdf from hook
    getImageCount,
    hasImages,
  } = useImageManagement();

  const {
    images: pickedImages,
    pickImages,
    setImages: clearPickedImages,
  } = useImagePicker();

  const handleAddImages = async () => {
    try {
      await pickImages();

      if (pickedImages && pickedImages.length > 0) {
        const formattedImages = pickedImages.map((img, index) => ({
          id: `${Date.now()}_${index}_${Math.random()}`,
          uri: img.uri,
          width: img.width || 0,
          height: img.height || 0,
          fileName: img.fileName || `image_${Date.now()}_${index}.jpg`,
          rotation: 0,
        }));

        addImages(formattedImages);
        clearPickedImages([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const handleGenerate = async () => {
    if (!hasImages()) {
      Alert.alert("No Images", "Please add at least one image");
      return;
    }

    try {
      // Use generatePdf from the hook
      const pdfPath = await generatePdfFromHook(); // Optional: pass pdfName parameter

      // Optional: Call the callback with the generated PDF path
      onGeneratePdf?.(pdfPath);

      Alert.alert("Success", "PDF generated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to generate PDF");
    }
  };

  const handleClearAll = () => {
    if (!hasImages()) return;

    Alert.alert(
      "Clear All Images",
      "Are you sure you want to remove all images?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearAllImages();
            onClearImages?.();
          },
        },
      ],
    );
  };

  const handleRotateImage = (id: string) => {
    rotateImage(id, 90);
  };

  const handleRemoveImage = (id: string) => {
    removeImage(id);
  };

  const isLoading = imagesLoading || generatingPdf; // Include generatingPdf in loading state

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F4" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#061E29",
            marginBottom: 4,
          }}
        >
          Editor
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#8B9599",
            marginBottom: 16,
          }}
        >
          Add and edit images
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="images" size={16} color="#8B9599" />
            <Text style={{ fontSize: 14, color: "#8B9599" }}>
              {getImageCount()} image{getImageCount() !== 1 ? "s" : ""}
            </Text>
          </View>

          {hasImages() && (
            <TouchableOpacity
              onPress={handleClearAll}
              disabled={isLoading}
              style={{
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                backgroundColor: "#F3F4F4",
                borderWidth: 1,
                borderColor: "#E5E7E8",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#FF3B30",
                  fontWeight: "500",
                }}
              >
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Add Images Button */}
      <AddImageButton
        onPress={handleAddImages}
        disabled={isLoading}
        loading={isLoading}
      />

      {/* ImageGrid or Empty State */}
      {hasImages() ? (
        <ImageGrid
          images={images}
          onRemove={handleRemoveImage}
          onRotate={handleRotateImage}
          numColumns={2}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 48,
          }}
        >
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <Ionicons name="image-outline" size={64} color="#E5E7E8" />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: "#061E29",
                  marginTop: 16,
                  marginBottom: 4,
                }}
              >
                No Images Yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#8B9599",
                  textAlign: "center",
                }}
              >
                Tap "Add Images" to get started
              </Text>
            </>
          )}
        </View>
      )}

      {/* Generate PDF Button */}
      <View
        style={{
          padding: 16,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7E8",
        }}
      >
        <GeneratePdfButton
          onPress={handleGenerate}
          disabled={!hasImages() || isLoading}
          loading={isLoading}
          imageCount={getImageCount()}
        />
      </View>
    </View>
  );
};

export default Editor;
