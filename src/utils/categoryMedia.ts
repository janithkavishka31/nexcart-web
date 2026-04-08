import { resolveAssetUrl } from '@/api/env';

import { categoryImages, DEFAULT_CATEGORY_IMAGE } from '@/constants/categoryImages';

import type { Category } from '@/types/product';

export function getCategoryImage(category: Pick<Category, 'name' | 'imageUrl'>) {
  if (category.imageUrl) {
    return resolveAssetUrl(category.imageUrl);
  }

  return categoryImages[category.name] ?? DEFAULT_CATEGORY_IMAGE;
}
