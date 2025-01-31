// Popup script for AI Email Reply Assistant
// This script will handle the popup UI interactions
// Implementation will be added in Phase 2

document.addEventListener('DOMContentLoaded', function() {
    const toneSelect = document.getElementById('tone-select');
    const replyLengthSelect = document.getElementById('reply-length');
    const userBriefInput = document.getElementById('user-brief');
    const generateButton = document.getElementById('generate-button');
    const statusMessage = document.getElementById('status-message');
    const responseContainer = document.getElementById('response-container');
    const generatedReply = document.getElementById('generated-reply');
    const copyButton = document.getElementById('copy-button');

    // Function to show status message
    function showStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'error', 'success');
        statusMessage.classList.add(isError ? 'error' : 'success');
    }

    // Function to hide status message
    function hideStatus() {
        statusMessage.classList.add('hidden');
    }

    // Function to copy text to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showStatus('Copied to clipboard!');
            setTimeout(hideStatus, 2000);
        } catch (error) {
            showStatus('Failed to copy to clipboard', true);
        }
    }

    // Handle generate button click
    generateButton.addEventListener('click', async function() {
        const selectedTone = toneSelect.value;
        const selectedLength = replyLengthSelect.value;
        const userBrief = userBriefInput.value.trim();
        
        try {
            // Disable button while processing
            generateButton.disabled = true;
            showStatus('Generating reply...');
            responseContainer.classList.add('hidden');

            // Send message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'generateReply',
                tone: selectedTone,
                length: selectedLength,
                brief: userBrief
            });

            if (response.error) {
                showStatus(response.error, true);
            } else {
                // Show the generated reply
                generatedReply.value = response.reply;
                responseContainer.classList.remove('hidden');
                showStatus('Reply generated successfully!');
                setTimeout(hideStatus, 2000);
            }
        } catch (error) {
            showStatus('Failed to generate reply. Please try again.', true);
        } finally {
            // Re-enable button
            generateButton.disabled = false;
        }
    });

    // Handle copy button click
    copyButton.addEventListener('click', function() {
        copyToClipboard(generatedReply.value);
    });

    // Hide status message when changing any input
    toneSelect.addEventListener('change', hideStatus);
    replyLengthSelect.addEventListener('change', hideStatus);
    userBriefInput.addEventListener('input', hideStatus);
}); 