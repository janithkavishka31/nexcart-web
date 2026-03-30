import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { tokenStorage } from '@/api/tokenStorage';

import type { AuthPayload, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: tokenStorage.getUser(),
  accessToken: tokenStorage.getAccessToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthPayload>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      tokenStorage.setSession(action.payload);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      tokenStorage.clearSession();
    },
    updateUserProfile(state, action: PayloadAction<User>) {
      state.user = action.payload;

      if (state.accessToken) {
        tokenStorage.setSession({ user: action.payload, accessToken: state.accessToken });
      }
    },
  },
});

export const { logout, setCredentials, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
