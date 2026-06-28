import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const FONT_OPTIONS = [
    { label: 'Lato', value: "'Lato', sans-serif" },
    { label: 'Roboto', value: "'Roboto', sans-serif" },
    { label: 'Georgia', value: "'Georgia', serif" },
    { label: 'Times New Roman', value: "'Times New Roman', serif" },
    { label: 'System', value: "system-ui, sans-serif" },
];

const FONT_SIZE_MIN = 0.8;
const FONT_SIZE_MAX = 1.6;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_DEFAULT = 1.1;

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const [fontFamily, setFontFamily] = useState(() => {
        return localStorage.getItem('fontFamily') || FONT_OPTIONS[0].value;
    });

    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem('fontSize');
        return saved ? parseFloat(saved) : FONT_SIZE_DEFAULT;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem('fontFamily', fontFamily);
    }, [fontFamily]);

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize.toString());
    }, [fontSize]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{
            darkMode,
            toggleTheme,
            fontFamily,
            setFontFamily,
            fontSize,
            setFontSize,
            FONT_OPTIONS,
            FONT_SIZE_MIN,
            FONT_SIZE_MAX,
            FONT_SIZE_STEP,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
