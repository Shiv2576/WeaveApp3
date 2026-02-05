import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabType } from "../../types";

interface TabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Editor Tab */}
      <TouchableOpacity
        style={[styles.tab, currentTab === "editor" && styles.activeTab]}
        onPress={() => onTabChange("editor")} // ✅ Pass TabType
        activeOpacity={0.7}
      >
        <Ionicons
          name="images-outline"
          size={20}
          color={currentTab === "editor" ? "#061E29" : "#8B9599"}
        />
        <Text
          style={[
            styles.tabText,
            currentTab === "editor" && styles.activeTabText,
          ]}
        >
          Editor
        </Text>
      </TouchableOpacity>

      {/* Gallery Tab */}
      <TouchableOpacity
        style={[styles.tab, currentTab === "gallery" && styles.activeTab]}
        onPress={() => onTabChange("gallery")} // ✅ Pass TabType
        activeOpacity={0.7}
      >
        <Ionicons
          name="folder-outline"
          size={20}
          color={currentTab === "gallery" ? "#061E29" : "#8B9599"}
        />
        <Text
          style={[
            styles.tabText,
            currentTab === "gallery" && styles.activeTabText,
          ]}
        >
          Gallery
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7E8",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#061E29",
    backgroundColor: "#FAFAFA",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8B9599",
  },
  activeTabText: {
    color: "#061E29",
  },
});
