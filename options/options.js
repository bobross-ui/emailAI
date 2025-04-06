document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('api-key');
    const apiUrlInput = document.getElementById('api-url');
    const showKeyButton = document.getElementById('show-key');
    const saveButton = document.getElementById('save-button');
    const statusMessage = document.getElementById('status-message');
    const defaultApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // Load saved settings
    chrome.storage.local.get(['apiKey', 'apiUrl'], function(result) {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
        }
        apiUrlInput.value = result.apiUrl || defaultApiUrl;
    });

    // Function to show status message
    function showStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'error', 'success');
        statusMessage.classList.add(isError ? 'error' : 'success');
        
        // Hide status after 3 seconds
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 3000);
    }

    // Toggle API key visibility
    showKeyButton.addEventListener('click', function() {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            showKeyButton.textContent = 'Hide';
        } else {
            apiKeyInput.type = 'password';
            showKeyButton.textContent = 'Show';
        }
    });

    // Save settings
    saveButton.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        const apiUrl = apiUrlInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', true);
            return;
        }
        if (!apiUrl) {
            showStatus('Please enter an API URL', true);
            return;
        }

        try {
            // Validate API key format (basic check)
            if (!apiKey.startsWith('AI') || apiKey.length < 10) {
                showStatus('Invalid API key format', true);
                return;
            }

            // Validate API URL format (basic check)
            if (!apiUrl.startsWith('https://')) {
                 showStatus('Invalid API URL format (must start with https://)', true);
                 return;
            }

            // Save settings
            await chrome.storage.local.set({ apiKey, apiUrl });
            showStatus('Settings saved successfully');
            
            // Reset input type to password
            apiKeyInput.type = 'password';
            showKeyButton.textContent = 'Show';
        } catch (error) {
            showStatus('Failed to save settings', true);
            console.error('Error saving settings:', error);
        }
    });
}); 