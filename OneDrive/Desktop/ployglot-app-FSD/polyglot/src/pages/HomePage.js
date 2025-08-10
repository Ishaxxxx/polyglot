import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

const HomePage = () => {
    const { t } = useLocalization();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState({
        totalTranslations: 0,
        favoriteCount: 0,
        languagesSupported: 6
    });

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Load stats from localStorage
        const favorites = localStorage.getItem('translation-favorites');
        const history = localStorage.getItem('translation-history');

        setStats({
            totalTranslations: history ? JSON.parse(history).length : 0,
            favoriteCount: favorites ? JSON.parse(favorites).length : 0,
            languagesSupported: 6
        });

        // Trigger animation
        setIsVisible(true);

        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: "🎤",
            title: "Voice Input",
            description: "Speak naturally and watch your words transform into text instantly"
        },
        {
            icon: "🔊",
            title: "Text-to-Speech",
            description: "Hear your translations with natural voice synthesis"
        },
        {
            icon: "🌙",
            title: "Dark/Light Mode",
            description: "Switch between themes for comfortable viewing anytime"
        },
        {
            icon: "⭐",
            title: "Smart Favorites",
            description: "Save and quickly access your most important translations"
        },
        {
            icon: "📜",
            title: "Translation History",
            description: "Never lose track of your previous translations"
        },
        {
            icon: "🎯",
            title: "Confidence Scoring",
            description: "See how accurate your translations are in real-time"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className={`text-center p-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="max-w-4xl mx-auto">
                    {/* Animated Title */}
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {t('welcome_message')}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {t('app_introduction')}
                    </p>

                    {/* Live Clock */}
                    <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-200 inline-block">
                        <div className="text-2xl font-bold text-gray-800">
                            🕐 {currentTime.toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-gray-500">
                            {currentTime.toLocaleDateString()}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <div className="text-3xl font-bold">{stats.totalTranslations}</div>
                            <div className="text-blue-100">Total Translations</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <div className="text-3xl font-bold">{stats.favoriteCount}</div>
                            <div className="text-purple-100">Saved Favorites</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            <div className="text-3xl font-bold">{stats.languagesSupported}</div>
                            <div className="text-green-100">Languages Supported</div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition-all duration-500 hover:shadow-xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl border border-yellow-200 mb-8">
                        <h3 className="text-xl font-bold text-orange-800 mb-4">💡 Quick Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="flex items-start space-x-2">
                                <span className="text-orange-500">🎤</span>
                                <span className="text-sm text-orange-700">Click the microphone icon to use voice input for hands-free translation</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="text-orange-500">⭐</span>
                                <span className="text-sm text-orange-700">Save important translations to favorites for quick access later</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="text-orange-500">🌙</span>
                                <span className="text-sm text-orange-700">Toggle dark mode for comfortable viewing in low light</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="text-orange-500">🔊</span>
                                <span className="text-sm text-orange-700">Use text-to-speech to hear proper pronunciation of translations</span>
                            </div>
                        </div>
                    </div>

                    {/* Supported Languages */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Supported Languages</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                { code: 'en', name: 'English', flag: '🇺🇸' },
                                { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
                                { code: 'es', name: 'Spanish', flag: '🇪🇸' },
                                { code: 'fr', name: 'French', flag: '🇫🇷' },
                                { code: 'ko', name: 'Korean', flag: '🇰🇷' },
                                { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
                            ].map((lang) => (
                                <div key={lang.code} className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="font-medium text-gray-700">{lang.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;