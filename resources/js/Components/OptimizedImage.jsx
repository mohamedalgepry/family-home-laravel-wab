import React, { useState, useEffect } from 'react';

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
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 500px',
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    const finalAlt = alt !== undefined ? alt : '';

    return (
        <img
            src={imgSrc}
            srcSet={srcSet || undefined}
            sizes={srcSet ? sizes : undefined}
            alt={finalAlt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            fetchPriority={!lazy ? 'high' : undefined}
            decoding={lazy ? 'async' : 'sync'}
            className={className}
            onError={handleError}
            role={role}
            {...props}
        />
    );
}
