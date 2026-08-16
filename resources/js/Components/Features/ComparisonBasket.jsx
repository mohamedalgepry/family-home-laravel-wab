import { usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useEffect, useState, useCallback } from 'react'
import { safeStorage } from '../../Utils/storage'

const STORAGE_KEY = 'comparison_basket'
const MAX_ITEMS = 4

function getStoredItems() {
    try {
        const raw = safeStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export default function ComparisonBasket({ type = 'unit', onItemsChange }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const [items, setItems] = useState([])
    const [toast, setToast] = useState(null)

    useEffect(() => {
        setItems(getStoredItems())
    }, [])

    useEffect(() => {
        safeStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        if (onItemsChange) {
            onItemsChange(items)
        }
    }, [items, onItemsChange])

    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => setToast(null), 3000)
        return () => clearTimeout(timer)
    }, [toast])

    const addItem = useCallback((item) => {
        setItems(prev => {
            if (prev.some(i => i.id === item.id && i.type === (item.type || type))) {
                return prev
            }
            if (prev.length >= MAX_ITEMS) {
                setToast(trans('compare_limit'))
                return prev
            }
            return [...prev, { ...item, type: item.type || type }]
        })
    }, [type, trans])

    const removeItem = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setItems([])
    }, [])

    const isFull = items.length >= MAX_ITEMS
    const hasItem = useCallback((id) => items.some(i => i.id === id), [items])

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
            {toast && (
                <div className="fixed top-4 end-4 z-50 bg-error text-white px-4 py-2.5 rounded-lg text-sm shadow-modal animate-in">
                    {toast}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-card p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-secondary-950">
                        {trans('compare')} ({items.length}/{MAX_ITEMS})
                    </h3>
                    {items.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-muted hover:text-error transition-colors"
                        >
                            {trans('delete')}
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <p className="text-xs text-muted text-center py-4">{trans('no_data')}</p>
                ) : (
                    <ul className="space-y-2">
                        {items.map(item => (
                            <li key={item.id} className="flex items-center gap-2 text-sm">
                                <span className="flex-1 truncate text-secondary-800">{item.name}</span>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-muted hover:text-error transition-colors shrink-0"
                                    aria-label={trans('remove_from_compare')}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Expose addItem / removeItem / isFull / hasItem via ref or context in future */}
            {null}
        </div>
    )
}

export { MAX_ITEMS, STORAGE_KEY, getStoredItems }
