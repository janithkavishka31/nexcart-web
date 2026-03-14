export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NexCart';

/**
 * Resolve product/category image URLs for the current deployment.
 *
 * - Relative paths (/uploads/...) stay relative so Vercel/Vite can proxy over HTTPS.
 * - HTTP backend URLs are normalized to /uploads/... to avoid mixed-content blocks on HTTPS pages.
 * - HTTPS URLs (e.g. Unsplash) are returned unchanged.
 */
export function resolveAssetUrl(path: string | null | undefined) {
  if (!path) return '';

  if (path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('http://')) {
    try {
      const { pathname } = new URL(path);
      if (pathname.startsWith('/uploads/')) {
        return pathname;
      }
    } catch {
      return path;
    }
  }

  if (path.startsWith('/')) {
    return path;
  }

  return path;
}
