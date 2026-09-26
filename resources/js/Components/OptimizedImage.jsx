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
    sizes = '(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 480px',
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src);
    const [imgSrcSet, setImgSrcSet] = useState(srcSet);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setImgSrcSet(srcSet);
        setHasError(false);
    }, [src, srcSet]);

    const handleError = (e) => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
            setImgSrcSet(undefined);
            if (e?.currentTarget) {
                e.currentTarget.onerror = null;
                e.currentTarget.srcset = '';
                e.currentTarget.src = fallbackSrc;
            }
        }
    };

    const finalAlt = alt !== undefined ? alt : '';

    return (
        <img
            src={imgSrc}
            srcSet={!hasError ? (imgSrcSet || undefined) : undefined}
            sizes={!hasError && imgSrcSet ? sizes : undefined}
            alt={finalAlt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            fetchPriority={!lazy ? 'high' : undefined}
            decoding="async"
            className={className}
            onError={handleError}
            role={role}
            {...props}
        />
    );
}
