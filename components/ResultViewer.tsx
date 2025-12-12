import React, { useState, useEffect } from 'react';
import { ProcessResult } from '../types';

interface ResultViewerProps {
    originalSize: number;
    result: ProcessResult;
    isImage: boolean;
    onDownload: () => void;
    onCopy: () => void;
    onSupport: () => void;
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ originalSize, result, isImage, onDownload, onCopy, onSupport }) => {
    const { blob: resultBlob, warning } = result;
    const resultSize = resultBlob.size;

    const [animatedReduction, setAnimatedReduction] = useState(0);

    const sizeReduction = originalSize > 0 ? ((originalSize - resultSize) / originalSize * 100) : 0;

    useEffect(() => {
        if (sizeReduction <= 0) {
            setAnimatedReduction(Math.round(sizeReduction));
            return;
        }
        const duration = 1000;
        const frameRate = 60;
        const totalFrames = duration / (1000 / frameRate);
        const increment = sizeReduction / totalFrames;
        let currentReduction = 0;

        const timer = setInterval(() => {
            currentReduction += increment;
            if (currentReduction >= sizeReduction) {
                setAnimatedReduction(Math.round(sizeReduction));
                clearInterval(timer);
            } else {
                setAnimatedReduction(Math.round(currentReduction));
            }
        }, 1000 / frameRate);

        return () => clearInterval(timer);
    }, [sizeReduction]);

    const resultColorClass = sizeReduction > 0 ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400';

    return (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center animate-fade-in">
            <div className="flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Your file is ready! 🎉</h3>
            </div>
            <div className="my-3 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{formatSize(originalSize)}</span> 
                <span className="mx-2">&rarr;</span> 
                <span className="font-semibold text-xl text-green-800 dark:text-green-300">{formatSize(resultSize)}</span>
            </div>
            <p className={`font-bold text-2xl ${resultColorClass}`}>
                {sizeReduction > 0 ? `Size reduced by ${animatedReduction}%` : 'Size increased slightly'}
            </p>

            {warning && (
                <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 text-sm rounded-md">
                    {warning}
                </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={onDownload}
                    className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                </button>
                {isImage && (
                     <button
                        onClick={onCopy}
                        className="inline-flex items-center justify-center px-6 py-2 bg-gray-600 dark:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                        </svg>
                        Copy
                    </button>
                )}
            </div>

            <div className="mt-6 border-t border-green-200 dark:border-green-800 pt-4">
                 <button
                    onClick={onSupport}
                    className="inline-flex items-center justify-center px-5 py-2 bg-transparent text-accent font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                    <span className="mr-2 text-lg">💙</span>
                    Support the Developer
                </button>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your support keeps SmartSizer free for everyone.</p>
            </div>
        </div>
    );
};

// Add keyframes for animation in index.html or a CSS file
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);