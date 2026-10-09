import { baseApi } from '@/api/baseApi';

import type { ApiResponse } from '@/types/api';

import type { User, UserRole } from '@/types/auth';

import type { Order, OrderStatus } from '@/types/order';

import type { Product } from '@/types/product';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAdminUsers: builder.query<ApiResponse<User[]>, { search?: string; role?: UserRole } | void>(
      { query: (params) => ({ url: '/admin/users', params }), providesTags: ['Admin'] },
    ),

    updateUserRole: builder.mutation<ApiResponse<User>, { userId: string; role: UserRole }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PATCH',
        data: { role },
      }),
      invalidatesTags: ['Admin'],
    }),

    listAdminProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => ({ url: '/admin/products' }),
      providesTags: ['Admin'],
    }),

    listAdminOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({ url: '/admin/orders' }),
      providesTags: ['Admin'],
    }),

    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { orderId: string; status: OrderStatus }
    >({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Admin', 'Orders'],
    }),
  }),
});

export const {
  useListAdminOrdersQuery,
  useListAdminProductsQuery,
  useListAdminUsersQuery,
  useUpdateOrderStatusMutation,
  useUpdateUserRoleMutation,
} = adminApi;
