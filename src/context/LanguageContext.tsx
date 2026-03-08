import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import ko from '../locales/ko.json';

type Language = 'en' | 'ko';

interface LanguageContextType {
    lang: Language;
    t: typeof en;
    toggleLang: () => void;
    setLangDirectly: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Language>(() => {
        // 1. URL 경로에서 언어 감지 (/ko, /ko/blog 등)
        const path = window.location.pathname;
        const urlLang = path.split('/')[1];
        if (urlLang === 'ko' || urlLang === 'en') return urlLang;

        // 2. localStorage에서 저장된 언어 확인
        const saved = localStorage.getItem('bouncyhachi-lang');
        if (saved === 'ko' || saved === 'en') return saved;

        // 3. 기본값 'en'
        return 'en';
    });

    const toggleLang = () => {
        const newLang = lang === 'en' ? 'ko' : 'en';
        setLang(newLang);
    };

    const setLangDirectly = (newLang: Language) => {
        setLang(newLang);
    };

    useEffect(() => {
        localStorage.setItem('bouncyhachi-lang', lang);
    }, [lang]);

    const t = lang === 'en' ? en : ko;

    return (
        <LanguageContext.Provider value={{ lang, t, toggleLang, setLangDirectly }}>
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
