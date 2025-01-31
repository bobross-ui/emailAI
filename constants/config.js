const config = {
    VALID_TONES: {
        casual: 'casual',
        professional: 'professional',
        direct: 'direct',
        formal: 'formal',
        friendly: 'friendly'
    },
    
    VALID_LENGTHS: {
        short: 'short',
        medium: 'medium',
        long: 'long'
    }
};

// Make config available globally in the service worker
self.config = config;