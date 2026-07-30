export function getYouTubeEmbedUrl(url) {
    if (!url) return null

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

    return null
}
