import React, { useState, createContext, useEffect } from 'react';

// Mock dictionary to simulate importing JSON files
const enTranslations = {
    "welcome_message": "Welcome to Polyglot!",
    "app_introduction": "This is a simple application to demonstrate multilingual capabilities using React Hooks.",
    "change_language_label": "Select Language:"
};

const esTranslations = {
    "welcome_message": "¡Bienvenido a Polyglot!",
    "app_introduction": "Esta es una aplicación sencilla para demostrar las capacidades multilingües usando React Hooks.",
    "change_language_label": "Seleccione el Idioma:"
};

const frTranslations = {
    "welcome_message": "Bienvenue chez Polyglot !",
    "app_introduction": "Ceci est une application simple pour démontrer les capacités multilingues à l'aide de React Hooks.",
    "change_language_label": "Choisir la Langue:"
};

const deTranslations = {
    "welcome_message": "Willkommen bei Polyglot!",
    "app_introduction": "Dies ist eine einfache Anwendung zur Demonstration mehrsprachiger Funktionen mit React Hooks.",
    "change_language_label": "Sprache auswählen:"
};

const itTranslations = {
    "welcome_message": "Benvenuto in Polyglot!",
    "app_introduction": "Questa è un'applicazione semplice per dimostrare le capacità multilingue usando React Hooks.",
    "change_language_label": "Seleziona Lingua:"
};

const ptTranslations = {
    "welcome_message": "Bem-vindo ao Polyglot!",
    "app_introduction": "Esta é uma aplicação simples para demonstrar capacidades multilíngues usando React Hooks.",
    "change_language_label": "Selecionar Idioma:"
};

const ruTranslations = {
    "welcome_message": "Добро пожаловать в Polyglot!",
    "app_introduction": "Это простое приложение для демонстрации многоязычных возможностей с использованием React Hooks.",
    "change_language_label": "Выберите язык:"
};

const jaTranslations = {
    "welcome_message": "Polyglotへようこそ！",
    "app_introduction": "これはReact Hooksを使用して多言語機能を実証するシンプルなアプリケーションです。",
    "change_language_label": "言語を選択："
};

const arTranslations = {
    "welcome_message": "مرحباً بك في Polyglot!",
    "app_introduction": "هذا تطبيق بسيط لإظهار القدرات متعددة اللغات باستخدام React Hooks.",
    "change_language_label": "اختر اللغة:"
};

const hiTranslations = {
    "welcome_message": "Polyglot में आपका स्वागत है!",
    "app_introduction": "यह React Hooks का उपयोग करके बहुभाषी क्षमताओं को प्रदर्शित करने के लिए एक सरल एप्लिकेशन है।",
    "change_language_label": "भाषा चुनें:"
};

const nlTranslations = {
    "welcome_message": "Welkom bij Polyglot!",
    "app_introduction": "Dit is een eenvoudige applicatie om meertalige mogelijkheden te demonstreren met React Hooks.",
    "change_language_label": "Selecteer Taal:"
};

const svTranslations = {
    "welcome_message": "Välkommen till Polyglot!",
    "app_introduction": "Detta är en enkel applikation för att demonstrera flerspråkiga funktioner med React Hooks.",
    "change_language_label": "Välj Språk:"
};

const koTranslations = {
    "welcome_message": "🌍 Polyglot에 오신 것을 환영합니다!",
    "app_introduction": "이것은 React Hooks와 AI 기술을 사용하여 음성 인식, 텍스트 음성 변환 및 고급 번역 기능을 시연하는 차세대 다국어 애플리케이션입니다.",
    "change_language_label": "인터페이스 언어 선택:"
};

const zhTranslations = {
    "welcome_message": "🌍 欢迎来到Polyglot！",
    "app_introduction": "这是一个使用React Hooks和AI技术展示语音识别、文本转语音和高级翻译功能的下一代多语言应用程序。",
    "change_language_label": "选择界面语言："
};

const translations = {
    en: enTranslations,
    es: esTranslations,
    fr: frTranslations,
    hi: hiTranslations,
    ko: koTranslations,
    'zh-Hans': zhTranslations
};

// 1. Create the context
// This context will be used to provide the language state and a function to update it.
export const LanguageContext = createContext();

// 2. Create the Provider component
// This component will wrap your app and manage the language state.
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default language is English
    const [messages, setMessages] = useState(translations.en);

    // useEffect hook to load translations when the language changes.
    // This is a great example of a side effect managed by React.
    useEffect(() => {
        // In a real app, you might fetch these from an API
        // for now, we'll just load them from our mock dictionary
        setMessages(translations[language]);

        // Set the lang attribute on the HTML tag for accessibility
        document.documentElement.lang = language;

    }, [language]); // This effect re-runs whenever the `language` state changes

    const value = {
        language,
        messages,
        setLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};