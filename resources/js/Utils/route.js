export function localizedPath(path, locale) {
    if (!path) return '/';
    if (path.startsWith('http') || path.startsWith('//') || path.startsWith('/admin') || path.startsWith('/logout')) {
        return path;
    }
    
    // Remove query params and hash for a moment
    const [pathPart, ...queryParts] = path.split('?');
    const queryString = queryParts.length > 0 ? '?' + queryParts.join('?') : '';
    
    // Normalize path
    let normalizedPath = pathPart;
    
    // Remove existing locale prefix if any (to avoid /ar/ar/units)
    if (normalizedPath.startsWith('/ar/') || normalizedPath === '/ar') {
        normalizedPath = normalizedPath.substring(3);
    } else if (normalizedPath.startsWith('/en/') || normalizedPath === '/en') {
        normalizedPath = normalizedPath.substring(3);
    }
    
    if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
    }
    
    if (normalizedPath === '/') {
        return `/${locale}${queryString}`;
    }
    
    return `/${locale}${normalizedPath}${queryString}`;
}
