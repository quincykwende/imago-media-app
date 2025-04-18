import Image from 'next/image';
import { useState } from 'react';

export default function ImageWithFallback({ src, alt, width, height, className}: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => setImgSrc('/placeholder-image.jpg')}
            unoptimized
        />
    );
}
