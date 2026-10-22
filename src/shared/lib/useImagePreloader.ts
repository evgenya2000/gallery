import { useEffect, useRef, useState } from 'react';
import { getResponsiveImageSources } from './images';

/**
 * Preloads a list of responsive images by creating an in-memory Image object.
 *
 * Starts while `enabled` is true (e.g. during the intro animation), picks the
 * mobile or desktop source based on the current viewport width, then resolves
 * after each image has loaded and decoded. Started loads continue if `enabled`
 * changes to false. Each URL is preloaded at most once per session.
 */
export function useImagePreloader(imagePaths: string[], enabled: boolean) {
  const [imagesReady, setImagesReady] = useState(false);
  const preloadedRef = useRef<Map<string, Promise<void>>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    if (imagePaths.length === 0) {
      setImagesReady(true);
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const imagePromises = imagePaths.map((originalPath) => {
      const { mobile, desktop } = getResponsiveImageSources(originalPath);
      const src = isMobile ? mobile : desktop;
      const existingPromise = preloadedRef.current.get(src);

      if (existingPromise) return existingPromise;

      const image = new Image();
      image.decoding = 'async';
      image.src = src;

      const decodePromise = typeof image.decode === 'function'
        ? image.decode().catch(() => undefined)
        : new Promise<void>((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            image.onload = () => resolve();
            image.onerror = () => resolve();
          });

      preloadedRef.current.set(src, decodePromise);
      return decodePromise;
    });

    void Promise.all(imagePromises).then(() => setImagesReady(true));
  }, [enabled, imagePaths]);

  return imagesReady;
}
