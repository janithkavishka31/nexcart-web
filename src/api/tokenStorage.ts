import type { AuthPayload, User } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'nexcart.accessToken';

const USER_KEY = 'nexcart.user';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

  setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setSession(payload: AuthPayload) {
    this.setAccessToken(payload.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  },

  clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
