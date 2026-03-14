import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from './env';

import { tokenStorage } from './tokenStorage';

import type { ApiResponse } from '@/types/api';

import type { AuthPayload } from '@/types/auth';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let refreshRequest: Promise<string | null> | null = null;

const AUTH_SKIP_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
];

function shouldSkipTokenRefresh(config: InternalAxiosRequestConfig) {
  const url = config.url ?? '';
  return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipTokenRefresh(originalRequest)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshRequest ??= httpClient
      .post<ApiResponse<AuthPayload>>('/auth/refresh-token')

      .then((response) => {
        tokenStorage.setSession(response.data.data);
        return response.data.data.accessToken;
      })

      .catch(() => {
        tokenStorage.clearSession();
        return null;
      })

      .finally(() => {
        refreshRequest = null;
      });

    const nextToken = await refreshRequest;

    if (!nextToken) return Promise.reject(error);

    originalRequest.headers.Authorization = `Bearer ${nextToken}`;

    return httpClient(originalRequest);
  },
);
