import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

// 3. Create a custom hook for easy access to translations
// Custom hooks are a powerful way to extract and reuse component logic.
export const useLocalization = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLocalization must be used within a LanguageProvider');
    }

    // The 't' function is a common convention for translation functions.
    // It takes a key and returns the corresponding translated string.
    const t = (key) => {
        return context.messages[key] || key;
    };

    return { t, language: context.language, setLanguage: context.setLanguage };
};