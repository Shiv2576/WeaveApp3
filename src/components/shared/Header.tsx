import React from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import Theme from "../../styles/themeConstants";

interface SimpleHeaderProps {
  title?: string;
  showStatusBar?: boolean;
}

const Header: React.FC<SimpleHeaderProps> = ({
  title = "Weave",
  showStatusBar = true,
}) => {
  return (
    <>
      {showStatusBar && (
        <StatusBar
          barStyle="light-content"
          backgroundColor={Theme.Colors.primary}
        />
      )}
      <View style={styles.container}>
        <View style={styles.logo}>
          <View style={styles.logoSquare} />
          <View style={styles.logoLine} />
          <View style={styles.logoCircle} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tagline}>Weave your images into PDFs</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.primary,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: Theme.Spacing.lg,
    paddingHorizontal: Theme.Spacing.screenPadding,
    alignItems: "center",
    ...Theme.Shadows.md,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.Spacing.sm,
    gap: 4,
  },
  logoSquare: {
    width: 12,
    height: 12,
    backgroundColor: Theme.Colors.secondary,
    borderRadius: 2,
  },
  logoLine: {
    width: 20,
    height: 3,
    backgroundColor: Theme.Colors.textLight,
    borderRadius: 1.5,
  },
  logoCircle: {
    width: 10,
    height: 10,
    backgroundColor: Theme.Colors.secondary,
    borderRadius: 5,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.textLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  tagline: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textLight,
    opacity: 0.8,
  },
});

export default Header;
