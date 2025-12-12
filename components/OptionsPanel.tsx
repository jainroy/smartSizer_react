
import React, { useState, useEffect } from 'react';
import { ProcessOptions } from '../types';

interface OptionsPanelProps {
    isImage: boolean;
    onProcess: (options: ProcessOptions) => void;
    isProcessing: boolean;
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; unit: string }> = ({ label, value, onChange, placeholder, unit }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <input
                type="number"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="block w-full pl-3 pr-12 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:bg-blue-50 dark:focus:bg-gray-600 transition-colors duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{unit}</span>
            </div>
        </div>
    </div>
);


export const OptionsPanel: React.FC<OptionsPanelProps> = ({ isImage, onProcess, isProcessing }) => {
    const [targetWidth, setTargetWidth] = useState('');
    const [targetHeight, setTargetHeight] = useState('');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [targetSizeKB, setTargetSizeKB] = useState('');

    const canProcess = targetWidth || targetHeight || targetSizeKB;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProcess({
            targetWidth: targetWidth ? parseInt(targetWidth) : undefined,
            targetHeight: targetHeight ? parseInt(targetHeight) : undefined,
            maintainAspectRatio: isImage ? maintainAspectRatio : undefined,
            targetSizeKB: targetSizeKB ? parseInt(targetSizeKB) : undefined,
        });
    };
    
    // Disable other field when one is being used
    const handleResolutionChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
        if (e.target.value) setTargetSizeKB('');
    }

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetSizeKB(e.target.value);
        if (e.target.value) {
            setTargetWidth('');
            setTargetHeight('');
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-center font-medium text-gray-600 dark:text-gray-400 mb-3">Target Resolution</p>
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Width" value={targetWidth} onChange={(e) => handleResolutionChange(e, setTargetWidth)} placeholder="e.g. 1920" unit="px" />
                    <InputField label="Height" value={targetHeight} onChange={(e) => handleResolutionChange(e, setTargetHeight)} placeholder="e.g. 1080" unit="px" />
                </div>
                {isImage && (
                    <div className="mt-4 flex items-center">
                        <input
                            id="aspect-ratio"
                            type="checkbox"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-700"
                        />
                        <label htmlFor="aspect-ratio" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            Maintain Aspect Ratio
                        </label>
                    </div>
                )}
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                 <p className="text-center font-medium text-gray-600 dark:text-gray-400 mb-3">Target File Size</p>
                 <InputField label="File Size" value={targetSizeKB} onChange={handleSizeChange} placeholder="e.g. 500" unit="KB" />
            </div>

            <button
                type="submit"
                disabled={!canProcess || isProcessing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : 'Resize / Compress'}
            </button>
        </form>
    );
};