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
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ru">Русский</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
                <option value="hi">हिन्दी</option>
                <option value="nl">Nederlands</option>
                <option value="sv">Svenska</option>
                <option value="ko">한국어</option>
                <option value="tr">Türkçe</option>
                <option value="pl">Polski</option>
                <option value="cs">Čeština</option>
                <option value="fi">Suomi</option>
                <option value="el">Ελληνικά</option>
                <option value="he">עברית</option>
                <option value="hu">Magyar</option>
                <option value="uk">Українська</option>
                <option value="sk">Slovenčina</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="fa">فارسی</option>
                <option value="ga">Gaeilge</option>
                <option value="az">Azərbaycan</option>
                <option value="eo">Esperanto</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;