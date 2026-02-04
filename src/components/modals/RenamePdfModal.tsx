import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PdfToRename } from "../../types";
import { Theme } from "../../styles/themeConstants";

interface RenameModalProps {
  visible: boolean;
  onClose: () => void;
  renamePdf: () => void;
  pdfToRename: PdfToRename | null;
  setPdfToRename: (pdf: PdfToRename | null) => void;
  images: any[];
  renaming: boolean;
  onDiscard: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
  visible,
  onClose,
  renamePdf,
  pdfToRename,
  setPdfToRename,
  images = [],
  renaming = false,
  onDiscard,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => !renaming && onClose()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Save Your PDF</Text>
            <TouchableOpacity
              onPress={() => !renaming && onClose()}
              disabled={renaming}
            >
              <Ionicons name="close" size={24} color={Theme.Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.pdfPreview}>
              <Ionicons
                name="document-text"
                size={48}
                color={Theme.Colors.error}
              />
              <Text style={styles.pdfPreviewText}>
                PDF Generated Successfully!
              </Text>
              <Text style={styles.pdfPreviewSubtext}>
                {images.length} image{images.length !== 1 ? "s" : ""} converted
              </Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>PDF File Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={pdfToRename?.newName || ""}
                  onChangeText={(text) =>
                    setPdfToRename(
                      pdfToRename ? { ...pdfToRename, newName: text } : null,
                    )
                  }
                  placeholder="Enter PDF name"
                  placeholderTextColor={Theme.Colors.textDisabled}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!renaming}
                />
                {pdfToRename?.newName && !renaming && (
                  <TouchableOpacity
                    onPress={() =>
                      setPdfToRename(
                        pdfToRename ? { ...pdfToRename, newName: "" } : null,
                      )
                    }
                    style={styles.clearButton}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={Theme.Colors.textMuted}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.inputHint}>
                File will be saved as:{" "}
                {pdfToRename?.newName.endsWith(".pdf")
                  ? pdfToRename.newName
                  : `${pdfToRename?.newName || ""}.pdf`}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onDiscard}
                disabled={renaming}
              >
                <Text style={styles.cancelButtonText}>Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={renamePdf}
                disabled={renaming}
              >
                {renaming ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="white" />
                    <Text style={styles.saveButtonText}>Save PDF</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.Spacing.screenPadding,
  },
  modalContainer: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Spacing.borderRadiusLG,
    width: "100%",
    maxWidth: 400,
    ...Theme.Shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Theme.Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.textPrimary,
  },
  modalContent: {
    padding: Theme.Spacing.lg,
  },
  pdfPreview: {
    alignItems: "center",
    paddingVertical: Theme.Spacing.xl,
    marginBottom: Theme.Spacing.lg,
  },
  pdfPreviewText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.textPrimary,
    marginTop: Theme.Spacing.md,
  },
  pdfPreviewSubtext: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.textMuted,
    marginTop: Theme.Spacing.xs,
  },
  inputSection: {
    marginBottom: Theme.Spacing.xl,
  },
  inputLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    borderRadius: Theme.Spacing.borderRadiusMD,
    paddingHorizontal: Theme.Spacing.md,
    backgroundColor: Theme.Colors.background,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.textPrimary,
    paddingVertical: Theme.Spacing.sm,
  },
  clearButton: {
    padding: Theme.Spacing.xs,
  },
  inputHint: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.textMuted,
    marginTop: Theme.Spacing.sm,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Theme.Spacing.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.Spacing.buttonPaddingVertical,
    paddingHorizontal: Theme.Spacing.buttonPaddingHorizontal,
    borderRadius: Theme.Spacing.borderRadiusMD,
    gap: Theme.Spacing.sm,
  },
  cancelButton: {
    backgroundColor: Theme.Colors.background,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  cancelButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.textMuted,
  },
  saveButton: {
    backgroundColor: Theme.Colors.primary,
  },
  saveButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.textLight,
  },
});

export default RenameModal;
