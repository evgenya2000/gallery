export interface ResponsiveImageSources {
  /** Full-size WebP source for desktop/high-DPI screens. */
  desktop: string;
  /** Narrow WebP source optimized for mobile cards. */
  mobile: string;
  /** Original source as a safe fallback. */
  fallback: string;
}

/**
 * Builds responsive image source paths from an original public/photos asset.
 *
 * Assumes the build process has generated:
 *   - public/photos/<name>.webp
 *   - public/photos/mobile/<name>.webp
 */
export function getResponsiveImageSources(originalPath: string): ResponsiveImageSources {
  const normalized = originalPath.replace(/^\/+/, '');
  const lastDot = normalized.lastIndexOf('.');

  if (lastDot === -1) {
    return {
      desktop: originalPath,
      mobile: originalPath,
      fallback: originalPath,
    };
  }

  const basePath = normalized.slice(0, lastDot);
  const directory = basePath.slice(0, basePath.lastIndexOf('/') + 1);
  const name = basePath.slice(basePath.lastIndexOf('/') + 1);

  return {
    desktop: `/${directory}${name}.webp`,
    mobile: `/${directory}mobile/${name}.webp`,
    fallback: `/${normalized}`,
  };
}
