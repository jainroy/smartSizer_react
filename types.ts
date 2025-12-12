export type FileType = 'image' | 'pdf';

export interface ProcessOptions {
    targetWidth?: number;
    targetHeight?: number;
    maintainAspectRatio?: boolean;
    targetSizeKB?: number;
}

export interface ProcessResult {
    blob: Blob;
    width?: number;
    height?: number;
    warning?: string;
}