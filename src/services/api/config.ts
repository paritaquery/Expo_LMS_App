import { ENV } from '@/config/env';

export const API_CONFIG = {
  baseUrl: ENV.apiBaseUrl,
  timeoutMs: 10000,
  retryCount: 2,
} as const;
