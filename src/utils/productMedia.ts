import { resolveAssetUrl } from '@/api/env';

import type { Product } from '@/types/product';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80';

export function getProductImage(product: Pick<Product, 'imageUrl' | 'images'>) {
  const image = product.imageUrl ?? product.images?.[0];
  return image ? resolveAssetUrl(image) : FALLBACK_IMAGE;
}

export function getProductGallery(product: Pick<Product, 'imageUrl' | 'images'>) {
  const gallery = product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  const resolved = gallery.map((image) => resolveAssetUrl(image)).filter(Boolean);
  return resolved.length ? resolved : [FALLBACK_IMAGE];
}
