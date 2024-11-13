// Simple in-memory cache implementation
const cache = new Map();

module.exports = {
    async get(key) {
        const item = cache.get(key);
        if (!item) return null;
        
        // Check if item has expired
        if (item.expiry && item.expiry < Date.now()) {
            cache.delete(key);
            return null;
        }
        
        return item.value;
    },
    
    async set(key, value, ttl = 3600) {
        const expiry = ttl ? Date.now() + (ttl * 1000) : null;
        cache.set(key, { value, expiry });
    },
    
    async del(key) {
        cache.delete(key);
    }
}; 