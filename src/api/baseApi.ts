import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axiosBaseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth', 'Products', 'Categories', 'Cart', 'Orders', 'Users', 'Admin'],
  endpoints: () => ({}),
});
