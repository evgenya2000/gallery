import { useEffect, useRef } from 'react';
import { getResponsiveImageSources } from './images';

/**
 * Preloads a list of responsive images by creating an in-memory Image object.
 *
 * Only runs while `enabled` is true (e.g. during the intro animation) and
 * picks the mobile or desktop source based on the current viewport width.
 * Each URL is preloaded at most once per session.
 */
export function useImagePreloader(imagePaths: string[], enabled: boolean) {
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || imagePaths.length === 0) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    imagePaths.forEach((originalPath) => {
      const { mobile, desktop } = getResponsiveImageSources(originalPath);
      const src = isMobile ? mobile : desktop;

      if (preloadedRef.current.has(src)) return;

      const img = new Image();
      img.src = src;
      preloadedRef.current.add(src);
    });
  }, [enabled, imagePaths]);
}
