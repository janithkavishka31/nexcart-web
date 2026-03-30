import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark' | 'system';

interface UiState {
  theme: Theme;
  isMobileMenuOpen: boolean;
}

const initialState: UiState = {
  theme: (localStorage.getItem('nexcart.theme') as Theme | null) ?? 'system',
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem('nexcart.theme', action.payload);
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
  },
});

export const { closeMobileMenu, setTheme, toggleMobileMenu } = uiSlice.actions;

export default uiSlice.reducer;
