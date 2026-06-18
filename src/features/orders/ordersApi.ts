import { baseApi } from '@/api/baseApi';
import type { ApiResponse } from '@/types/api';
import type { Order, OrderStatus, ShippingAddress } from '@/types/order';
export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listOrders: builder.query<
      ApiResponse<Order[]>,
      { page?: number; limit?: number; status?: OrderStatus } | void
    >({ query: (params) => ({ url: '/orders', params }), providesTags: ['Orders'] }),
    placeOrder: builder.mutation<ApiResponse<Order>, { shippingAddress: ShippingAddress }>({
      query: (data) => ({ url: '/orders', method: 'POST', data }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
  }),
});
export const { useListOrdersQuery, usePlaceOrderMutation } = ordersApi;
