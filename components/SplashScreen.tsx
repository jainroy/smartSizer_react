import React from 'react';

export const SplashScreen: React.FC = () => {
    return (
        <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-primary">SmartSizer</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Resize Images & PDFs Instantly.</p>
            <div className="mt-8 h-2 w-48 mx-auto rounded-full overflow-hidden">
                 <div className="h-full w-full animate-shimmer"></div>
            </div>
        </div>
    );
};

// Add keyframes for animation in a global CSS file or style block
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);