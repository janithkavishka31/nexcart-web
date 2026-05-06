import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';

const STORAGE_KEY = 'nexcart.wishlist';

interface WishlistState {
  items: Product[];
}

const loadWishlist = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
};

const persistWishlist = (items: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const initialState: WishlistState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistItem(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      persistWishlist(state.items);
    },
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistWishlist(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      persistWishlist(state.items);
    },
  },
});

export const { clearWishlist, removeWishlistItem, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((item) => item.id === productId);
