import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';
import LanguageSwitcher from './components/LanguageSwitcher';
import TextTranslator from './components/TextTranslator';

// 6. The main App component
// We wrap everything in the LanguageProvider to make the context available.
export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50 py-8 font-sans">
        <div className="max-w-4xl w-full mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <HomePage />
            <LanguageSwitcher />
          </div>

          {/* New Translation Feature */}
          <TextTranslator />

          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>Polyglot App &copy; 2025</p>
            <p>Powered by LibreTranslate - Free Open Source Translation</p>
          </footer>
        </div>
      </div>
    </LanguageProvider>
  );
}
