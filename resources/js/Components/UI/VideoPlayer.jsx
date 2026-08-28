export default function VideoPlayer({ embedUrl, title = 'Video Tour', className = '' }) {
    if (!embedUrl) return null

    return (
        <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner ${className}`}>
            <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    )
}
