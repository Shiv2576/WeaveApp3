import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { TabType } from "../../types";

interface TabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// Editor SVG Icon - Simplified
const EditorIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill={color}
    />
  </Svg>
);

// Gallery SVG Icon - Simplified
const GalleryIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
      fill={color}
    />
  </Svg>
);

export const TabNavigation: React.FC<TabNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      {/* Editor Tab */}
      <TouchableOpacity
        style={[styles.tab, currentTab === "editor" && styles.activeTab]}
        onPress={() => onTabChange("editor")}
        activeOpacity={0.7}
      >
        <EditorIcon color={currentTab === "editor" ? "#061E29" : "#8B9599"} />
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
        onPress={() => onTabChange("gallery")}
        activeOpacity={0.7}
      >
        <GalleryIcon color={currentTab === "gallery" ? "#061E29" : "#8B9599"} />
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 0,
  },
  activeTab: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "serif",
    color: "#8B9599",
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: "#061E29",
    fontWeight: "600",
  },
});
