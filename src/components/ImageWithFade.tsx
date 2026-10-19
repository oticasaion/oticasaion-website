import React, { useState } from 'react';

interface ImageWithFadeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export const ImageWithFade: React.FC<ImageWithFadeProps> = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton / Placeholder discreto com tom quente elegante */}
      <div
        className={`absolute inset-0 bg-stone-200/50 transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
        aria-hidden="true"
      />
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
