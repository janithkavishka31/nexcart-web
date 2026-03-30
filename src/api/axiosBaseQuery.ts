import type { AxiosError, AxiosRequestConfig } from 'axios';

import { httpClient } from './httpClient';

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

export const axiosBaseQuery = async ({ url, method = 'GET', data, params }: AxiosBaseQueryArgs) => {
  try {
    const result = await httpClient({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    const error = axiosError as AxiosError<{ message?: string }>;
    return {
      error: { status: error.response?.status, data: error.response?.data ?? error.message },
    };
  }
};
