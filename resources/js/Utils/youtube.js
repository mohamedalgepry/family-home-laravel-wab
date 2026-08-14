export function getYouTubeEmbedUrl(url) {
    if (!url || typeof url !== 'string') return null

    const patterns = [
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /youtu\.be\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}`
        }
    }

    if (url.includes('vimeo.com')) {
        const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/)
        if (match) {
            return `https://player.vimeo.com/video/${match[1]}`
        }
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    return null
}
