export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  images?: string[];
  categoryId?: string;
  category?: Category;
  sellerId?: string;
  rating?: number;
  isActive?: boolean;
  createdAt?: string;
}
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductInput {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  slug?: string;
  images?: string[];
  isActive?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stock?: number;
  slug?: string;
  images?: string[];
  isActive?: boolean;
}
