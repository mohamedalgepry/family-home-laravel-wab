const dictionaries = {}

export async function loadLocale(locale) {
    const lang = locale === 'ar' ? 'ar' : 'en'
    if (!dictionaries[lang]) {
        try {
            if (lang === 'ar') {
                const mod = await import('./locales/ar.js')
                dictionaries.ar = mod.default || mod
            } else {
                const mod = await import('./locales/en.js')
                dictionaries.en = mod.default || mod
            }
        } catch (e) {
            console.warn(`Failed to load locale '${lang}', falling back.`, e)
        }
    }
    return dictionaries[lang] || dictionaries.ar || dictionaries.en || {}
}

export function useTrans(locale) {
    const langKey = locale === 'ar' ? 'ar' : 'en'
    const lang = dictionaries[langKey] || dictionaries.ar || dictionaries.en || {}
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


