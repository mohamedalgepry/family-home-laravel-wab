export const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23F0F0F0" width="800" height="600"/%3E%3C/svg%3E'

/**
 * Normalizes an image path to ensure proper /storage/ URL format without duplicate storage/storage prefixes.
 */
export function getStorageUrl(path, fallback = PLACEHOLDER) {
    if (!path || typeof path !== 'string') {
        return fallback
    }

    const trimmed = path.trim()
    if (!trimmed) {
        return fallback
    }

    // Direct HTTP/HTTPS or SVG data URLs
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
        return trimmed
    }

    // Strip any leading slashes or duplicate storage prefixes
    let clean = trimmed.replace(/^\/+/, '')
    if (clean.startsWith('storage/')) {
        clean = clean.replace(/^storage\/+/, '')
    }

    return `/storage/${clean}`
}
