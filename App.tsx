import React, { useState, useCallback, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { FileUploader } from './components/FileUploader';
import { OptionsPanel } from './components/OptionsPanel';
import { ResultViewer } from './components/ResultViewer';
import { AdBanner } from './components/AdBanner';
import { FullScreenAd } from './components/FullScreenAd';
import { SupportAd } from './components/SupportAd';
import { Toast } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { resizeImage, convertBlobToPng } from './utils/imageUtils';
import { compressPdf } from './utils/pdfUtils';
import { ProcessOptions, ProcessResult, FileType } from './types';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type View = 'splash' | 'selection' | 'processing';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [view, setView] = useState<View>('splash');
    const [fileType, setFileType] = useState<FileType | null>(null);
    const [theme, setTheme] = useState<Theme>('light');

    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [progress, setProgress] = useState<string | null>(null);
    const [result, setResult] = useState<ProcessResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Ad and monetization state
    const [showFullScreenAd, setShowFullScreenAd] = useState<boolean>(false);
    const [showSupportAd, setShowSupportAd] = useState<boolean>(false);
    const [conversionCount, setConversionCount] = useState<number>(() => {
        // Simple persistence to keep track across sessions
        return parseInt(localStorage.getItem('conversionCount') || '0', 10);
    });
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        // Theme initialization
        const savedTheme = localStorage.getItem('theme') as Theme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        // Apply theme to HTML element
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (view === 'splash') {
                setView('selection');
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [view]);
    
    const handleTypeSelect = (type: FileType) => {
        setFileType(type);
        setView('processing');
    };

    const handleFileSelect = (selectedFile: File) => {
        setError(null);
        
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            setError(`File is too large. Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.`);
            return;
        }

        setFile(selectedFile);
        setResult(null);
        
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleProcess = useCallback(async (options: ProcessOptions) => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);
        setProgress(null);

        try {
            let processResult: ProcessResult;
            if (file.type.startsWith('image/')) {
                processResult = await resizeImage(file, options);
            } else if (file.type === 'application/pdf') {
                processResult = await compressPdf(file, options, (message) => setProgress(message));
            } else {
                throw new Error('Unsupported file type.');
            }
            setResult(processResult);
            
            // Ad frequency logic
            const newConversionCount = conversionCount + 1;
            setConversionCount(newConversionCount);
            localStorage.setItem('conversionCount', newConversionCount.toString());
            if (newConversionCount > 0 && newConversionCount % 3 === 0) { // Show ad every 3 conversions
                setShowFullScreenAd(true);
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsProcessing(false);
            setProgress(null);
        }
    }, [file, conversionCount]);

    const handleDownload = () => {
        if (!result) return;
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        const nameParts = file?.name.split('.') ?? ['file'];
        const extension = result.blob.type === 'image/jpeg' ? 'jpg' : nameParts.pop();
        a.download = `${nameParts.join('.')}_optimized.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const handleCopy = async () => {
        if (!result || !result.blob.type.startsWith('image/')) return;
        
        try {
            let blobToCopy = result.blob;

            // Ensure we copy PNGs as they have the best cross-browser support for clipboard
            if (blobToCopy.type !== 'image/png') {
                blobToCopy = await convertBlobToPng(blobToCopy);
            }

            await navigator.clipboard.write([
                new ClipboardItem({ [blobToCopy.type]: blobToCopy })
            ]);
            setToastMessage("Image copied to clipboard!");
        } catch (err) {
            setError('Failed to copy image to clipboard. Browser support may vary.');
            console.error('Copy failed', err);
        }
    }

    const handleSupportDeveloper = () => {
        setShowSupportAd(true);
    };

    const handleSupportAdClosed = (rewarded: boolean) => {
        setShowSupportAd(false);
        if (rewarded) {
            setToastMessage("Thank you for supporting free tools like SmartSizer!");
        }
    };

    const handleReset = (backToSelection: boolean = false) => {
        setFile(null);
        setResult(null);
        setError(null);
        setPreviewUrl(null);
        setIsProcessing(false);
        setProgress(null);
        if (backToSelection) {
            setFileType(null);
            setView('selection');
        }
    };

    const renderProcessingScreen = () => (
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 transition-colors duration-300">
            {!file ? (
                <FileUploader onFileSelect={handleFileSelect} fileType={fileType!} />
            ) : (
                <>
                    <div className="text-center">
                         {result ? (
                            <button onClick={() => handleReset(true)} className="w-full text-center mt-4 px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Process Another File
                            </button>
                         ) : (
                            <button onClick={() => handleReset(false)} className="text-sm text-primary hover:underline mb-4">
                                &#8592; Change File
                            </button>
                         )}
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain my-4 bg-gray-100 dark:bg-gray-700" />
                        ) : (
                            <div className="flex items-center justify-center p-4 my-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                            </div>
                        )}
                        <p className="font-medium truncate text-gray-800 dark:text-gray-200">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    
                    {!result && !isProcessing && <OptionsPanel isImage={file.type.startsWith('image/')} onProcess={handleProcess} isProcessing={isProcessing} />}
                    
                    {isProcessing && progress && <p className="text-center text-primary font-medium">{progress}</p>}
                </>
            )}
            
            {error && <p className="text-red-500 text-center font-medium p-3 bg-red-50 rounded-lg">{error}</p>}
            
            {result && <ResultViewer 
                originalSize={file!.size} 
                result={result}
                isImage={result.blob.type.startsWith('image/')}
                onDownload={handleDownload}
                onCopy={handleCopy}
                onSupport={handleSupportDeveloper}
            />}
        </div>
    );

    return (
        <div className="font-sans text-gray-800 dark:text-gray-200 min-h-screen flex flex-col pb-16">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow flex items-center justify-center p-4">
                {view === 'splash' && <SplashScreen />}
                {view === 'selection' && <SelectionScreen onSelect={handleTypeSelect} />}
                {view === 'processing' && renderProcessingScreen()}
            </main>

            <AdBanner />
            <FullScreenAd show={showFullScreenAd} onClose={() => setShowFullScreenAd(false)} />
            <SupportAd show={showSupportAd} onClose={handleSupportAdClosed} />
            <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
    );
};

export default App;