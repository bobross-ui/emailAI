// Content script for AI Email Reply Assistant
// This script will be responsible for interacting with Gmail's interface
// Implementation will be added in Phase 3 

// Function to extract email content from Gmail
function extractEmailContent() {
    try {
        // Try multiple possible selectors for subject
        const subjectSelectors = [
            'h2[data-thread-perm-id]',
            '.hP',  // Another common Gmail subject selector
            '[data-legacy-thread-id] h2'
        ];

        let subject = '';
        for (const selector of subjectSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                subject = element.textContent.trim();
                break;
            }
        }

        // Try multiple possible selectors for body
        const bodySelectors = [
            '.a3s.aiL',
            '.a3s.aiL .ii.gt',
            '.h7',
            '[data-message-id] .ii.gt'
        ];

        let body = '';
        for (const selector of bodySelectors) {
            const element = document.querySelector(selector);
            if (element) {
                body = element.textContent.trim();
                break;
            }
        }

        if (!subject && !body) {
            throw new Error('No email content found');
        }

        return {
            subject,
            body
        };
    } catch (error) {
        throw error;
    }
}

// Function to click the reply button if not already in compose mode
async function openReplyBox() {
    // Look for the reply button
    const replyButton = document.querySelector('[aria-label="Reply"]');
    if (replyButton) {
        replyButton.click();
        // Wait for the compose box to appear
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
    return false;
}

// Function to inject reply into Gmail compose box
async function injectReply(reply) {
    try {
        // First, try to find an existing compose box
        let composeBox = document.querySelector('[role="textbox"][aria-label="Message Body"]');
        
        // If no compose box is found, try to open the reply box
        if (!composeBox) {
            const opened = await openReplyBox();
            if (!opened) {
                throw new Error('Could not find or open reply box');
            }
            // Try to find the compose box again
            composeBox = document.querySelector('[role="textbox"][aria-label="Message Body"]');
        }

        if (!composeBox) {
            throw new Error('Could not find compose box');
        }

        // Focus the compose box
        composeBox.focus();

        // Clear existing content if any
        composeBox.innerHTML = '';

        // Insert the reply
        // We use execCommand to support undo/redo
        document.execCommand('insertText', false, reply);

        return { success: true };
    } catch (error) {
        console.error('Error injecting reply:', error);
        return {
            success: false,
            error: error.message || 'Failed to inject reply'
        };
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractContent') {
        try {
            const emailContent = extractEmailContent();
            sendResponse({ success: true, data: emailContent });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    } else if (message.action === 'insertReply') {
        // Insert the generated reply
        injectReply(message.reply).then(sendResponse);
    }
    return true;
});

// Log when content script is loaded
console.log('AI Email Reply Assistant: Content script loaded'); 