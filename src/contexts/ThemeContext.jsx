import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Check local storage or default to 'sky'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app-theme') || 'sky';
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
        // Add theme class to body for easy global CSS targeting
        document.body.className = `theme-${theme}`;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'sky' ? 'space' : 'sky');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
