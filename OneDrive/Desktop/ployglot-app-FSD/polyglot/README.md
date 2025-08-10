# 🌍 Polyglot - AI-Powered Translation App

An advanced, interactive translation application with AI voice assistant capabilities, built with React and featuring cutting-edge natural language processing.

## 🚀 Features

### 🤖 **Advanced AI Voice Assistant**
- **Natural Language Understanding**: Speak naturally - "translate this to Spanish" instead of rigid commands
- **Context Awareness**: Remembers conversation history for intelligent responses
- **Smart Intent Recognition**: Understands what you want to do with confidence scoring
- **Multiple Response Variations**: Dynamic, personality-filled responses
- **Smart Suggestions**: Context-aware command recommendations

### 🗣️ **Voice & Speech Features**
- **Speech-to-Text Input**: Voice input with advanced recognition accuracy
- **Text-to-Speech Output**: Hear translations with adjustable rate and pitch
- **Multiple Speech Alternatives**: Processes multiple recognition results for better accuracy
- **Error Handling**: Helpful guidance for microphone and speech issues

### 🌙 **Advanced Dark Mode System**
- **Global Theme Context**: Consistent theming across the entire application
- **Enhanced Visibility**: Light green and purple colors optimized for dark mode
- **Smooth Transitions**: Elegant theme switching with visual feedback
- **Comprehensive Styling**: Every UI element perfectly styled for both themes

### 🔄 **Translation Capabilities**
- **6 Languages Supported**: English, Spanish, French, Chinese, Korean, Hindi
- **LibreTranslate API**: Free, open-source translation service
- **Confidence Scoring**: Visual feedback on translation accuracy
- **Same-Language Detection**: Smart handling of identical source/target languages

### 📱 **User Experience**
- **Responsive Design**: Beautiful interface that works on all devices
- **Translation History**: Persistent storage of your translation sessions
- **Favorites System**: Save and quickly access your most-used translations
- **Visual Feedback**: Loading animations, success sounds, and status indicators

## 🎯 **Natural Voice Commands**

Try these conversational commands with the AI assistant:

- *"Translate this text to Spanish"*
- *"Switch to dark mode please"*
- *"Show me my translation history"*
- *"How do you say hello in French?"*
- *"Clear everything and start over"*
- *"Speak the translation aloud"*
- *"Change the language to Korean"*
- *"What can you help me with?"*

## 🛠️ **Technology Stack**

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom dark mode implementation
- **Voice Processing**: Web Speech API (Speech Recognition & Synthesis)
- **Translation**: LibreTranslate API
- **State Management**: React Context API
- **Storage**: localStorage for persistence
- **Build Tool**: Create React App

## 🏃‍♂️ **Quick Start**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ishaxxxx/polyglot.git
   cd polyglot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 **Usage Guide**

### Basic Translation
1. Select source and target languages from the dropdowns
2. Enter text in the input field or use voice input (🎤 button)
3. Click "Translate" or use the AI assistant
4. View results with confidence scoring
5. Save favorites or hear the translation

### AI Voice Assistant
1. Click the 🤖 button in the bottom-right corner
2. Click "Click & Speak Naturally" and give voice commands
3. The AI understands context and natural language
4. Use suggested commands or speak freely
5. View conversation history with confidence scores

### Theme Switching
- Use the 🌙/☀️ button in the header
- Say "switch to dark mode" or "light mode" to the AI assistant
- Theme preference is automatically saved

## 📂 **Project Structure**

```
src/
├── components/
│   ├── AudioAssistant.js      # AI voice assistant with NLP
│   ├── LanguageSwitcher.js    # Language selection component
│   └── TextTranslator.js      # Main translation interface
├── context/
│   ├── LanguageContext.js     # Language state management
│   └── ThemeContext.js        # Global theme system
├── hooks/
│   └── useLocalization.js     # Custom localization hook
├── pages/
│   └── HomePage.js            # Main application page
├── services/
│   └── translationService.js  # LibreTranslate API integration
└── localization/
    ├── en.json                # English translations
    ├── es.json                # Spanish translations
    └── fr.json                # French translations
```

## 🔧 **Configuration**

### Translation Service
The app uses LibreTranslate API. You can configure the endpoint in `src/services/translationService.js`:

```javascript
const LIBRETRANSLATE_API_URL = 'https://libretranslate.de/translate';
```

### Supported Languages
- English (en)
- Spanish (es)  
- French (fr)
- Chinese Simplified (zh-Hans)
- Korean (ko)
- Hindi (hi)

## 🚀 **Deployment**

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Build the project: `npm run build`
2. Deploy the `build` folder to your preferred hosting service
3. Ensure HTTPS is enabled for voice features to work

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [LibreTranslate](https://libretranslate.com/) for free translation API
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice capabilities
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [React](https://reactjs.org/) for the amazing framework

## 📞 **Support**

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the browser console for error messages
- Ensure microphone permissions are granted for voice features

---

**Made with ❤️ by [Isha](https://github.com/Ishaxxxx)**

*Transform the way you communicate across languages with AI-powered translation!*

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
