import React, { useState } from "react";
import { View } from "react-native";
import Editor from "./src/screens/EditorScreen";
import GalleryScreen from "./src/screens/GalleryScreen";
import Header from "./src/components/shared/Header";
import { TabNavigation } from "./src/components/shared/TabNavigation";
import { ImageItem, PdfItem } from "./src/types";

type AppTab = "editor" | "gallery";

function App() {
  // State for current tab
  const [currentTab, setCurrentTab] = useState<AppTab>("editor");

  // Handle tab change
  const handleTabChange = (tab: AppTab) => {
    setCurrentTab(tab);
  };

  // Editor handlers
  const handleGeneratePdf = async (pdfPath: string) => {
    // Optional: You can handle the generated PDF path here
    console.log("PDF generated at:", pdfPath);
    // You might want to switch to gallery tab or refresh gallery
    // handleTabChange("gallery");
  };

  const handleClearImages = () => {
    // To be implemented by parent component
    console.log("Images cleared");
  };

  // Gallery handlers - these will be implemented by the parent
  const handleAddPdf = () => {
    // To be implemented by parent component
  };

  const handleSearch = () => {
    // To be implemented by parent component
  };

  const handleOpenPdf = (pdf: PdfItem) => {
    // To be implemented by parent component
  };

  const handleSharePdf = (pdf: PdfItem) => {
    // To be implemented by parent component
  };

  const handleDeletePdf = (pdf: PdfItem) => {
    // To be implemented by parent component
  };

  const handleSwitchToEditor = () => {
    setCurrentTab("editor");
  };

  const handleRefresh = () => {
    // To be implemented by parent component
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Header title="Weave" showStatusBar={true} />

      {/* Tab Navigation */}
      <TabNavigation currentTab={currentTab} onTabChange={handleTabChange} />

      {/* Content based on current tab */}
      {currentTab === "editor" ? (
        <Editor
          onGeneratePdf={handleGeneratePdf} // Now accepts string, not ImageItem[]
          onClearImages={handleClearImages}
        />
      ) : (
        <GalleryScreen
          pdfs={[]} // PDFs will be passed from parent
          onAddPdf={handleAddPdf}
          onSearch={handleSearch}
          onOpenPdf={handleOpenPdf}
          onSharePdf={handleSharePdf}
          onDeletePdf={handleDeletePdf}
          onSwitchToEditor={handleSwitchToEditor}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

export default App;
