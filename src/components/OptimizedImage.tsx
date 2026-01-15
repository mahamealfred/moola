/**
 * OptimizedImage Component
 * Provides automatic image optimization with lazy loading, WebP support, and error handling
 */

'use client';

import React, { memo } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallback?: string;
  onError?: () => void;
}

export const OptimizedImage = memo(
  ({
    src,
    alt,
    width = 100,
    height = 100,
    className = '',
    priority = false,
    fallback,
    onError,
  }: OptimizedImageProps) => {
    const [hasError, setHasError] = React.useState(false);

    const handleError = React.useCallback(() => {
      setHasError(true);
      onError?.();
    }, [onError]);

    if (hasError && fallback) {
      return (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
          <span className="text-gray-500 text-sm">Image not found</span>
        </div>
      );
    }

    return (
      <Image
        src={hasError && fallback ? fallback : src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
