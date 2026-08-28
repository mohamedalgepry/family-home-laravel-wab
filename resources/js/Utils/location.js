/**
 * Validates whether an entity has valid, non-zero geographic coordinates.
 * 
 * @param {Object} item - Entity containing latitude and longitude (string or number)
 * @returns {boolean}
 */
export function hasValidCoords(item) {
    if (!item) return false
    const lat = parseFloat(item.latitude)
    const lng = parseFloat(item.longitude)
    return Boolean(
        item.latitude &&
        item.longitude &&
        lat !== 0 &&
        lng !== 0 &&
        isFinite(lat) &&
        isFinite(lng)
    )
}
