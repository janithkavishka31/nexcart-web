import { baseApi } from '@/api/baseApi';

import type { ApiResponse } from '@/types/api';

import type { AuthPayload } from '@/types/auth';

import { logout, setCredentials } from './authSlice';

import type { LoginFormValues, RegisterFormValues } from './authSchemas';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthPayload>, LoginFormValues>({
      query: (data) => ({ url: '/auth/login', method: 'POST', data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch {
          // Login failed — mutation error state is handled by the form.
        }
      },
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<ApiResponse<AuthPayload>, RegisterFormValues>({
      query: (data) => ({ url: '/auth/register', method: 'POST', data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch {
          // Registration failed — mutation error state is handled by the form.
        }
      },
      invalidatesTags: ['Auth'],
    }),

    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutUserMutation, useRegisterMutation } = authApi;
