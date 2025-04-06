// Background service worker for AI Email Reply Assistant
// This script will handle API calls and communication between components
// Implementation will be added in Phase 4 

// Import constants
importScripts('../constants/config.js');


// Function to generate email reply using Gemini API
async function generateReplyWithGemini(emailContent, tone, length, brief) {
    try {
        // Get API key and URL from storage
        const result = await chrome.storage.local.get(['apiKey', 'apiUrl']);
        const apiKey = result.apiKey;
        const apiUrl = result.apiUrl; // Default will be handled by options page

        if (!apiKey) {
            throw new Error('Please set your API key in the extension options');
        }
        if (!apiUrl) {
            throw new Error('API URL not set. Please configure it in the extension options.');
        }

        // Construct the prompt
        let promptText = `Generate a ${tone} tone reply with ${length} length to this email:

Subject: ${emailContent.data.subject}
Message: ${emailContent.data.body}

The email reply should be:
- In a ${tone} tone
- ${length.charAt(0).toUpperCase() + length.slice(1)} in length
- Relevant to the email content
- In the style of an email reply`;

        // Add user's brief if provided
        if (brief) {
            promptText += `\n\nThe user wants to convey this:
${brief}`;
        }

        const prompt = {
            contents: [{
                parts: [{
                    text: promptText
                }]
            }]
        };

        // Call Gemini API using stored URL
        const fetchUrl = `${apiUrl}?key=${apiKey}`;
        console.log(`Calling Gemini API: ${fetchUrl}`); // Log the URL being called
        
        const response = await fetch(
            fetchUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prompt)
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to generate reply');
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        return { success: true, reply: generatedText };
    } catch (error) {
        console.error('Error generating reply:', error);
        return { success: false, error: error.message };
    }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateReply') {
        handleGenerateReply(request.tone, request.length, request.brief, sendResponse);
        return true; // Required for async response
    }
    if (request.action === 'extractContent') {
        const content = extractEmailContent();
        sendResponse(content);
    }
    return true; // Required to indicate that sendResponse will be called asynchronously
});

// Function to validate inputs
function validateInputs(tone, length, brief) {
    if (!self.config.VALID_TONES[tone]) {
        throw new Error('Invalid tone selected');
    }
    
    if (!self.config.VALID_LENGTHS[length]) {
        throw new Error('Invalid length selected');
    }

    // Sanitize and validate brief
    if (brief) {
        // Remove any HTML tags and limit length
        brief = brief.replace(/<[^>]*>/g, '').trim();
        if (brief.length > 500) { // Limit brief to 500 characters
            throw new Error('Brief is too long');
        }
    }

    return {
        tone,
        length,
        brief
    };
}

// Function to handle reply generation
async function handleGenerateReply(tone, length, brief, sendResponse) {
    try {
        // Validate inputs first
        const validatedInputs = validateInputs(tone, length, brief);
        
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            throw new Error('No active tab found');
        }

        // Check if we're on Gmail
        if (!tab.url.includes('mail.google.com')) {
            throw new Error('Please open Gmail to use this extension');
        }

        console.log(`Attempting to send 'extractContent' message to tab ID: ${tab.id}, URL: ${tab.url}`);
        const content = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
        console.log('Received response from content script:', content);
        
        if (!content.success) {
            throw new Error(content.error || 'Failed to extract email content');
        }

        // Use validated inputs
        const result = await generateReplyWithGemini(content, validatedInputs.tone, validatedInputs.length, validatedInputs.brief);
        
        if (!result.success) {
            throw new Error(result.error);
        }

        // Send the generated reply back to the popup
        sendResponse({ success: true, reply: result.reply });

    } catch (error) {
        console.error('Error in handleGenerateReply:', error);
        sendResponse({ 
            error: error.message || 'Failed to generate reply'
        });
    }
}

// console.log('Content script loaded, waiting for messages'); // Removed confusing log 