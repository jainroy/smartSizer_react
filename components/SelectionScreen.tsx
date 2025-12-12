import React from 'react';
import { FileType } from '../types';

interface SelectionScreenProps {
    onSelect: (type: FileType) => void;
}

const SelectionCard: React.FC<{ icon: string; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
    <div 
        onClick={onClick}
        className="group w-full sm:w-64 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:border dark:border-gray-700 text-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 transform"
    >
        <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    </div>
);

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
    return (
        <div className="text-center animate-fade-in space-y-8">
            <div>
                 <h1 className="text-3xl sm:text-4xl font-bold text-primary">SmartSizer</h1>
                 <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Choose what you want to optimize.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <SelectionCard icon="📷" title="Resize Image" onClick={() => onSelect('image')} />
                <SelectionCard icon="📄" title="Compress PDF" onClick={() => onSelect('pdf')} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 pt-4">All processing done locally — no uploads required.</p>
        </div>
    );
};

// Add keyframes for animation in a global CSS file or style block
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);