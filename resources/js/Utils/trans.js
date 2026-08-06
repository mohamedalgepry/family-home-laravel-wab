const dictionaries = {}

const loaders = {
    ar: () => import('./locales/ar.js'),
    en: () => import('./locales/en.js'),
}

export async function loadLocale(locale) {
    const key = loaders[locale] ? locale : 'en'
    if (!dictionaries[key]) {
        dictionaries[key] = (await loaders[key]()).default
    }
    return dictionaries[key]
}

export function useTrans(locale) {
    const lang = dictionaries[locale] || dictionaries.en || {}
    return (key, replacements = {}) => {
        let text = lang[key]
        if (!text) {
            const cleanKey = key.includes('.') ? key.split('.').pop() : key
            text = lang[cleanKey] || cleanKey.replace(/[_-]/g, ' ')
        }
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`:${k}`, v)
        }
        return text
    }
}
