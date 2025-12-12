import React from 'react';

interface FullScreenAdProps {
    show: boolean;
    onClose: () => void;
}

export const FullScreenAd: React.FC<FullScreenAdProps> = ({ show, onClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center relative max-w-sm w-full animate-scale-in transition-colors duration-300">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close ad"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Advertisement</h2>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded">
                    Full-Screen Ad Placeholder
                </div>
                <button 
                    onClick={onClose} 
                    className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                    Close Ad
                </button>
            </div>
        </div>
    );
};

// Add keyframes for animation in index.html or a CSS file
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInFast {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in-fast {
  animation: fadeInFast 0.2s ease-out forwards;
}
.animate-scale-in {
  animation: scaleIn 0.2s ease-out forwards;
}
`;
document.head.appendChild(style);