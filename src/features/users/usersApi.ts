import { baseApi } from '@/api/baseApi';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/auth';
import { updateUserProfile } from '@/features/auth/authSlice';
import type { UpdateProfileInput } from '@/features/users/profileSchemas';

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({ url: '/users/me' }),
      providesTags: ['Users'],
    }),
    listAddresses: builder.query<ApiResponse<Address[]>, void>({
      query: () => ({ url: '/users/me/addresses' }),
      providesTags: ['Users'],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, UpdateProfileInput>({
      query: (data) => ({ url: '/users/me', method: 'PATCH', data }),
      invalidatesTags: ['Users'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUserProfile(data.data));
        } catch {
          // Form handles mutation errors.
        }
      },
    }),
  }),
});
export const { useGetProfileQuery, useListAddressesQuery, useUpdateProfileMutation } = usersApi;
