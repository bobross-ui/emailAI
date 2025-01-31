# AI Email Reply Assistant - Chrome Extension

A Chrome extension that helps you generate contextual email replies using Google's Gemini AI. The extension allows you to customize the tone and length of your replies while maintaining professionalism and relevance.

## Features

- 🤖 AI-powered email reply generation using Gemini API
- 🎨 Multiple tone options (Casual, Professional, Direct, Formal, Friendly)
- 📏 Customizable reply length (Short, Medium, Long)
- ✍️ Optional brief/gist input for personalized responses
- 📋 One-click copy to clipboard
- 🔒 Secure API key management
- 🎯 Gmail integration

## Installation

1. Clone this repository or download the source code:
```bash
git clone https://github.com/yourusername/email-reply-assistant.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Setup

1. Get your Gemini API Key:
   - Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or select a project
   - Click "Create API Key"
   - Copy your API key

2. Configure the Extension:
   - Click the extension icon in Chrome
   - Right-click and select "Options"
   - Paste your Gemini API key
   - Click "Save Settings"

## Usage

1. Open Gmail in Chrome

2. Select an email you want to reply to

3. Click the extension icon in the toolbar

4. Customize your reply:
   - Select desired tone
   - Choose reply length
   - (Optional) Add specific points you want to include

5. Click "Generate Reply"

6. Once generated:
   - Review the generated reply
   - Click "Copy to Clipboard"
   - Paste into Gmail's reply box

## Features in Detail

### Tone Options
- **Casual**: Friendly and informal
- **Professional**: Business-appropriate and polite
- **Direct**: Clear and straightforward
- **Formal**: Highly professional and structured
- **Friendly**: Warm and approachable

### Length Options
- **Short**: Concise response (2-3 sentences)
- **Medium**: Balanced length (4-6 sentences)
- **Long**: Detailed response (7+ sentences)

### User Brief
- Add specific points or ideas you want to include
- Guide the AI to focus on particular aspects
- Ensure important details are included

## Privacy & Security

- API keys are stored securely using Chrome's storage API
- No email content is stored or transmitted except for API calls
- All communication with Gmail is local to your browser
- API calls are made directly to Google's Gemini API

## Technical Details

- Built with vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Integrates with Gmail's interface
- Communicates with Google's Gemini API
- Uses Chrome's storage and messaging APIs

## Development

### Project Structure
```
email-reply-assistant/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/
│   └── content.js
├── background/
│   └── background.js
├── options/
│   ├── options.html
│   ├── options.css
│   └── options.js
└── constants/
    └── config.js
```

### Local Development
1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Test your changes

## Troubleshooting

Common issues and solutions:

1. **API Key Issues**
   - Verify API key is entered correctly
   - Check API key permissions
   - Ensure key is saved in options

2. **Gmail Integration**
   - Make sure you're on mail.google.com
   - Try refreshing the page
   - Check if email is selected

3. **Generation Failures**
   - Check internet connection
   - Verify API key validity
   - Ensure email content is loaded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Gemini AI for powering the reply generation
- Chrome Extensions documentation
- Gmail's web interface 