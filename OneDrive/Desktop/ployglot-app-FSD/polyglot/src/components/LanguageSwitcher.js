import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

// 4. The LanguageSwitcher component
// This component consumes the context via our custom hook to change the language.
const LanguageSwitcher = () => {
    const { t, setLanguage, language } = useLocalization();

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md my-4 flex items-center justify-center space-x-4">
            <label htmlFor="language-select" className="text-lg font-medium text-gray-700">
                {t('change_language_label')}
            </label>
            <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="ko">한국어 (Korean)</option>
                <option value="zh-Hans">中文 (Chinese Simplified)</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;