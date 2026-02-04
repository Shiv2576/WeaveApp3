// Tab Types
export type TabType = "editor" | "gallery";

// Image Types
export interface ImageItem {
  id: string;
  uri: string;
  width: number;
  height: number;
  fileName: string;
  rotation?: number;
}

export interface CropData {
  originX: number;
  originY: number;
  width: number;
  height: number;
}

export interface ResizeData {
  width: number;
  height: number;
}

export interface EditedImage extends ImageItem {
  cropData?: CropData;
  resizeData?: ResizeData;
}

// PDF Types
export interface PdfItem {
  id: string;
  name: string;
  uri: string;
  size: string;
  rawSize: number;
  date: string;
  modificationTime: number;
}

export interface PdfToRename {
  uri: string;
  currentName: string;
  newName: string;
}

// Image Picker Types
export interface ImagePickerImage {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
}
