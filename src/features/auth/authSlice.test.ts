import { describe, expect, it } from 'vitest';

import authReducer, { logout, setCredentials } from './authSlice';

describe('authSlice', () => {
  it('stores and clears authenticated user state', () => {
    const state = authReducer(
      undefined,
      setCredentials({
        accessToken: 'token',
        user: { id: '1', name: 'Ava', email: 'ava@nexcart.dev', role: 'USER' },
      }),
    );
    expect(state.user?.role).toBe('USER');
    expect(authReducer(state, logout()).user).toBeNull();
  });
});
