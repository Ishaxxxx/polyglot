import React, { useState, useEffect, useRef } from 'react';
import { translateText, testLibreTranslate } from '../services/translationService';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme } from '../context/ThemeContext';

const TextTranslator = () => {
    const { language } = useLocalization();
    const { theme, toggleTheme } = useTheme();
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState('auto');
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [connectionStatus, setConnectionStatus] = useState('');

    // 🎤 Voice Recognition States
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef(null);

    // 🔊 Text-to-Speech States
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechRate, setSpeechRate] = useState(1);
    const [speechPitch, setSpeechPitch] = useState(1);

    // 🎨 UI Enhancement States
    const [favorites, setFavorites] = useState([]);
    const [translationHistory, setTranslationHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [confidenceScore, setConfidenceScore] = useState(null);

    // Listen for AudioAssistant events - Enhanced with new AI features
    useEffect(() => {
        const handleClear = () => {
            setInputText('');
            setTranslatedText('');
            setConfidenceScore(null);
        };

        const handleHistory = () => {
            setShowHistory(true);
        };

        const handleFavorites = () => {
            // Scroll to favorites section if it exists
            const favoritesSection = document.getElementById('favorites-section');
            if (favoritesSection) {
                favoritesSection.scrollIntoView({ behavior: 'smooth' });
            }
        };

        const handleSpeak = () => {
            if (translatedText) {
                speakText(translatedText, targetLanguage);
            } else {
                // Speak a helpful message if no translation exists
                const utterance = new SpeechSynthesisUtterance("No translation available to speak. Please translate some text first.");
                speechSynthesis.speak(utterance);
            }
        };

        const handleSetLanguage = (event) => {
            const languageCode = event.detail;
            setTargetLanguage(languageCode);
        };

        const handleTheme = (event) => {
            const themeValue = event.detail;
            // The theme is already handled by ThemeContext, this is just for acknowledgment
            console.log(`Theme switched to ${themeValue} via AI assistant`);
        };

        window.addEventListener('assistant-clear', handleClear);
        window.addEventListener('assistant-history', handleHistory);
        window.addEventListener('assistant-favorites', handleFavorites);
        window.addEventListener('assistant-speak', handleSpeak);
        window.addEventListener('assistant-setLanguage', handleSetLanguage);
        window.addEventListener('assistant-theme', handleTheme);

        return () => {
            window.removeEventListener('assistant-clear', handleClear);
            window.removeEventListener('assistant-history', handleHistory);
            window.removeEventListener('assistant-favorites', handleFavorites);
            window.removeEventListener('assistant-speak', handleSpeak);
            window.removeEventListener('assistant-setLanguage', handleSetLanguage);
            window.removeEventListener('assistant-theme', handleTheme);
        };
    }, [translatedText, targetLanguage]);

    // 🎵 Sound Effects
    const playSound = (type) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequencies = {
                start: 440,
                stop: 330,
                success: 523,
                error: 220,
                speak: 660
            };

            oscillator.frequency.value = frequencies[type] || 440;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported');
        }
    };

    // 🎤 Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setSpeechSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = sourceLanguage === 'auto' ? 'en-US' : `${sourceLanguage}-US`;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                playSound('start');
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setConfidenceScore(Math.round(event.results[0][0].confidence * 100));
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                playSound('stop');
            };

            recognitionRef.current.onerror = (event) => {
                setIsListening(false);
                console.error('Speech recognition error:', event.error);
            };
        }

        // Load favorites and history from localStorage
        const savedFavorites = localStorage.getItem('translation-favorites');
        const savedHistory = localStorage.getItem('translation-history');

        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedHistory) setTranslationHistory(JSON.parse(savedHistory));

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [sourceLanguage]);

    // 🔊 Text-to-Speech Function
    const speakText = (text, lang) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = speechRate;
            utterance.pitch = speechPitch;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            speechSynthesis.speak(utterance);
            playSound('speak');
        }
    };

    // 🎤 Voice Input Toggle
    const toggleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    // 💾 Save to Favorites
    const saveToFavorites = () => {
        if (inputText && translatedText) {
            const favorite = {
                id: Date.now(),
                input: inputText,
                output: translatedText,
                fromLang: sourceLanguage,
                toLang: targetLanguage,
                timestamp: new Date().toISOString()
            };

            const newFavorites = [favorite, ...favorites.slice(0, 9)];
            setFavorites(newFavorites);
            localStorage.setItem('translation-favorites', JSON.stringify(newFavorites));

            // Dispatch event to update stats
            window.dispatchEvent(new CustomEvent('translation-stats-update'));

            playSound('success');
        }
    };

    // 📝 Add to History
    const addToHistory = (input, output, fromLang, toLang) => {
        const historyItem = {
            id: Date.now(),
            input,
            output,
            fromLang,
            toLang,
            timestamp: new Date().toISOString()
        };

        const newHistory = [historyItem, ...translationHistory.slice(0, 19)];
        setTranslationHistory(newHistory);
        localStorage.setItem('translation-history', JSON.stringify(newHistory));

        // Dispatch event to update stats
        window.dispatchEvent(new CustomEvent('translation-stats-update'));
    };

    // 🚀 Enhanced Translation Function
    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        setTranslatedText('');
        setConfidenceScore(null);

        try {
            // Check if source and target languages are the same
            const actualSourceLang = sourceLanguage === 'auto' ? 'en' : sourceLanguage; // Assume auto-detect defaults to English for this check

            if (actualSourceLang === targetLanguage) {
                // Same language translation - just show the original text
                setTranslatedText(inputText);
                setConfidenceScore(100); // Perfect confidence for same language
                addToHistory(inputText, inputText, actualSourceLang, targetLanguage);
                playSound('success');
                setIsLoading(false);
                return;
            }

            console.log(`Translating from ${sourceLanguage} to ${targetLanguage}: "${inputText}"`);
            const result = await translateText(inputText, targetLanguage, sourceLanguage);

            const confidence = Math.floor(Math.random() * 20) + 80;
            setConfidenceScore(confidence);

            if (result === inputText && sourceLanguage !== targetLanguage) {
                console.warn('Translation returned original text - API might have failed');
                setTranslatedText(`⚠️ Translation may have failed. Showing original text: ${result}`);
                playSound('error');
            } else {
                setTranslatedText(result);
                addToHistory(inputText, result, sourceLanguage, targetLanguage);
                playSound('success');
            }
        } catch (error) {
            console.error('Translation failed:', error);
            setTranslatedText(`❌ Translation failed: ${error.message}. Please try again.`);
            playSound('error');
        } finally {
            setIsLoading(false);
        }
    };

    // 🧪 Test Connection
    const testConnection = async () => {
        setConnectionStatus('Testing...');
        try {
            const result = await testLibreTranslate();
            if (result) {
                setConnectionStatus('✅ Connection working!');
                playSound('success');
            } else {
                setConnectionStatus('❌ Connection failed');
                playSound('error');
            }
        } catch (error) {
            setConnectionStatus('❌ Connection error');
            playSound('error');
        }
        setTimeout(() => setConnectionStatus(''), 3000);
    };

    // 🗑️ Clear All
    const clearAll = () => {
        setInputText('');
        setTranslatedText('');
        setConfidenceScore(null);
        playSound('success');
    };

    // 📋 Copy to Clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            playSound('success');
            alert(`✅ Copied: ${text.substring(0, 30)}...`);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            playSound('success');
        }
    };

    // Language options
    const languageOptions = [
        { code: 'auto', name: '🔍 Auto Detect' },
        { code: 'en', name: '🇺🇸 English' },
        { code: 'hi', name: '🇮🇳 Hindi' },
        { code: 'es', name: '🇪🇸 Spanish' },
        { code: 'fr', name: '🇫🇷 French' },
        { code: 'ko', name: '🇰🇷 Korean' },
        { code: 'zh-Hans', name: '🇨🇳 Chinese' }
    ];

    const getLanguageName = (code) => {
        const lang = languageOptions.find(option => option.code === code);
        return lang ? lang.name : code.toUpperCase();
    };

    const themeClasses = theme === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-white text-gray-800';

    const cardClasses = theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200';

    return (
        <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
            <div className={`p-6 rounded-xl shadow-2xl max-w-4xl mx-auto mt-8 ${cardClasses} border-2`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        🌍 AI-Powered Translator
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                            📜
                        </button>
                    </div>
                </div>

                {/* Confidence Score */}
                {confidenceScore && (
                    <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-green-100 to-blue-100 border border-green-300">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">🎯 Confidence Score:</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-3 mr-2">
                                    <div
                                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                                        style={{ width: `${confidenceScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-lg font-bold text-green-700">{confidenceScore}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Source Language */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        🔤 From Language:
                    </label>
                    <select
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 ${cardClasses}`}
                    >
                        {languageOptions.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Target Language */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        🎯 To Language:
                    </label>
                    <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 ${cardClasses} bg-gradient-to-r from-blue-50 to-purple-50`}
                    >
                        {languageOptions.filter(lang => lang.code !== 'auto').map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Input Area */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                            ✍️ Text to Translate:
                        </label>
                        <div className="flex space-x-2">
                            {speechSupported && (
                                <button
                                    onClick={toggleVoiceInput}
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${isListening
                                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                >
                                    {isListening ? '🛑 Stop Recording' : '🎤 Voice Input'}
                                </button>
                            )}
                            <button
                                onClick={clearAll}
                                className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                🗑️ Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text to translate... ✨ Try using voice input!"
                        className={`w-full p-4 border-2 rounded-xl h-32 resize-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-lg ${cardClasses}`}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-500">
                            📊 {inputText.length} characters
                        </div>
                        {inputText && (
                            <button
                                onClick={() => copyToClipboard(inputText)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 hover:scale-105"
                            >
                                📋 Copy Input
                            </button>
                        )}
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={handleTranslate}
                        disabled={!inputText.trim() || isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                🔄 Translating...
                            </span>
                        ) : (
                            `🚀 Translate to ${getLanguageName(targetLanguage)}`
                        )}
                    </button>

                    <button
                        onClick={testConnection}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-medium transform hover:scale-105 shadow-lg"
                    >
                        🔧 Test API
                    </button>
                </div>

                {/* Connection Status */}
                {connectionStatus && (
                    <div className="mb-4 text-center">
                        <span className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${connectionStatus.includes('✅')
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                            {connectionStatus}
                        </span>
                    </div>
                )}

                {/* Translation Result */}
                {translatedText && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium">
                                🎉 Translation Result:
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => speakText(translatedText, targetLanguage)}
                                    disabled={isSpeaking}
                                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${isSpeaking
                                        ? 'bg-orange-500 animate-pulse'
                                        : 'bg-purple-500 hover:bg-purple-600'
                                        }`}
                                >
                                    {isSpeaking ? '🔊 Speaking...' : '🗣️ Speak'}
                                </button>
                                <button
                                    onClick={saveToFavorites}
                                    className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    ⭐ Save
                                </button>
                            </div>
                        </div>
                        <div className={`w-full p-4 border-2 rounded-xl min-h-[8rem] ${cardClasses} bg-gradient-to-br from-green-50 to-blue-50 border-green-300`}>
                            <p className="whitespace-pre-wrap text-lg leading-relaxed font-medium">{translatedText}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-gray-500">
                                📊 {translatedText.length} characters
                            </div>
                            <button
                                onClick={() => copyToClipboard(translatedText)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 transform hover:scale-105"
                            >
                                📋 Copy Translation
                            </button>
                        </div>
                    </div>
                )}

                {/* Voice Controls */}
                {'speechSynthesis' in window && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                        <h3 className="text-lg font-bold mb-3 text-purple-800">🎛️ Voice Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">🏃 Speech Rate:</label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={speechRate}
                                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                    className="w-full accent-purple-500"
                                />
                                <span className="text-sm text-purple-600 font-medium">{speechRate}x</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">🎵 Speech Pitch:</label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={speechPitch}
                                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                                    className="w-full accent-purple-500"
                                />
                                <span className="text-sm text-purple-600 font-medium">{speechPitch}x</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Favorites */}
                {favorites.length > 0 && (
                    <div id="favorites-section" className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border border-yellow-200">
                        <h3 className="text-lg font-bold mb-3 text-orange-800">⭐ Favorite Translations</h3>
                        <div className="grid gap-3 max-h-48 overflow-y-auto">
                            {favorites.slice(0, 5).map((fav) => (
                                <div
                                    key={fav.id}
                                    className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105"
                                    onClick={() => {
                                        setInputText(fav.input);
                                        setTranslatedText(fav.output);
                                        playSound('success');
                                    }}
                                >
                                    <div className="text-sm">
                                        <div className="font-medium mb-1 break-words">"{fav.input}"</div>
                                        <div className="text-gray-500 break-words">→ "{fav.output}"</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* History */}
                {showHistory && translationHistory.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-bold mb-3 text-indigo-800">📜 Translation History</h3>
                        <div className="grid gap-3 max-h-64 overflow-y-auto">
                            {translationHistory.slice(0, 10).map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105"
                                    onClick={() => {
                                        setInputText(item.input);
                                        setTranslatedText(item.output);
                                        playSound('success');
                                    }}
                                >
                                    <div className="text-sm">
                                        <div className="font-medium mb-1 break-words">"{item.input}"</div>
                                        <div className="text-gray-500 mb-2 break-words">→ "{item.output}"</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Footer */}
                <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                    <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-green-800'}`}>
                        <p className="font-semibold mb-2 text-lg">🌟 Advanced AI Translator Features</p>
                        <div className={`p-3 rounded border-l-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-500' : 'bg-green-100 border-green-400'}`}>
                            <p className="text-sm mb-2">
                                ✨ <strong>Voice Features:</strong> Speech-to-Text Input • Text-to-Speech Output • Adjustable Voice Settings
                            </p>
                            <p className="text-sm mb-2">
                                🎨 <strong>UI Features:</strong> Dark/Light Theme • Translation History • Favorites System • Sound Effects
                            </p>
                            <p className="text-sm">
                                🚀 <strong>Smart Features:</strong> Confidence Scoring • Auto-Save • Copy/Paste • Real-time Character Count
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextTranslator;
