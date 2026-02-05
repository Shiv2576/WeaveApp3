import { useState, useCallback } from "react";
import { TabType } from "../types";

export const useTabNavigation = (initialTab: TabType = "editor") => {
  const [currentTab, setCurrentTab] = useState<TabType>(initialTab);

  const switchToEditor = useCallback(() => {
    setCurrentTab("editor");
  }, []);

  const switchToGallery = useCallback(() => {
    setCurrentTab("gallery");
  }, []);

  const switchTab = useCallback((tab: TabType) => {
    setCurrentTab(tab);
  }, []);

  return {
    currentTab,
    switchToEditor,
    switchToGallery,
    switchTab,
  };
};
