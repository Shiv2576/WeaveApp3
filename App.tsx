import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { useTabNavigation } from "./src/hooks/useTabNavigation";
import { usePdfManagement } from "./src/hooks/usePdfManagement";
import { TabNavigation } from "./src/components/shared/TabNavigation";
import Editor from "./src/screens/EditorScreen";
import Gallery from "./src/screens/GalleryScreen";
import { TabType } from "./src/types";

const App: React.FC = () => {
  const { currentTab, switchTab } = useTabNavigation("editor");
  const { loadPdfs } = usePdfManagement();

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  const handleSwitchToGallery = async () => {
    switchTab("gallery");
    await loadPdfs();
  };

  const handleSwitchToEditor = () => {
    switchTab("editor");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <View style={styles.contentWrapper}>
        <TabNavigation
          currentTab={currentTab}
          onTabChange={(tab: TabType) => {
            if (tab === "gallery") {
              handleSwitchToGallery();
            } else {
              handleSwitchToEditor();
            }
          }}
        />

        <View style={styles.content}>
          {currentTab === "editor" ? (
            <Editor
              onGeneratePdf={(pdfPath: string) => {
                console.log("PDF Generated:", pdfPath);
              }}
              onClearImages={() => {
                console.log("Images cleared");
              }}
              onSwitchToGallery={handleSwitchToGallery}
            />
          ) : (
            <Gallery onSwitchToEditor={handleSwitchToEditor} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#F3F4F4",
  },
  content: {
    flex: 1,
  },
});

export default App;
