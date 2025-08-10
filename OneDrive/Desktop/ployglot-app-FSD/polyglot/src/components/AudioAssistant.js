import React, { useState, useEffect, useRef, useCallback } from 'react';

const AudioAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [conversationContext, setConversationContext] = useState([]);
    const recognitionRef = useRef(null);

    // Enhanced command patterns with natural language understanding
    const [commandPatterns] = useState({
        translation: {
            patterns: ['translate', 'convert', 'change language', 'transform', 'turn into', 'how do you say'],
            variations: ['translate this', 'convert to', 'what is this in', 'how to say', 'change to'],
            responses: [
                "I'll help you translate that text. Please enter your text in the input field above.",
                "Ready to translate! Just type or speak your text and I'll handle the rest.",
                "Let's translate something! Enter your text and choose your target language."
            ]
        },
        clear: {
            patterns: ['clear', 'reset', 'clean', 'empty', 'start over', 'delete'],
            variations: ['clear everything', 'reset fields', 'start fresh', 'clean up'],
            responses: [
                "Fields cleared! Ready for new translations.",
                "All cleared! What would you like to translate next?",
                "Fresh start! The translation fields are now empty."
            ]
        },
        theme: {
            patterns: ['dark mode', 'light mode', 'switch theme', 'change theme', 'toggle theme'],
            variations: ['make it dark', 'turn on dark mode', 'switch to light', 'bright mode'],
            responses: {
                dark: ["Switching to dark mode for better nighttime use!", "Dark mode activated! Easy on the eyes.", "Going dark! Hope you like the new look."],
                light: ["Switching to light mode for brighter viewing!", "Light mode activated! Clear and bright.", "Going bright! Perfect for daytime use."]
            }
        },
        help: {
            patterns: ['help', 'what can you do', 'commands', 'how to use', 'guide', 'instructions'],
            variations: ['show me commands', 'what are your features', 'how does this work'],
            responses: [
                "I'm your smart translation assistant! I can translate text, switch themes, clear fields, show history, manage favorites, and much more. Try natural commands like 'translate this to Spanish' or 'show my history'.",
                "I understand natural language! You can say things like 'change to dark mode', 'clear everything', 'translate to French', or 'show my favorites'. Just speak naturally!",
                "I'm here to make translation easier! I can help with translations, manage your favorites, show history, switch themes, and understand context. Try speaking to me naturally!"
            ]
        },
        history: {
            patterns: ['history', 'show history', 'past translations', 'previous', 'what did I translate'],
            variations: ['my translations', 'translation history', 'show past work'],
            responses: [
                "Here's your translation history! I'll open it for you.",
                "Loading your previous translations right now!",
                "Your translation history is coming up!"
            ]
        },
        favorites: {
            patterns: ['favorites', 'saved', 'bookmarks', 'starred', 'saved translations'],
            variations: ['my favorites', 'show saved', 'bookmarked translations'],
            responses: [
                "Here are your favorite translations!",
                "Loading your saved translations now!",
                "Your bookmarked translations are ready to view!"
            ]
        },
        languages: {
            patterns: ['english', 'spanish', 'french', 'chinese', 'korean', 'hindi', 'language'],
            variations: ['switch to english', 'change to spanish', 'set language'],
            responses: [
                "I can help you translate to and from English, Spanish, French, Chinese, Korean, and Hindi!",
                "Language detected! I'll help you work with that language.",
                "I support multiple languages for your translation needs!"
            ]
        },
        voice: {
            patterns: ['speak', 'read aloud', 'say it', 'voice', 'audio', 'pronunciation'],
            variations: ['how does it sound', 'pronounce this', 'read the translation'],
            responses: [
                "I'll read the translation aloud for you!",
                "Let me speak that translation for you!",
                "Playing the audio pronunciation now!"
            ]
        }
    });

    const speak = useCallback((text, rate = 1, pitch = 1) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = 0.8;

            // Add personality to responses
            if (text.includes('!')) {
                utterance.rate = 1.1;
                utterance.pitch = 1.2;
            }

            speechSynthesis.speak(utterance);
        }
    }, []);

    // Advanced natural language understanding
    const analyzeCommand = useCallback((command) => {
        const lowerCommand = command.toLowerCase().trim();

        // Extract intent and entities
        const analysis = {
            intent: null,
            entities: [],
            confidence: 0,
            context: null
        };

        // Language detection
        const languages = {
            'english': 'en', 'spanish': 'es', 'french': 'fr',
            'chinese': 'zh-Hans', 'korean': 'ko', 'hindi': 'hi'
        };

        Object.entries(languages).forEach(([lang, code]) => {
            if (lowerCommand.includes(lang)) {
                analysis.entities.push({ type: 'language', value: code, name: lang });
            }
        });

        // Intent classification with confidence scoring
        Object.entries(commandPatterns).forEach(([intent, data]) => {
            const allPatterns = [...data.patterns, ...data.variations];
            let maxScore = 0;

            allPatterns.forEach(pattern => {
                if (lowerCommand.includes(pattern)) {
                    const score = pattern.length / lowerCommand.length;
                    maxScore = Math.max(maxScore, score);
                }
            });

            if (maxScore > analysis.confidence) {
                analysis.intent = intent;
                analysis.confidence = maxScore;
            }
        });

        return analysis;
    }, [commandPatterns]);

    // Enhanced response generation with context awareness
    const generateResponse = useCallback((analysis, command) => {
        const { intent, entities, confidence } = analysis;

        if (confidence < 0.1) {
            return {
                text: `I heard "${command}" but I'm not quite sure what you'd like me to do. Try saying something like "translate this to Spanish", "switch to dark mode", or "show my history". You can also say "help" for more options!`,
                action: null
            };
        }

        let response = { text: '', action: null };

        switch (intent) {
            case 'translation':
                const langEntity = entities.find(e => e.type === 'language');
                if (langEntity) {
                    response.text = `I'll help you translate to ${langEntity.name}! Please enter your text above and I'll translate it for you.`;
                    response.action = { type: 'setTargetLanguage', value: langEntity.value };
                } else {
                    const responses = commandPatterns.translation.responses;
                    response.text = responses[Math.floor(Math.random() * responses.length)];
                }
                break;

            case 'clear':
                const responses = commandPatterns.clear.responses;
                response.text = responses[Math.floor(Math.random() * responses.length)];
                response.action = { type: 'clear' };
                break;

            case 'theme':
                if (command.includes('dark')) {
                    const darkResponses = commandPatterns.theme.responses.dark;
                    response.text = darkResponses[Math.floor(Math.random() * darkResponses.length)];
                    response.action = { type: 'theme', value: 'dark' };
                } else if (command.includes('light')) {
                    const lightResponses = commandPatterns.theme.responses.light;
                    response.text = lightResponses[Math.floor(Math.random() * lightResponses.length)];
                    response.action = { type: 'theme', value: 'light' };
                } else {
                    response.text = "Would you like dark mode or light mode?";
                }
                break;

            case 'help':
                const helpResponses = commandPatterns.help.responses;
                response.text = helpResponses[Math.floor(Math.random() * helpResponses.length)];
                break;

            case 'history':
                const historyResponses = commandPatterns.history.responses;
                response.text = historyResponses[Math.floor(Math.random() * historyResponses.length)];
                response.action = { type: 'history' };
                break;

            case 'favorites':
                const favResponses = commandPatterns.favorites.responses;
                response.text = favResponses[Math.floor(Math.random() * favResponses.length)];
                response.action = { type: 'favorites' };
                break;

            case 'voice':
                const voiceResponses = commandPatterns.voice.responses;
                response.text = voiceResponses[Math.floor(Math.random() * voiceResponses.length)];
                response.action = { type: 'speak' };
                break;

            case 'languages':
                response.text = "I can translate between English, Spanish, French, Chinese, Korean, and Hindi. Which languages would you like to work with?";
                break;

            default:
                response.text = `I understood you want help with ${intent}, but I need a bit more information. Try being more specific!`;
        }

        return response;
    }, [commandPatterns]);

    const handleVoiceCommand = useCallback((command) => {
        setIsTyping(true);

        // Add to conversation context
        setConversationContext(prev => [...prev.slice(-4), { user: command, timestamp: Date.now() }]);

        // Analyze the command using NLP
        const analysis = analyzeCommand(command);
        const response = generateResponse(analysis, command);

        const newMessage = {
            id: Date.now(),
            user: command,
            assistant: response.text,
            timestamp: new Date().toLocaleTimeString(),
            confidence: analysis.confidence,
            intent: analysis.intent
        };

        // Execute action if any
        if (response.action) {
            switch (response.action.type) {
                case 'clear':
                    window.dispatchEvent(new CustomEvent('assistant-clear'));
                    break;
                case 'theme':
                    window.dispatchEvent(new CustomEvent('assistant-theme', { detail: response.action.value }));
                    break;
                case 'history':
                    window.dispatchEvent(new CustomEvent('assistant-history'));
                    break;
                case 'favorites':
                    window.dispatchEvent(new CustomEvent('assistant-favorites'));
                    break;
                case 'speak':
                    window.dispatchEvent(new CustomEvent('assistant-speak'));
                    break;
                case 'setTargetLanguage':
                    window.dispatchEvent(new CustomEvent('assistant-setLanguage', { detail: response.action.value }));
                    break;
            }
        }

        setTimeout(() => {
            setMessages(prev => [newMessage, ...prev.slice(0, 4)]);
            setIsTyping(false);
            speak(response.text);
        }, 500);
    }, [analyzeCommand, generateResponse, speak]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            // Enhanced speech recognition settings
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.maxAlternatives = 3;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event) => {
                const results = event.results;
                let finalTranscript = '';

                // Get the most confident result
                for (let i = 0; i < results.length; i++) {
                    if (results[i].isFinal) {
                        const alternatives = Array.from(results[i]);
                        // Choose the alternative with highest confidence
                        const bestResult = alternatives.reduce((best, current) =>
                            current.confidence > best.confidence ? current : best
                        );
                        finalTranscript = bestResult.transcript;
                    }
                }

                if (finalTranscript) {
                    handleVoiceCommand(finalTranscript);
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                setIsListening(false);
                console.error('Speech recognition error:', event.error);

                // Provide helpful error messages
                let errorMessage = "Sorry, I couldn't hear you clearly. ";
                switch (event.error) {
                    case 'no-speech':
                        errorMessage += "I didn't detect any speech. Please try again.";
                        break;
                    case 'audio-capture':
                        errorMessage += "Please check your microphone and try again.";
                        break;
                    case 'not-allowed':
                        errorMessage += "Please allow microphone access to use voice commands.";
                        break;
                    default:
                        errorMessage += "Please try speaking again.";
                }

                speak(errorMessage);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [handleVoiceCommand, speak]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    };

    const toggleAssistant = () => {
        setIsActive(!isActive);
        if (!isActive) {
            const greetings = [
                "Hello! I'm your AI translation assistant. I understand natural language - just speak to me normally!",
                "Hi there! I'm here to help with translations. Try saying something like 'translate this to Spanish'!",
                "Welcome! I can help you translate, manage favorites, change themes, and much more. Just talk to me naturally!"
            ];
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            speak(greeting);
        }
    };

    // Smart command suggestions based on context
    const getSmartSuggestions = () => {
        const baseCommands = ['translate to Spanish', 'show history', 'dark mode', 'help'];

        // Add contextual suggestions based on conversation
        if (conversationContext.length > 0) {
            const lastCommand = conversationContext[conversationContext.length - 1];
            if (lastCommand.user.includes('translate')) {
                baseCommands.unshift('speak translation');
            }
        }

        return baseCommands.slice(0, 4);
    };

    return (
        <div className="fixed bottom-20 right-8 z-50">
            {/* Enhanced Assistant Panel */}
            {isActive && (
                <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[500px] overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">🤖 AI Assistant</h3>
                                <p className="text-sm opacity-90">Natural language translation helper</p>
                            </div>
                            <div className="text-right text-xs opacity-75">
                                {conversationContext.length > 0 && (
                                    <div>Context: {conversationContext.length} interactions</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Smart Suggestions */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                        <div className="text-xs text-gray-600 mb-2 font-medium">💡 Try saying naturally:</div>
                        <div className="grid grid-cols-2 gap-1">
                            {getSmartSuggestions().map((cmd, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleVoiceCommand(cmd)}
                                    className="px-2 py-1 bg-white border border-purple-200 text-purple-700 rounded text-xs hover:bg-purple-50 transition-colors"
                                >
                                    "{cmd}"
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Messages with Typing Indicator */}
                    <div className="max-h-60 overflow-y-auto p-3 space-y-3">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm py-4">
                                <div className="mb-2">🎯 I understand natural language!</div>
                                <div className="text-xs">Try: "Translate this to Spanish" or "Switch to dark mode"</div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="space-y-2">
                                    <div className="text-right">
                                        <div className="inline-block bg-blue-500 text-white p-3 rounded-lg text-sm max-w-xs shadow-md">
                                            {msg.user}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                                            {msg.timestamp}
                                            {msg.confidence && (
                                                <span className="ml-2 px-1 bg-gray-200 rounded text-xs">
                                                    {Math.round(msg.confidence * 100)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="inline-block bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 p-3 rounded-lg text-sm max-w-xs shadow-md">
                                            {msg.assistant}
                                        </div>
                                        {msg.intent && (
                                            <div className="text-xs text-purple-600 mt-1">
                                                Intent: {msg.intent}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {isTyping && (
                            <div className="text-left">
                                <div className="inline-block bg-gray-100 text-gray-600 p-3 rounded-lg text-sm">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <span className="ml-2 text-xs">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Voice Input */}
                    <div className="p-3 border-t bg-gradient-to-r from-gray-50 to-purple-50">
                        <button
                            onClick={startListening}
                            disabled={isListening}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${isListening
                                ? 'bg-red-500 text-white animate-pulse shadow-lg'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                                }`}
                        >
                            <span className="text-lg">
                                {isListening ? '🎤' : '🗣️'}
                            </span>
                            <span>
                                {isListening ? 'Listening... Speak naturally!' : 'Click & Speak Naturally'}
                            </span>
                        </button>

                        {/* Quick Actions */}
                        <div className="flex justify-center mt-2 space-x-2">
                            <button
                                onClick={() => handleVoiceCommand('help')}
                                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Help
                            </button>
                            <button
                                onClick={() => setMessages([])}
                                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Clear Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Assistant Toggle Button */}
            <button
                onClick={toggleAssistant}
                className={`w-16 h-16 rounded-full shadow-2xl text-2xl font-bold transition-all duration-300 transform hover:scale-110 relative ${isActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    }`}
                aria-label={isActive ? 'Close AI assistant' : 'Open AI voice assistant'}
            >
                {isActive ? '✕' : '🤖'}

                {/* Activity indicator */}
                {isListening && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                )}

                {/* New feature badge */}
                {!isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-black rounded-full text-xs flex items-center justify-center font-bold">
                        AI
                    </div>
                )}
            </button>
        </div>
    );
};

export default AudioAssistant;
