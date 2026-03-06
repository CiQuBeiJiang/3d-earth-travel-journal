/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // Check local storage or default to browser language / 'en'
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('app-language');
        if (savedLang) return savedLang;

        // Auto-detect based on browser
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('zh')) return 'zh';
        return 'en';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
        document.documentElement.lang = language;
    }, [language]);

    // Helper function to get translation string using dot notation (e.g., 'app.title')
    const t = useCallback((key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value === undefined) break;
            value = value[k];
        }

        // Fallback to English if key is missing in Chinese
        if (value === undefined && language !== 'en') {
            value = translations['en'];
            for (const k of keys) {
                if (value === undefined) break;
                value = value[k];
            }
        }

        // Return the key itself if not found anywhere
        if (value === undefined) return key;

        // Simple string parameter replacement {param} -> value
        let result = value;
        Object.keys(params).forEach(paramKey => {
            result = result.replace(`{${paramKey}}`, params[paramKey]);
        });

        return result;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
