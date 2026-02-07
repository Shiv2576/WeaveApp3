import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GeneratePdfButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  imageCount?: number;
  label?: string;
}

const GeneratePdfButton: React.FC<GeneratePdfButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  imageCount = 0,
  label = "Generate PDF",
}) => {
  const hasImages = imageCount > 0;
  const activeColor = hasImages ? "#6B7579" : "#8B9599";
  const buttonText = hasImages ? `${label} (${imageCount})` : label;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { borderColor: activeColor },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={activeColor} />
      ) : (
        <View style={styles.content}>
          <View style={{ transform: [{ translateY: -0.5 }] }}>
            <Ionicons name="pencil-outline" size={16} color={activeColor} />
          </View>
          <Text style={[styles.text, { color: activeColor }]}>
            {buttonText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "serif",
    letterSpacing: 0.5,
  },
});

export default GeneratePdfButton;
