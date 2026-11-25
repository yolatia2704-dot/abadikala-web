import { useState } from 'react';
import { Flower2 } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#EFE9E0] text-[#6E655F] p-6 text-center ${className}`}
      >
        <Flower2 className="w-7 h-7 stroke-[1.5] text-[#6D3B47] mb-3" aria-hidden="true" />
        <p className="font-editorial text-lg text-[#2B2625] leading-snug">
          {fallbackTitle ?? 'Dokumentasi Studio Abadikala'}
        </p>
        <p className="text-xs text-[#6E655F] mt-1">Lhokseumawe, Aceh</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
