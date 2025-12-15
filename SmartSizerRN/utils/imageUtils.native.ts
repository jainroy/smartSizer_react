import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { ProcessOptions, ProcessResult } from '../types';

export async function resizeImage(uri: string, options: ProcessOptions): Promise<ProcessResult> {
    // 1. Get original dimensions
    const { width: originalWidth, height: originalHeight } = await new Promise<{ width: number, height: number }>((resolve, reject) => {
        Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject);
    });

    // 2. Calculate target dimensions
    let targetWidth = options.targetWidth || originalWidth;
    let targetHeight = options.targetHeight || originalHeight;

    if (options.maintainAspectRatio) {
        if (options.targetWidth && options.targetHeight) {
            // Fit within box (contain)
            const ratio = Math.min(options.targetWidth / originalWidth, options.targetHeight / originalHeight);
            targetWidth = Math.round(originalWidth * ratio);
            targetHeight = Math.round(originalHeight * ratio);
        } else if (options.targetWidth) {
            const ratio = options.targetWidth / originalWidth;
            targetHeight = Math.round(originalHeight * ratio);
        } else if (options.targetHeight) {
            const ratio = options.targetHeight / originalHeight;
            targetWidth = Math.round(originalWidth * ratio);
        }
    }

    // 3. Prepare actions
    const actions: ImageManipulator.Action[] = [];
    if (targetWidth !== originalWidth || targetHeight !== originalHeight) {
        actions.push({ resize: { width: targetWidth, height: targetHeight } });
    }

    // 4. Compress
    // Logic: Web uses canvas.toBlob(quality). Expo uses compress(0-1).
    // If targetSizeKB is set, we use binary search or iterative approach.

    let compress = 0.92; // Default similar to web
    let format = ImageManipulator.SaveFormat.JPEG; // Default to JPEG for compression control
    // If input is PNG and no compression requested, we might want to keep PNG, but web version converts to JPEG for size targets usually. 
    // Web strict logic: if targetSizeKB -> JPEG. Else based on input.
    // We will follow web logic: "Determine output mime type. If target size is set, we must use JPEG"

    // Check original type (heuristic or file extension) - tricky in RN with just URI. 
    // Assuming JPEG for resize unless we strictly need transparency AND no size target.

    if (options.targetSizeKB) {
        const targetSizeBytes = options.targetSizeKB * 1024;
        let minCompress = 0;
        let maxCompress = 1;
        let bestResult: ImageManipulator.ImageResult | null = null;

        for (let i = 0; i < 6; i++) { // 6 iterations for binary search
            compress = (minCompress + maxCompress) / 2;
            const result = await ImageManipulator.manipulateAsync(uri, actions, {
                compress,
                format: ImageManipulator.SaveFormat.JPEG,
            });

            const info = await FileSystem.getInfoAsync(result.uri);
            if (!info.exists) continue;

            if (info.size <= targetSizeBytes) {
                bestResult = result;
                minCompress = compress; // Try higher quality
            } else {
                maxCompress = compress; // Need lower quality
            }
        }

        if (bestResult) {
            const finalInfo = await FileSystem.getInfoAsync(bestResult.uri);
            return {
                uri: bestResult.uri,
                width: bestResult.width,
                height: bestResult.height,
                size: finalInfo.exists ? finalInfo.size : 0,
                mimeType: 'image/jpeg'
            };
        } else {
            // Fallback to lowest quality
            const result = await ImageManipulator.manipulateAsync(uri, actions, {
                compress: 0,
                format: ImageManipulator.SaveFormat.JPEG,
            });
            const info = await FileSystem.getInfoAsync(result.uri);
            return {
                uri: result.uri,
                width: result.width,
                height: result.height,
                size: info.exists ? info.size : 0,
                mimeType: 'image/jpeg',
                warning: `Could not compress below ${options.targetSizeKB} KB. Best result: ${info.exists ? (info.size / 1024).toFixed(0) : '?'} KB`
            };
        }
    } else {
        // Standard single pass
        const result = await ImageManipulator.manipulateAsync(uri, actions, {
            compress: 0.92,
            format: ImageManipulator.SaveFormat.JPEG, // Or PNG if we detect it, but JPEG safer for "Resize" app usually
        });
        const info = await FileSystem.getInfoAsync(result.uri);
        return {
            uri: result.uri,
            width: result.width,
            height: result.height,
            size: info.exists ? info.size : 0,
            mimeType: 'image/jpeg'
        };
    }
}
