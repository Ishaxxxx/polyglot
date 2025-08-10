import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setTheme(savedTheme);
        }
    }, []);

    // Apply theme to document body
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    // Listen for theme changes from AudioAssistant
    useEffect(() => {
        const handleThemeChange = (e) => {
            const newTheme = e.detail === 'dark' ? 'dark' : 'light';
            setTheme(newTheme);
            localStorage.setItem('app-theme', newTheme);
        };

        window.addEventListener('assistant-theme', handleThemeChange);
        return () => {
            window.removeEventListener('assistant-theme', handleThemeChange);
        };
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
