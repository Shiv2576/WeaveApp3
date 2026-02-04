import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";
import { ImageItem } from "../../types";

interface ImageCardProps {
  image: ImageItem;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  onRemove,
  onRotate,
}) => {
  // Calculate image style based on rotation
  const imageStyle: ImageStyle = {
    width: "100%",
    height: "100%",
    transform: image.rotation ? [{ rotate: `${image.rotation}deg` }] : [],
  };

  return (
    <View style={styles.container}>
      {/* Image with overlay buttons */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: image.uri }}
          resizeMode="cover"
          style={imageStyle}
        />

        {/* Top corner buttons */}
        <View style={styles.topLeftButton}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onRotate(image.id)}
          >
            <Ionicons name="refresh" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.topRightButton}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onRemove(image.id)}
          >
            <Ionicons name="close" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom index */}
        <View style={styles.bottomIndex}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        {/* Optional dimensions display */}
        <View style={styles.dimensions}>
          <Text style={styles.dimensionsText}>
            {image.width}×{image.height}
          </Text>
        </View>
      </View>

      {/* File name */}
      <Text style={styles.fileName} numberOfLines={1}>
        {image.fileName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    margin: Theme.Spacing.sm,
    alignItems: "center",
  },
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: Theme.Spacing.borderRadiusMD,
    overflow: "hidden",
    backgroundColor: Theme.Colors.background,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    ...Theme.Shadows.sm,
    position: "relative",
  },
  topLeftButton: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  topRightButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    ...Theme.Shadows.xs,
  },
  bottomIndex: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: Theme.Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...Theme.Shadows.xs,
    zIndex: 1,
  },
  indexText: {
    color: Theme.Colors.textLight,
    fontSize: 12,
    fontWeight: "bold",
  },
  dimensions: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  dimensionsText: {
    color: Theme.Colors.textLight,
    fontSize: 10,
    fontWeight: "500",
  },
  fileName: {
    fontSize: 12,
    color: Theme.Colors.textMuted,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});

export default ImageCard;
