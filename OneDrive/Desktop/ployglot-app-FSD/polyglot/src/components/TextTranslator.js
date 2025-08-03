import React, { useState } from 'react';
import { translateText, testLibreTranslate } from '../services/translationService';
import { useLocalization } from '../hooks/useLocalization';

const TextTranslator = () => {
    const { language } = useLocalization();
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState('auto');
    const [connectionStatus, setConnectionStatus] = useState('');

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        setTranslatedText(''); // Clear previous results

        try {
            console.log(`Translating from ${sourceLanguage} to ${language}: "${inputText}"`);
            const result = await translateText(inputText, language, sourceLanguage);

            // Check if translation actually worked
            if (result === inputText) {
                console.warn('Translation returned original text - API might have failed');
                setTranslatedText(`⚠️ Translation may have failed. Showing original text: ${result}`);
            } else {
                setTranslatedText(result);
            }
        } catch (error) {
            console.error('Translation failed:', error);
            setTranslatedText(`❌ Translation failed: ${error.message}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const testConnection = async () => {
        setConnectionStatus('Testing...');
        try {
            const result = await testLibreTranslate();
            if (result) {
                setConnectionStatus('✅ Connection working!');
            } else {
                setConnectionStatus('❌ Connection failed');
            }
        } catch (error) {
            setConnectionStatus('❌ Connection error');
        }

        // Clear status after 3 seconds
        setTimeout(() => setConnectionStatus(''), 3000);
    };

    // LibreTranslate supported languages only
    const languageOptions = [
        { code: 'auto', name: 'Auto Detect' },
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'Arabic' },
        { code: 'az', name: 'Azerbaijani' },
        { code: 'zh', name: 'Chinese' },
        { code: 'cs', name: 'Czech' },
        { code: 'nl', name: 'Dutch' },
        { code: 'eo', name: 'Esperanto' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'he', name: 'Hebrew' },
        { code: 'hi', name: 'Hindi' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ga', name: 'Irish' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'fa', name: 'Persian' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'sk', name: 'Slovak' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'uk', name: 'Ukrainian' }
    ];

    // Helper function to get language name from code
    const getLanguageName = (code) => {
        const lang = languageOptions.find(option => option.code === code);
        return lang ? lang.name : code.toUpperCase();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🌍 LibreTranslate - Free Text Translator
            </h2>

            {/* Source Language Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Language:
                </label>
                <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {languageOptions.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Target Language Display */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Language:
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium">
                    {getLanguageName(language)}
                </div>
            </div>

            {/* Input Text Area */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text to Translate:
                </label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                    {inputText.length} characters
                </div>
            </div>

            {/* Translate Button */}
            <div className="flex gap-2">
                <button
                    onClick={handleTranslate}
                    disabled={!inputText.trim() || isLoading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Translating...
                        </span>
                    ) : (
                        `Translate to ${getLanguageName(language)}`
                    )}
                </button>

                <button
                    onClick={testConnection}
                    className="bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
                >
                    🔧 Test
                </button>
            </div>

            {/* Connection Status */}
            {connectionStatus && (
                <div className="mt-2 text-center text-sm">
                    <span className={connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                        {connectionStatus}
                    </span>
                </div>
            )}

            {/* Translation Result */}
            {translatedText && (
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Translation Result:
                    </label>
                    <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[8rem]">
                        <p className="text-gray-800 whitespace-pre-wrap">{translatedText}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-500">
                            {translatedText.length} characters
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(translatedText)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            📋 Copy Translation
                        </button>
                    </div>
                </div>
            )}

            {/* LibreTranslate Info */}
            <div className="mt-6 p-3 bg-green-50 rounded-md border border-green-200">
                <div className="text-sm text-green-800">
                    <p className="font-semibold mb-2">🌟 Powered by LibreTranslate</p>
                    <div className="mt-3 p-2 bg-green-100 rounded border-l-4 border-green-400">
                        <p className="text-xs text-green-700">
                            ✨ <strong>LibreTranslate:</strong> 100% Free • Open Source • Privacy Focused • No API Key Required • 29 Languages Supported
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextTranslator;
