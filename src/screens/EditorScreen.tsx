// Editor.tsx (Updated)
import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useImageManagement } from "../hooks/useImageManagement";
import { useImagePicker } from "../hooks/imagePicker";
import { usePdfManagement } from "../hooks/usePdfManagement";
import AddImageButton from "../components/editor/AddImageButton";
import GeneratePdfButton from "../components/editor/GenerateButton";
import ImageGrid from "../components/editor/ImageGrid";
import RenameModal from "../components/modals/RenamePdfModal";

interface EditorProps {
  onGeneratePdf?: (pdfPath: string) => void;
  onClearImages?: () => void;
  onSwitchToGallery?: () => void;
}

const Editor: React.FC<EditorProps> = ({
  onGeneratePdf,
  onClearImages,
  onSwitchToGallery,
}) => {
  const {
    images,
    loading: imagesLoading,
    generatingPdf,
    addImages,
    removeImage,
    clearAllImages,
    rotateImage,
    getImageCount,
    hasImages,
  } = useImageManagement();

  const {
    images: pickedImages,
    pickImages,
    setImages: clearPickedImages,
  } = useImagePicker();

  const {
    generateAndSavePdf,
    loadPdfs,
    pdfToRename,
    setPdfToRename,
    renaming,
    discardPdf,
    handleRenamePdf,
  } = usePdfManagement();

  const [renameModalVisible, setRenameModalVisible] = useState(false);

  const handleGeneratePdf = async () => {
    try {
      // 1. Generate PDF
      const pdfPath = await generateAndSavePdf(
        images,
        `document_${new Date().toISOString().slice(0, 10)}.pdf`,
      );

      // 2. Show rename modal for user to confirm/change name
      setPdfToRename({
        uri: pdfPath.uri,
        currentName: pdfPath.name,
        newName: pdfPath.name,
      });

      setRenameModalVisible(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleRenamePdfFromModal = async () => {
    try {
      await handleRenamePdf(pdfToRename?.newName || "document.pdf");

      // Close modal
      setRenameModalVisible(false);
      setPdfToRename(null);

      // Load PDFs so gallery shows it
      await loadPdfs();

      // Show success and switch to gallery
      Alert.alert("Success", "PDF saved successfully!", [
        {
          text: "View in Gallery",
          onPress: () => onSwitchToGallery?.(),
        },
        { text: "OK", style: "default" },
      ]);

      // Clear images
      clearAllImages();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDiscardFromModal = () => {
    Alert.alert(
      "Discard PDF",
      "Are you sure you want to discard this PDF without saving?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            discardPdf();
            setRenameModalVisible(false);
            setPdfToRename(null);
          },
        },
      ],
    );
  };

  const handleAddImages = async () => {
    try {
      const pickedImages = await pickImages();

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

  const isLoading = imagesLoading || generatingPdf;

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

      <View
        style={{
          padding: 16,
          paddingBottom: 60,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7E8",
        }}
      >
        <GeneratePdfButton
          onPress={handleGeneratePdf}
          disabled={!hasImages() || isLoading}
          loading={isLoading}
          imageCount={getImageCount()}
        />
      </View>

      <RenameModal
        visible={renameModalVisible}
        onClose={() => {
          if (!renaming) {
            setRenameModalVisible(false);
            setPdfToRename(null);
          }
        }}
        renamePdf={handleRenamePdfFromModal}
        pdfToRename={pdfToRename}
        setPdfToRename={setPdfToRename}
        images={images}
        renaming={renaming}
        onDiscard={handleDiscardFromModal}
      />
    </View>
  );
};

export default Editor;
