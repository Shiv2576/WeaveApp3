import { TabType } from "../types";
import { useState } from "react";

export const useTabNavigation = (initialTab = "editor") => {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const switchToEditor = () => setCurrentTab("editor");
  const switchToGallery = () => setCurrentTab("gallery");
  const switchTab = (tab: TabType) => setCurrentTab(tab);

  return { currentTab, switchToEditor, switchToGallery, switchTab };
};
