export function getYouTubeEmbedUrl(url) {
    if (!url || typeof url !== 'string') return null

    const trimmed = url.trim()
    if (!trimmed) return null

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
        const match = trimmed.match(pattern)
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`
        }
    }

    if (trimmed.includes('vimeo.com')) {
        const match = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/)
        if (match && match[1]) {
            return `https://player.vimeo.com/video/${match[1]}`
        }
    }

    return null
}
