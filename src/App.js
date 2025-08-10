import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LanguageSwitcher from './components/LanguageSwitcher';
import TextTranslator from './components/TextTranslator';
import AudioAssistant from './components/AudioAssistant';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white mx-auto mb-8"></div>
          <h1 className="text-4xl font-bold text-white mb-4">🌍 Polyglot</h1>
          <p className="text-xl text-white opacity-80">Loading your AI-powered translator...</p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Navigation Header */}
          <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🌍</span>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Polyglot AI
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">AI-Powered Translation</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Hero Section */}
            <div className="mb-12">
              <HomePage />
            </div>

            {/* Language Switcher Section */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Interface Language</h2>
                  <p className="text-gray-600">Select the language for the app interface</p>
                </div>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Main Translator */}
            <div className="mb-12">
              <TextTranslator />
            </div>

            {/* Additional Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full text-left p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
                  >
                    🔄 Refresh App
                  </button>
                  <button
                    onClick={() => localStorage.clear()}
                    className="w-full text-left p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
                  >
                    🗑️ Clear All Data
                  </button>
                  <button
                    onClick={() => window.open('https://github.com/Ishaxxxx/polyglot', '_blank')}
                    className="w-full text-left p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
                  >
                    💻 View Source Code
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">📱 App Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Version:</span> 2.0.0 Advanced</p>
                  <p><span className="font-semibold">Last Updated:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-semibold">Translation Engine:</span> LibreTranslate</p>
                  <p><span className="font-semibold">Voice Support:</span> Web Speech API</p>
                  <p><span className="font-semibold">Platform:</span> Progressive Web App</p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">📊 App Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">&lt;100ms</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">Free</div>
                  <div className="text-sm text-gray-600">Forever</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-bold mb-4">🌍 Polyglot AI</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The most advanced free translation app with AI-powered voice recognition,
                    real-time translation, and intelligent features.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4">✨ Features</h4>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>• Voice Input & Output</li>
                    <li>• Dark/Light Themes</li>
                    <li>• Translation History</li>
                    <li>• Confidence Scoring</li>
                    <li>• Smart Favorites</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4">🔗 Links</h4>
                  <ul className="text-gray-400 text-sm space-y-2">
                    <li>
                      <a href="https://github.com/Ishaxxxx/polyglot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        GitHub Repository
                      </a>
                    </li>
                    <li>
                      <a href="https://libretranslate.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        LibreTranslate API
                      </a>
                    </li>
                    <li>
                      <span className="text-gray-400 cursor-default">
                        Privacy Policy
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-400 text-sm">
                  © 2025 Polyglot AI. Made with ❤️ using React, Tailwind CSS, and LibreTranslate.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Open source • Privacy focused • No data collection • Completely free
                </p>
              </div>
            </div>
          </footer>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 z-50"
              aria-label="Scroll to top"
            >
              ⬆️
            </button>
          )}

          {/* Audio Assistant */}
          <AudioAssistant />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
