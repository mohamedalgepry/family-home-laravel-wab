import React, { useState } from 'react';

export default function OptimizedImage({
    src,
    alt = '',
    width,
    height,
    className = '',
    lazy = true,
    fallbackSrc = '/images/fallback.jpg',
    role,
    srcSet,
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
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

    // Auto generate srcSet if src is in storage and no custom srcSet passed
    let computedSrcSet = srcSet;
    if (!computedSrcSet && typeof imgSrc === 'string' && imgSrc.includes('/storage/') && !imgSrc.includes('thumb_')) {
        const parts = imgSrc.split('/');
        const filename = parts.pop();
        const thumbSrc = [...parts, `thumb_${filename}`].join('/');
        computedSrcSet = `${thumbSrc} 400w, ${imgSrc} 1200w`;
    }

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
