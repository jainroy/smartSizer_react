import { ProcessOptions, ProcessResult } from '../types';

// TypeScript declarations for libraries loaded from CDN
declare const pdfjsLib: any;
declare const PDFLib: any;

export async function compressPdf(
    file: File, 
    options: ProcessOptions,
    onProgress: (message: string) => void
): Promise<ProcessResult> {
    if (typeof pdfjsLib === 'undefined' || typeof PDFLib === 'undefined') {
        throw new Error('PDF processing libraries not loaded. Please check your internet connection and try again.');
    }

    const { PDFDocument } = PDFLib;

    const arrayBuffer = await file.arrayBuffer();
    onProgress('Loading PDF...');
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    const generatePdfAtQuality = async (jpegQuality: number): Promise<Uint8Array> => {
        const newPdfDoc = await PDFDocument.create();
        for (let i = 1; i <= numPages; i++) {
            onProgress(`Processing page ${i} of ${numPages}...`);
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Could not get canvas context for PDF page.');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;

            const jpgImageBytes = await new Promise<string>((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob conversion failed for PDF page.'));
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', jpegQuality);
            });

            const jpgImage = await newPdfDoc.embedJpg(jpgImageBytes.split(',')[1]);
            const newPage = newPdfDoc.addPage([jpgImage.width, jpgImage.height]);
            newPage.drawImage(jpgImage, {
                x: 0,
                y: 0,
                width: newPage.getWidth(),
                height: newPage.getHeight(),
            });
        }
        onProgress('Finalizing PDF...');
        return newPdfDoc.save();
    };

    let quality = 0.85; // Start with slightly lower quality for better initial compression
    let pdfBytes = await generatePdfAtQuality(quality);
    let warning: string | undefined;

    if (options.targetSizeKB) {
        const targetSizeBytes = options.targetSizeKB * 1024;
        
        // If we are over size, iteratively reduce quality
        while (pdfBytes.length > targetSizeBytes && quality > 0.1) {
            quality = Math.max(0.05, quality - 0.15); // Reduce quality
            pdfBytes = await generatePdfAtQuality(quality);
        }
    }

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    if (options.targetSizeKB && blob.size > options.targetSizeKB * 1024) {
        warning = `Couldn't compress below ${options.targetSizeKB} KB. Smallest result is ${(blob.size / 1024).toFixed(0)} KB.`;
    }

    return { blob, warning };
}
