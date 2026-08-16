const memoryStorage = new Map();

export const safeStorage = {
    getItem(key) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
        } catch {
            // Sandboxed iframe or security error
        }
        return memoryStorage.get(key) ?? null;
    },
    setItem(key, value) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
                return;
            }
        } catch {
            // Sandboxed iframe or security error
        }
        memoryStorage.set(key, String(value));
    },
    removeItem(key) {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
                return;
            }
        } catch {
            // Sandboxed iframe or security error
        }
        memoryStorage.delete(key);
    },
};
