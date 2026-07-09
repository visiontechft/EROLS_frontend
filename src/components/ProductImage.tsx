import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string | null | undefined;
  webpSrc?: string | null;
  alt: string;
  className?: string;
}

export function ProductImage({ src, webpSrc, alt, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <Package className="text-gray-300" size={40} />
      </div>
    );
  }

  const img = (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );

  if (!webpSrc) return img;

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      {img}
    </picture>
  );
}
