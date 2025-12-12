import React, { useEffect } from 'react';

interface ToastProps {
    message: string | null;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000); // Auto-dismiss after 4 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) {
        return null;
    }

    return (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-auto mb-4 z-50">
            <div className="flex items-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-lg animate-fade-in-up">
                <span className="font-medium">{message}</span>
                <button onClick={onClose} className="ml-4 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-black">
                    &times;
                </button>
            </div>
        </div>
    );
};

// Add keyframes for animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
