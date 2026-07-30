import { useState, useEffect } from 'react';

const COMPARE_KEY_PREFIX = 'family_home_compare_list_';
const MAX_COMPARE_ITEMS = 4;

function getCompareKey(type = 'unit') {
    return `${COMPARE_KEY_PREFIX}${type}`;
}

function getStoredCompareList(type = 'unit') {
    if (typeof window === 'undefined') return [];
    try {
        const key = getCompareKey(type);
        let stored = localStorage.getItem(key);
        // Migrate legacy compare list to unit type if present
        if (!stored && type === 'unit') {
            const legacy = localStorage.getItem('family_home_compare_list');
            if (legacy) {
                localStorage.setItem(key, legacy);
                localStorage.removeItem('family_home_compare_list');
                stored = legacy;
            }
        }
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse compare list', e);
        return [];
    }
}

export function useCompare(type = 'unit') {
    const [compareList, setCompareList] = useState(() => getStoredCompareList(type));

    useEffect(() => {
        setCompareList(getStoredCompareList(type));

        const handleSync = (e) => {
            if (!e.detail || e.detail.type === type) {
                setCompareList(getStoredCompareList(type));
            }
        };

        window.addEventListener('compareListUpdated', handleSync);
        
        const handleStorage = (e) => {
            if (e.key === getCompareKey(type)) {
                setCompareList(getStoredCompareList(type));
            }
        };
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('compareListUpdated', handleSync);
            window.removeEventListener('storage', handleStorage);
        };
    }, [type]);

    const toggleCompare = (id) => {
        const currentList = getStoredCompareList(type);
        let newList;

        if (currentList.includes(id)) {
            newList = currentList.filter(item => item !== id);
        } else {
            if (currentList.length >= MAX_COMPARE_ITEMS) {
                return false;
            }
            newList = [...currentList, id];
        }

        localStorage.setItem(getCompareKey(type), JSON.stringify(newList));
        window.dispatchEvent(new CustomEvent('compareListUpdated', { detail: { type } }));
        return true;
    };

    const clearCompare = () => {
        localStorage.removeItem(getCompareKey(type));
        window.dispatchEvent(new CustomEvent('compareListUpdated', { detail: { type } }));
    };

    return {
        compareList,
        toggleCompare,
        clearCompare,
        maxItems: MAX_COMPARE_ITEMS,
    };
}
