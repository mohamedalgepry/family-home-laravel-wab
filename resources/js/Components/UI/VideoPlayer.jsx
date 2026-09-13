import { useState } from 'react'

export default function VideoPlayer({ embedUrl, title = 'Video Tour', className = '' }) {
    const [isPlaying, setIsPlaying] = useState(false)

    if (!embedUrl) return null

    // Extract YouTube video ID for fast, crisp thumbnail
    let videoId = null
    const match = embedUrl.match(/(?:embed\/|v=|\/vi\/|youtu\.be\/|\/v\/)([^#&?]*)/)
    if (match && match[1] && match[1].length === 11) {
        videoId = match[1]
    }

    const autoplayUrl = embedUrl.includes('?') ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`

    return (
        <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner group ${className}`}>
            {isPlaying ? (
                <iframe
                    src={autoplayUrl}
                    title={title}
                    className="w-full h-full border-0 animate-fade-in"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="relative w-full h-full flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                    aria-label={`Play ${title}`}
                >
                    {videoId && (
                        <img
                            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                    {/* YouTube Play Button */}
                    <div className="relative z-10 w-16 h-11 md:w-20 md:h-14 bg-[#CC0000] hover:bg-red-700 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110 active:scale-95">
                        <svg className="w-7 h-7 md:w-9 md:h-9 fill-current ps-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    )
}

