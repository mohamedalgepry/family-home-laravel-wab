import ar from './locales/ar.js'
import en from './locales/en.js'

const dictionaries = {
    ar,
    en,
}

export async function loadLocale(locale) {
    return dictionaries[locale] || dictionaries.en
}

export function useTrans(locale) {
    const lang = dictionaries[locale] || dictionaries.en || dictionaries.ar || {}
    return (key, replacements = {}) => {
        let text = lang[key]
        if (!text) {
            const cleanKey = key.includes('.') ? key.split('.').pop() : key
            text = lang[cleanKey] || (dictionaries.ar && dictionaries.ar[cleanKey]) || (dictionaries.en && dictionaries.en[cleanKey]) || cleanKey.replace(/[_-]/g, ' ')
        }
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`:${k}`, v)
        }
        return text
    }
}

