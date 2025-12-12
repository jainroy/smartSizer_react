import { ProcessOptions, ProcessResult } from '../types';

function fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            },
            type,
            quality
        );
    });
}

export async function convertBlobToPng(blob: Blob): Promise<Blob> {
    if (blob.type === 'image/png') {
        return blob;
    }
    
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                    resolve(pngBlob);
                } else {
                    reject(new Error('PNG conversion failed'));
                }
            }, 'image/png');
        };
        
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for conversion'));
        };
        
        img.src = url;
    });
}

export async function resizeImage(file: File, options: ProcessOptions): Promise<ProcessResult> {
    const img = await fileToImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    let { width, height } = img;

    // Handle resizing
    if (options.targetWidth || options.targetHeight) {
        const targetWidth = options.targetWidth || width;
        const targetHeight = options.targetHeight || height;

        if (options.maintainAspectRatio) {
            const ratio = Math.min(targetWidth / width, targetHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        } else {
            width = targetWidth;
            height = targetHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Determine output mime type. If target size is set, we must use JPEG for compression.
    let outputMimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    if (options.targetSizeKB) {
        outputMimeType = 'image/jpeg';
    }

    if (options.targetSizeKB && outputMimeType === 'image/jpeg') {
        const targetSizeBytes = options.targetSizeKB * 1024;
        let warning: string | undefined;

        // Binary search for the best quality to meet target size
        let low = 0;
        let high = 1;
        let bestBlob: Blob | null = null;
        
        // 8 iterations are enough for good precision
        for (let i = 0; i < 8; i++) {
            const mid = (low + high) / 2;
            const blob = await canvasToBlob(canvas, 'image/jpeg', mid);
            
            if (blob.size <= targetSizeBytes) {
                bestBlob = blob; // This is a good candidate
                low = mid; // Try for even better quality
            } else {
                high = mid; // Too big, need lower quality
            }
        }
        
        if (bestBlob) {
            return { blob: bestBlob, width, height };
        }
        
        // If we couldn't find any suitable blob (e.g., even at quality 0 it's too large)
        const lowestQualityBlob = await canvasToBlob(canvas, 'image/jpeg', 0);
        if (lowestQualityBlob.size > targetSizeBytes) {
             warning = `Couldn't compress below ${options.targetSizeKB} KB. Smallest result is ${(lowestQualityBlob.size / 1024).toFixed(0)} KB.`;
        }
        return { blob: lowestQualityBlob, width, height, warning };
    }

    // Default case: no target size or it's a PNG without a target size
    const blob = await canvasToBlob(canvas, outputMimeType, 0.92);
    return { blob, width, height };
}