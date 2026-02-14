import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "../../styles/themeConstants";
import { PdfItem } from "../../types";

interface PdfCardProps {
  pdf: PdfItem;
  onOpen: (uri: string, name: string) => void;
  onShare: (uri: string, name: string) => void;
  onDelete: (uri: string, name: string) => void;
}

const PdfCard: React.FC<PdfCardProps> = ({
  pdf,
  onOpen,
  onShare,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onOpen(pdf.uri, pdf.name)}
      activeOpacity={0.7}
    >
      {/* PDF Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="document-text" size={24} color="#4A5A6A" />
      </View>

      {/* PDF Info - Takes remaining space */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {pdf.name}
        </Text>
        <Text style={styles.meta}>
          {pdf.size} • {pdf.date}
        </Text>
      </View>

      {/* Actions - Fixed width */}
      <View style={styles.actionsContainer}>
        {/* Share */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onShare(pdf.uri, pdf.name);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={18} color="#4A5A6A" />
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete(pdf.uri, pdf.name);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 0,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A2634",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: "#7E8C9A",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PdfCard;
