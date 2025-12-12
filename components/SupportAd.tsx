import React from 'react';

interface SupportAdProps {
    show: boolean;
    onClose: (rewarded: boolean) => void;
}

export const SupportAd: React.FC<SupportAdProps> = ({ show, onClose }) => {
    if (!show) {
        return null;
    }

    // In a real app, you'd listen for ad events from the SDK.
    // Here, we just assume the user gets the reward when they close the ad.
    const handleClose = () => {
        // TODO: Integrate AdMob rewarded ad logic.
        // The `onClose` callback would typically be triggered by an SDK event listener,
        // e.g., onUserEarnedReward, and you would pass `true`.
        // If the user closes the ad early, you might pass `false`.
        onClose(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center relative max-w-sm w-full animate-scale-in transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Support SmartSizer</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You're watching a short ad to support the developer. Thank you!
                </p>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 rounded">
                    Rewarded Ad Placeholder
                </div>
                <button 
                    onClick={handleClose} 
                    className="mt-6 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Close Ad
                </button>
            </div>
        </div>
    );
};

// Keyframes are already defined in FullScreenAd.tsx, but including them here ensures modularity if needed.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInFast { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in-fast { animation: fadeInFast 0.2s ease-out forwards; }
.animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
`;
document.head.appendChild(style);
