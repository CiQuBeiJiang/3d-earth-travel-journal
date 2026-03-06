import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Check local storage or default to 'sky'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'sky';
    });

    const [fontSize, setFontSize] = useState(() => {
        return localStorage.getItem('app-fontsize') || 'medium';
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        document.body.className = `theme-${theme}`;
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('app-fontsize', fontSize);
        document.body.setAttribute('data-fontsize', fontSize);
    }, [fontSize]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'sky' ? 'space' : 'sky');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
};
