import { baseApi } from '@/api/baseApi';

import type { ApiResponse } from '@/types/api';

import type {
  Category,
  CreateCategoryInput,
  CreateProductInput,
  Product,
  ProductFilters,
  UpdateCategoryInput,
  UpdateProductInput,
} from '@/types/product';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<ApiResponse<Product[]>, ProductFilters | void>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Products'],
    }),

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (productId) => ({ url: `/products/${productId}` }),
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),

    listMyProducts: builder.query<ApiResponse<Product[]>, ProductFilters | void>({
      query: (params) => ({ url: '/products/me/listings', params }),
      providesTags: ['Products'],
    }),

    listCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({ url: '/categories' }),
      providesTags: ['Categories'],
    }),

    getCategory: builder.query<ApiResponse<Category>, string>({
      query: (categoryId) => ({ url: `/categories/${categoryId}` }),
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<ApiResponse<Category>, CreateCategoryInput>({
      query: (data) => ({ url: '/categories', method: 'POST', data }),
      invalidatesTags: ['Categories', 'Admin'],
    }),

    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { categoryId: string; data: UpdateCategoryInput }
    >({
      query: ({ categoryId, data }) => ({
        url: `/categories/${categoryId}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Categories', 'Admin'],
    }),

    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      query: (categoryId) => ({ url: `/categories/${categoryId}`, method: 'DELETE' }),
      invalidatesTags: ['Categories', 'Admin'],
    }),

    uploadCategoryImage: builder.mutation<ApiResponse<{ url: string }>, FormData>({
      query: (formData) => ({
        url: '/uploads/category-image',
        method: 'POST',
        data: formData,
      }),
    }),

    createProduct: builder.mutation<ApiResponse<Product>, CreateProductInput>({
      query: (data) => ({ url: '/products', method: 'POST', data }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { productId: string; data: UpdateProductInput }
    >({
      query: ({ productId, data }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Products', 'Admin'],
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (productId) => ({ url: `/products/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Products', 'Admin'],
    }),

    uploadProductImage: builder.mutation<ApiResponse<{ url: string }>, FormData>({
      query: (formData) => ({
        url: '/uploads/product-image',
        method: 'POST',
        data: formData,
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useCreateProductMutation,
  useDeleteCategoryMutation,
  useDeleteProductMutation,
  useGetCategoryQuery,
  useGetProductQuery,
  useListCategoriesQuery,
  useListMyProductsQuery,
  useListProductsQuery,
  useUpdateCategoryMutation,
  useUpdateProductMutation,
  useUploadCategoryImageMutation,
  useUploadProductImageMutation,
} = productsApi;
