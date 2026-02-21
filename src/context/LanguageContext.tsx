import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import ko from '../locales/ko.json';

type Language = 'en' | 'ko';

interface LanguageContextType {
    lang: Language;
    t: typeof en;
    toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Language>(() => {
        const saved = localStorage.getItem('bouncyhachi-lang');
        return (saved === 'ko' || saved === 'en') ? saved : 'ko';
    });

    const toggleLang = () => {
        setLang((prev) => (prev === 'en' ? 'ko' : 'en'));
    };

    useEffect(() => {
        localStorage.setItem('bouncyhachi-lang', lang);
    }, [lang]);

    const t = lang === 'en' ? en : ko;

    return (
        <LanguageContext.Provider value={{ lang, t, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
