import React, { useState, useCallback } from 'react';
import { FileType } from '../types';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    fileType: FileType;
}

const fileTypeConfig = {
    image: {
        accept: "image/jpeg,image/png,image/webp",
        prompt: "Supports: JPG, PNG, WebP"
    },
    pdf: {
        accept: "application/pdf",
        prompt: "Supports: PDF"
    }
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, fileType }) => {
    const [isDragging, setIsDragging] = useState(false);
    const config = fileTypeConfig[fileType];

    const handleFile = useCallback((file: File | null) => {
        if (file && config.accept.split(',').includes(file.type)) {
            onFileSelect(file);
        } else {
            alert(`Please upload a valid file type (${config.prompt}).`);
        }
    }, [onFileSelect, config]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        document.getElementById('file-input')?.click();
    };

    return (
        <div>
            <div 
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors
                    ${isDragging ? 'border-primary bg-blue-100 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'}`}
            >
                <input 
                    id="file-input"
                    type="file" 
                    className="hidden" 
                    accept={config.accept}
                    onChange={onFileChange} 
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
                    Drag & drop a file here or
                </p>
                <button 
                    onClick={onButtonClick} 
                    className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                >
                    Select File
                </button>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{config.prompt}</p>
            </div>
        </div>
    );
};