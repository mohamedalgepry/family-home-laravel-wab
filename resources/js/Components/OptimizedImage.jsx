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

    return (
        <img
            src={imgSrc}
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
