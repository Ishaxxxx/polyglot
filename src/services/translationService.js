// LibreTranslate Translation Service
// 100% Free, Open Source, No API Key Required

// API URL - using alternative LibreTranslate instance
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

// Fallback API URLs in case primary fails
const FALLBACK_APIS = [
    'https://libretranslate.de/translate',
    'https://translate.terraprint.co/translate',
    'https://libretranslate.pussthecat.org/translate'
];

// Language code mapping - LibreTranslate supported languages only
const LANGUAGE_CODES = {
    en: 'en',         // English
    hi: 'hi',         // Hindi
    es: 'es',         // Spanish
    fr: 'fr',         // French
    ko: 'ko',         // Korean
    'zh-Hans': 'zh-Hans', // Chinese Simplified
    'zh-Hant': 'zh-Hant', // Chinese Traditional
    ar: 'ar',         // Arabic
    az: 'az',         // Azerbaijani
    cs: 'cs',         // Czech
    nl: 'nl',         // Dutch
    eo: 'eo',         // Esperanto
    fi: 'fi',         // Finnish
    de: 'de',         // German
    el: 'el',         // Greek
    he: 'he',         // Hebrew
    hu: 'hu',         // Hungarian
    id: 'id',         // Indonesian
    ga: 'ga',         // Irish
    it: 'it',         // Italian
    ja: 'ja',         // Japanese
    fa: 'fa',         // Persian
    pl: 'pl',         // Polish
    pt: 'pt',         // Portuguese
    ru: 'ru',         // Russian
    sk: 'sk',         // Slovak
    sv: 'sv',         // Swedish
    tr: 'tr',         // Turkish
    uk: 'uk'          // Ukrainian
};

// LibreTranslate API with fallback support
export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
    // List of APIs to try
    const apisToTry = [LIBRETRANSLATE_API, ...FALLBACK_APIS];

    // First try LibreTranslate instances
    for (let i = 0; i < apisToTry.length; i++) {
        const apiUrl = apisToTry[i];

        try {
            console.log(`🌟 Trying LibreTranslate API ${i + 1}...`);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLanguage === 'auto' ? 'auto' : LANGUAGE_CODES[sourceLanguage] || sourceLanguage,
                    target: LANGUAGE_CODES[targetLanguage] || targetLanguage,
                    format: 'text'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.translatedText) {
                console.log(`✅ LibreTranslate Translation successful (API ${i + 1})`);
                return data.translatedText;
            } else {
                throw new Error('No translated text in response');
            }
        } catch (error) {
            console.error(`❌ LibreTranslate API ${i + 1} failed:`, error.message);
            continue;
        }
    }

    // If all LibreTranslate instances fail, try MyMemory as last resort
    try {
        console.log('🔄 All LibreTranslate APIs failed, trying MyMemory...');
        return await translateWithMyMemory(text, targetLanguage, sourceLanguage);
    } catch (error) {
        console.error('❌ MyMemory also failed:', error.message);

        // Final fallback - return original text with warning
        console.error('🚨 All translation services failed, returning original text');
        return text;
    }
};

// Batch translation for multiple texts
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'auto') => {
    const translations = await Promise.all(
        texts.map(text => translateText(text, targetLanguage, sourceLanguage))
    );
    return translations;
};

// Test function to check API connectivity
export const testLibreTranslate = async () => {
    try {
        const testResult = await translateText('Hello', 'es', 'en');
        console.log('Test translation result:', testResult);
        return testResult !== 'Hello'; // Should return 'Hola' or similar
    } catch (error) {
        console.error('Test failed:', error);
        return false;
    }
};

// Alternative translation using MyMemory as backup
export const translateWithMyMemory = async (text, targetLanguage, sourceLanguage = 'en') => {
    try {
        console.log('🔄 Trying MyMemory API as backup...');
        const langPair = `${sourceLanguage}|${targetLanguage}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData.translatedText) {
            console.log('✅ MyMemory translation successful');
            return data.responseData.translatedText;
        }

        throw new Error('MyMemory API failed');
    } catch (error) {
        console.error('MyMemory error:', error);
        throw error;
    }
};
