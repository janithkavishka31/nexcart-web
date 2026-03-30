import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/api/baseApi';

import authReducer from '@/features/auth/authSlice';

import cartReducer from '@/features/cart/cartSlice';

import uiReducer from '@/features/ui/uiSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
