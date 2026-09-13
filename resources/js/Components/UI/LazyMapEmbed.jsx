import { useState, useEffect, useRef } from 'react'

export default function LazyMapEmbed({
    latitude,
    longitude,
    locale = 'ar',
    title = 'Google Map Location',
    className = ''
}) {
    const [shouldLoad, setShouldLoad] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current || typeof IntersectionObserver === 'undefined') {
            setShouldLoad(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // If element is visible and intersects within 250px margin
                if (entry.isIntersecting && entry.intersectionRatio > 0) {
                    setShouldLoad(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '250px 0px' }
        )

        observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [])

    if (!latitude || !longitude || latitude === '0' || longitude === '0') {
        return null
    }

    const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=${locale}&z=14&output=embed`

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-secondary-100 border border-secondary-200 ${className}`}
        >
            {shouldLoad ? (
                <iframe
                    src={mapSrc}
                    className="w-full h-full border-0 animate-fade-in"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={title}
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-secondary-400 bg-secondary-50">
                    <svg className="w-8 h-8 text-secondary-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-secondary-400">
                        {locale === 'ar' ? 'جارٍ تحميل الخريطة...' : 'Loading map...'}
                    </span>
                </div>
            )}
        </div>
    )
}
