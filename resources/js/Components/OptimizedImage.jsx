import React, { useState } from 'react';

export default function OptimizedImage({
    src,
    alt = '',
    width,
    height,
    className = '',
    lazy = true,
    fallbackSrc = '/images/fallback.webp',
    role,
    srcSet,
    sizes = '(max-width: 480px) 400px, (max-width: 768px) 400px, (max-width: 1024px) 400px, 800px',
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    const finalAlt = alt !== undefined ? alt : '';

    // Use explicit srcSet if passed, otherwise fall back to standard src to avoid 404 thumbnail errors
    const computedSrcSet = srcSet;

    return (
        <img
            src={imgSrc}
            srcSet={computedSrcSet}
            sizes={computedSrcSet ? sizes : undefined}
            alt={finalAlt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
            className={className}
            onError={handleError}
            role={role}
            {...props}
        />
    );
}
