import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";
import ImageCard from "./ImageCard";
import { ImageItem } from "../../types";

interface ImageGridProps {
  images: ImageItem[];
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  numColumns?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onRemove,
  onRotate,
  numColumns = 2,
}) => {
  const renderItem = ({ item, index }: { item: ImageItem; index: number }) => (
    <ImageCard
      image={item}
      index={index}
      onRemove={onRemove}
      onRotate={onRotate}
    />
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="images-outline"
          size={40}
          color={Theme.Colors.textMuted}
        />
      </View>
      <Text style={styles.emptyText}>No images added</Text>
    </View>
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyComponent />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.Spacing.md,
    minHeight: 200,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Theme.Spacing.xxl,
  },
  emptyIcon: {
    marginBottom: Theme.Spacing.md,
  },
  emptyText: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.textMuted,
  },
});

export default ImageGrid;
