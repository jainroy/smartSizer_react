import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

// Simple color tokens for parity
export const colors = {
    light: {
        background: '#ffffff',
        text: '#1f2937',
        primary: '#1976D2',
        secondary: '#6b7280',
        card: '#f9fafb',
        border: '#e5e7eb',
    },
    dark: {
        background: '#1f2937', // dark-gray-800 from web
        text: '#f3f4f6',
        primary: '#60a5fa', // blue-400
        secondary: '#9ca3af',
        card: '#374151', // gray-700
        border: '#4b5563',
    }
};
