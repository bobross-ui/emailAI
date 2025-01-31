document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('api-key');
    const showKeyButton = document.getElementById('show-key');
    const saveButton = document.getElementById('save-button');
    const statusMessage = document.getElementById('status-message');

    // Load saved API key
    chrome.storage.local.get(['apiKey'], function(result) {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
        }
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

    // Save API key
    saveButton.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', true);
            return;
        }

        try {
            // Validate API key format (basic check)
            if (!apiKey.startsWith('AI') || apiKey.length < 10) {
                showStatus('Invalid API key format', true);
                return;
            }

            // Save API key
            await chrome.storage.local.set({ apiKey });
            showStatus('API key saved successfully');
            
            // Reset input type to password
            apiKeyInput.type = 'password';
            showKeyButton.textContent = 'Show';
        } catch (error) {
            showStatus('Failed to save API key', true);
            console.error('Error saving API key:', error);
        }
    });
}); 