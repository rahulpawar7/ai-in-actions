import axios, { AxiosError } from 'axios';

const prefix = import.meta.env.VITE_API_PREFIX || '/api/v1';
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}${prefix}`
  : prefix;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20_000,
});

let accessToken: string | null = sessionStorage.getItem('aia_access');

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) sessionStorage.setItem('aia_access', token);
  else sessionStorage.removeItem('aia_access');
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiRequestError) return error.message;
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message && error.response && error.response.status < 500) return message;
  }
  return fallback;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      status >= 500 || !error.response
        ? error.code === 'ERR_NETWORK'
          ? 'Could not reach the server. Check that the API is running and refresh the page.'
          : 'The workshop studio is momentarily unavailable.'
        : error.response.data?.message ?? 'Request failed.';
    return Promise.reject(new ApiRequestError(message, status));
  },
);

export async function unwrap<T>(promise: Promise<{ data: { data: T } }>): Promise<T> {
  const response = await promise;
  return response.data.data;
}
