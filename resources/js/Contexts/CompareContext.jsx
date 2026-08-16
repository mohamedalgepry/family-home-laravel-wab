import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeStorage } from '../Utils/storage';

const COMPARE_KEY_PREFIX = 'family_home_compare_list_';
const MAX_COMPARE_ITEMS = 4;

function getCompareKey(type) {
    return `${COMPARE_KEY_PREFIX}${type}`;
}

function getStoredCompareList(type) {
    if (typeof window === 'undefined') return [];
    try {
        const key = getCompareKey(type);
        let stored = safeStorage.getItem(key);
        if (!stored && type === 'unit') {
            const legacy = safeStorage.getItem('family_home_compare_list');
            if (legacy) {
                safeStorage.setItem(key, legacy);
                safeStorage.removeItem('family_home_compare_list');
                stored = legacy;
            }
        }
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
    const [lists, setLists] = useState({});

    const syncType = useCallback((type) => {
        setLists((prev) => ({ ...prev, [type]: getStoredCompareList(type) }));
    }, []);

    useEffect(() => {
        const handleSync = (e) => {
            const type = e.detail?.type;
            if (type) syncType(type);
        };
        const handleStorage = (e) => {
            if (!e.key || !e.key.startsWith(COMPARE_KEY_PREFIX)) return;
            const type = e.key.slice(COMPARE_KEY_PREFIX.length);
            syncType(type);
        };

        window.addEventListener('compareListUpdated', handleSync);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('compareListUpdated', handleSync);
            window.removeEventListener('storage', handleStorage);
        };
    }, [syncType]);

    const toggleCompare = useCallback((type, id) => {
        const currentList = getStoredCompareList(type);
        let newList;
        if (currentList.includes(id)) {
            newList = currentList.filter((item) => item !== id);
        } else {
            if (currentList.length >= MAX_COMPARE_ITEMS) return false;
            newList = [...currentList, id];
        }
        safeStorage.setItem(getCompareKey(type), JSON.stringify(newList));
        setLists((prev) => ({ ...prev, [type]: newList }));
        if (typeof window !== 'undefined') {
            try {
                window.dispatchEvent(new CustomEvent('compareListUpdated', { detail: { type } }));
            } catch {
                // ignore
            }
        }
        return true;
    }, []);

    const clearCompare = useCallback((type) => {
        safeStorage.removeItem(getCompareKey(type));
        setLists((prev) => ({ ...prev, [type]: [] }));
        if (typeof window !== 'undefined') {
            try {
                window.dispatchEvent(new CustomEvent('compareListUpdated', { detail: { type } }));
            } catch {
                // ignore
            }
        }
    }, []);

    const getList = useCallback(
        (type) => lists[type] ?? getStoredCompareList(type),
        [lists]
    );

    return (
        <CompareContext.Provider value={{ getList, toggleCompare, clearCompare, maxItems: MAX_COMPARE_ITEMS }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare(type = 'unit') {
    const ctx = useContext(CompareContext);
    if (!ctx) {
        throw new Error('useCompare must be used within a CompareProvider');
    }

    return {
        compareList: ctx.getList(type),
        toggleCompare: (id) => ctx.toggleCompare(type, id),
        clearCompare: () => ctx.clearCompare(type),
        maxItems: ctx.maxItems,
    };
}
