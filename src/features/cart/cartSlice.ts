import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem, CartState } from '@/types/cart';

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addLocalItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.productId === action.payload.productId);
      if (existing) existing.quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },
    removeLocalItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    clearLocalCart(state) {
      state.items = [];
    },
  },
});

export const { addLocalItem, clearLocalCart, removeLocalItem } = cartSlice.actions;

export default cartSlice.reducer;
