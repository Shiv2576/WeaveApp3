// TabNavigation.tsx
import { TabType } from "../../types";
import { View, TouchableOpacity, Text } from "react-native";
import Theme from "../../styles/themeConstants";

interface TabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation = ({
  currentTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onTabChange("editor")}>
        <Text>Editor</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabChange("gallery")}>
        <Text>Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};
