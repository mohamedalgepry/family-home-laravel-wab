import { useState } from 'react'

export default function VideoPlayer({ embedUrl, title = 'Video Tour', className = '' }) {
    const [isPlaying, setIsPlaying] = useState(false)

    if (!embedUrl) return null

    // Extract YouTube Video ID from embed URL
    const ytMatch = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    const videoId = ytMatch ? ytMatch[1] : null

    // Lite YouTube Facade: Render zero-JS preview image until user clicks Play
    if (videoId && !isPlaying) {
        return (
            <div
                className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner cursor-pointer group ${className}`}
                onClick={() => setIsPlaying(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsPlaying(true) }}
                aria-label={`تشغيل الفيديو: ${title}`}
            >
                <img
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#CC0000] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                        <svg className="w-7 h-7 ms-1 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }

    const autoplayUrl = embedUrl.includes('?')
        ? `${embedUrl}&autoplay=1`
        : `${embedUrl}?autoplay=1`

    return (
        <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner ${className}`}>
            <iframe
                src={isPlaying ? autoplayUrl : embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
            />
        </div>
    )
}
