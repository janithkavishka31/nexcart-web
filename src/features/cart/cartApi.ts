import { baseApi } from '@/api/baseApi';
import type { ApiResponse } from '@/types/api';
import type { Product } from '@/types/product';

export interface ServerCartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'images' | 'imageUrl' | 'stock' | 'isActive'> & {
    category?: Product['category'];
  };
}

export interface ServerCart {
  id: string;
  userId: string;
  items: ServerCartItem[];
  summary: {
    itemCount: number;
    uniqueItems: number;
    subtotal: string;
  };
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<ServerCart>, void>({
      query: () => ({ url: '/cart' }),
      providesTags: ['Cart'],
    }),
    addCartItem: builder.mutation<ApiResponse<ServerCart>, { productId: string; quantity: number }>(
      {
        query: (body) => ({ url: '/cart/items', method: 'POST', data: body }),
        invalidatesTags: ['Cart'],
      },
    ),
    updateCartItem: builder.mutation<
      ApiResponse<ServerCart>,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: 'PATCH',
        data: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<ApiResponse<ServerCart>, string>({
      query: (productId) => ({ url: `/cart/items/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<ApiResponse<ServerCart>, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} = cartApi;
