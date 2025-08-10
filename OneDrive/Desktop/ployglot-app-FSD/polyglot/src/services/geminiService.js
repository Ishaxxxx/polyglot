import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
    constructor() {
        this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        this.genAI = null;
        this.model = null;
        this.initialized = false;

        this.initializeGemini();
    }

    initializeGemini() {
        try {
            console.log('🚀 Initializing Gemini AI...');

            if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
                console.warn('❌ Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file');
                return false;
            }

            console.log('🔑 API key found, initializing Google AI...');
            this.genAI = new GoogleGenerativeAI(this.apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            this.initialized = true;
            console.log('✅ Gemini AI initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Gemini AI:', error);
            return false;
        }
    }

    isAvailable() {
        return this.initialized && this.model !== null;
    }

    async generateResponse(prompt, context = {}) {
        if (!this.isAvailable()) {
            throw new Error('Gemini AI is not available. Please check your API key.');
        }

        try {
            // Enhanced prompt with context
            const enhancedPrompt = this.buildContextualPrompt(prompt, context);

            console.log('🤖 Sending prompt to Gemini:', enhancedPrompt.substring(0, 200) + '...');

            const result = await this.model.generateContent(enhancedPrompt);
            const response = await result.response;
            const text = response.text();

            console.log('✅ Gemini response received:', text);

            return {
                success: true,
                text: text.trim(),
                model: 'gemini-pro'
            };
        } catch (error) {
            console.error('❌ Gemini API error:', error);
            throw new Error(`Gemini API error: ${error.message}`);
        }
    }

    buildContextualPrompt(userInput, context) {
        const {
            intent = null,
            conversationHistory = [],
            translationContext = null,
            userPreferences = {}
        } = context;

        let systemPrompt = `You are an intelligent AI assistant integrated into "Polyglot" - a professional translation web application. 

🎯 YOUR PRIMARY ROLE:
- You are the built-in assistant for this specific translation app
- Help users understand and use app features effectively
- Provide translation-related assistance and language learning tips
- Stay contextually relevant to the translation app experience

🔧 APP CONTEXT & FEATURES:
- App Name: "Polyglot - AI-Powered Translation App"
- Supported Languages: English, Spanish, French, Chinese (Simplified), Korean, Hindi
- Core Features: Voice input/output, Dark/Light themes, Translation history, Favorites system
- Translation Engine: LibreTranslate API (free, open-source)
- Voice Features: Speech-to-text input, text-to-speech output with adjustable settings
- UI Features: Responsive design, confidence scoring, sound effects

📋 RESPONSE GUIDELINES:
1. **App-Focused**: Always relate responses back to the translation app when possible
2. **Contextual Awareness**: Consider the user's current activity in the app
3. **Helpful & Practical**: Provide actionable guidance for using app features
4. **Concise but Complete**: Keep responses under 100 words but informative
5. **Professional Tone**: Friendly, helpful, and encouraging

🎯 HANDLING DIFFERENT QUESTION TYPES:

**App-Related Questions** (Priority responses):
- Feature explanations, usage instructions, troubleshooting
- Translation tips, language learning advice
- Voice commands, navigation help

**General Questions** (Contextual responses):
- If question relates to languages/translation: Connect to app features
- If completely unrelated: Politely redirect to app functionality
- If about technology: Relate to app's tech stack when relevant

**Current Context:**
- User Intent: ${intent || 'general assistance'}
- App Session Active: Yes
${translationContext ? `- Recent Translation: ${JSON.stringify(translationContext)}` : ''}
${conversationHistory.length > 0 ?
                `- Recent Conversation:
${conversationHistory.slice(-3).map(msg => `User: ${msg.user}\nAssistant: ${msg.assistant}`).join('\n')}` : ''}

🎨 RESPONSE EXAMPLES:

For app questions: "To change the theme, click the 🌙/☀️ button in the header, or just tell me 'switch to dark mode'!"

For general language questions: "That's a great language question! In our app, you can explore this by translating between our 6 supported languages..."

For unrelated questions: "While I'd love to chat about that, I'm specifically designed to help with translation features. Try asking me about language translation, voice features, or how to use the app!"

Remember: You're not just any AI - you're the Polyglot app's intelligent assistant, here to make translation seamless and educational!`; return `${systemPrompt}\n\nUser request: ${userInput}\n\nAssistant response:`;
    }

    async handleTranslationRequest(text, sourceLang, targetLang) {
        const prompt = `Help translate "${text}" from ${sourceLang} to ${targetLang}. 
        If the translation seems incorrect or could be improved, provide suggestions. 
        Also give a brief cultural context or usage tip if relevant.
        Keep the response under 80 words.`;

        return await this.generateResponse(prompt, {
            intent: 'translation_help',
            translationContext: { text, sourceLang, targetLang }
        });
    }

    async handleVoiceCommand(command, conversationHistory = []) {
        // Analyze the question type first
        const questionType = this.analyzeQuestionType(command);

        let prompt;

        switch (questionType) {
            case 'app_feature':
                prompt = `User asks about app feature: "${command}". 
                Provide helpful guidance about this Polyglot app feature. 
                Be specific about how to use it and any tips for better experience.`;
                break;

            case 'translation_help':
                prompt = `User needs translation help: "${command}". 
                Guide them on how to use our translation features effectively. 
                Include tips about the 6 supported languages and voice features.`;
                break;

            case 'language_learning':
                prompt = `User asks about language learning: "${command}". 
                Connect your response to how they can practice using our app's features. 
                Mention translation practice, voice pronunciation features, and favorites system.`;
                break;

            case 'general_relevant':
                prompt = `User asks: "${command}". 
                This relates to languages/technology. Connect your answer to our translation app features when possible. 
                Stay helpful but guide towards app functionality.`;
                break;

            case 'off_topic':
                prompt = `User asks: "${command}". 
                This seems unrelated to translation. Politely redirect to app features while being friendly. 
                Suggest translation-related alternatives they might be interested in.`;
                break;

            default:
                prompt = `User says: "${command}". 
                Interpret their intent and provide helpful guidance about using the Polyglot translation app.`;
        }

        return await this.generateResponse(prompt, {
            intent: 'voice_command',
            conversationHistory,
            questionType
        });
    }

    analyzeQuestionType(command) {
        const lowerCommand = command.toLowerCase();

        // App feature related
        if (lowerCommand.includes('dark mode') || lowerCommand.includes('light mode') ||
            lowerCommand.includes('theme') || lowerCommand.includes('voice') ||
            lowerCommand.includes('history') || lowerCommand.includes('favorite') ||
            lowerCommand.includes('clear') || lowerCommand.includes('settings') ||
            lowerCommand.includes('how to use') || lowerCommand.includes('feature')) {
            return 'app_feature';
        }

        // Translation help
        if (lowerCommand.includes('translate') || lowerCommand.includes('translation') ||
            lowerCommand.includes('language') || lowerCommand.includes('spanish') ||
            lowerCommand.includes('french') || lowerCommand.includes('chinese') ||
            lowerCommand.includes('korean') || lowerCommand.includes('hindi') ||
            lowerCommand.includes('english') || lowerCommand.includes('how do you say')) {
            return 'translation_help';
        }

        // Language learning
        if (lowerCommand.includes('learn') || lowerCommand.includes('practice') ||
            lowerCommand.includes('pronunciation') || lowerCommand.includes('grammar') ||
            lowerCommand.includes('vocabulary') || lowerCommand.includes('fluent')) {
            return 'language_learning';
        }

        // General relevant (tech, communication, etc.)
        if (lowerCommand.includes('communication') || lowerCommand.includes('technology') ||
            lowerCommand.includes('api') || lowerCommand.includes('speech') ||
            lowerCommand.includes('ai') || lowerCommand.includes('gemini')) {
            return 'general_relevant';
        }

        // Check if completely unrelated
        const unrelatedKeywords = ['weather', 'food', 'sports', 'movie', 'music', 'game',
            'politics', 'shopping', 'travel', 'recipe', 'news'];
        if (unrelatedKeywords.some(keyword => lowerCommand.includes(keyword))) {
            return 'off_topic';
        }

        return 'general';
    }

    async explainFeature(feature) {
        const prompt = `Explain the "${feature}" feature of our translation app in a helpful, concise way. 
        Make it sound exciting and easy to use. Under 60 words.`;

        return await this.generateResponse(prompt, {
            intent: 'feature_explanation'
        });
    }

    async generateSmartSuggestions(context) {
        const prompt = `Based on the user's activity in our translation app, suggest 3-4 helpful voice commands they might want to try. 
        Keep suggestions natural and practical. Format as a simple list.`;

        return await this.generateResponse(prompt, {
            intent: 'smart_suggestions',
            conversationHistory: context.conversationHistory || []
        });
    }

    async getAppHelp(topic = 'general') {
        const prompt = `Explain the "${topic}" aspect of our Polyglot translation app. 
        Be comprehensive but concise. Focus on practical usage and benefits.`;

        return await this.generateResponse(prompt, {
            intent: 'app_help'
        });
    }

    async handleContextualQuestion(question, appState = {}) {
        const {
            currentPage = 'translation',
            recentTranslations = [],
            userActivity = {},
            theme = 'light'
        } = appState;

        const prompt = `User asks: "${question}"
        
        Current app context:
        - Page: ${currentPage}
        - Theme: ${theme}
        - Recent activity: ${userActivity.lastAction || 'translation'}
        ${recentTranslations.length > 0 ? `- Recent translations: ${recentTranslations.slice(0, 2).map(t => `${t.from} → ${t.to}`).join(', ')}` : ''}
        
        Provide a contextual response that considers their current app state and guides them appropriately.`;

        return await this.generateResponse(prompt, {
            intent: 'contextual_help',
            appState
        });
    }
}

// Create singleton instance
const geminiService = new GeminiService();

export default geminiService;
