import { useState, useEffect, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { localizedPath } from '../../Utils/route'
import { useCompare } from '../../Hooks/useCompare'
import axios from 'axios'

export default function CompareSearch({ type, currentIds }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const { toggleCompare, maxItems } = useCompare(type)
    
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const wrapperRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await axios.get(localizedPath(`/compare/search?type=${type}&q=${encodeURIComponent(query)}`, locale))
                setResults(res.data || [])
                setIsOpen(true)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query, type])

    function handleAdd(item) {
        if (currentIds.includes(item.id)) {
            return
        }
        if (currentIds.length >= maxItems) {
            setErrorMsg(locale === 'ar' ? `لا يمكنك مقارنة أكثر من ${maxItems} عناصر` : `You cannot compare more than ${maxItems} items`)
            setTimeout(() => setErrorMsg(''), 3000)
            return
        }

        toggleCompare(item.id)
        setQuery('')
        setIsOpen(false)
    }

    return (
        <div ref={wrapperRef} className="relative max-w-sm w-full">
            {errorMsg && (
                <div className="absolute -top-14 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm text-center shadow-lg animate-fade-in">
                    {errorMsg}
                </div>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={trans('search') + '...'}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                />
                {loading && (
                    <div className="absolute top-1/2 -translate-y-1/2 end-3">
                        <svg className="animate-spin h-4 w-4 text-primary-900" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-lg shadow-dropdown max-h-60 overflow-y-auto">
                    {results.map(item => {
                        const isAdded = currentIds.includes(item.id)
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleAdd(item)}
                                    disabled={isAdded}
                                    className={`w-full text-start px-4 py-2.5 text-sm transition-colors border-b border-secondary-100 last:border-b-0 ${
                                        isAdded ? 'bg-secondary-50 text-secondary-400 cursor-not-allowed' : 'hover:bg-secondary-50 text-secondary-800'
                                    }`}
                                >
                                    <span className="font-semibold">{item.name}</span>
                                    {type === 'unit' && (item.price || item.area_sqm || item.rooms) && (
                                        <span className="block text-[11px] text-secondary-400 mt-0.5">
                                            {item.price && <span>{Number(item.price).toLocaleString()} • </span>}
                                            {item.area_sqm && <span>{item.area_sqm} m² • </span>}
                                            {item.rooms && <span>{item.rooms} {isRtl ? 'غرف' : 'rooms'}</span>}
                                        </span>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
