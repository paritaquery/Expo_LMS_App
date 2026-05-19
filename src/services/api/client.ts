import { API_CONFIG } from './config';
import { ApiError, normalizeApiError } from './errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestConfig = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  retryCount?: number;
  timeoutMs?: number;
  enableAuthRefresh?: boolean;
};

type RefreshTokenHandler = (expiredAccessToken: string) => Promise<string | null>;

let refreshTokenHandler: RefreshTokenHandler | null = null;

async function parseJsonSafely(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function buildHeaders(config: RequestConfig) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
    ...(config.headers ?? {}),
  };
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError({
        message: 'The request timed out. Please try again.',
        code: 'REQUEST_TIMEOUT',
      });
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function shouldRetry(error: ApiError, retriesRemaining: number) {
  if (retriesRemaining <= 0) {
    return false;
  }

  if (!error.status) {
    return true;
  }

  return error.status >= 500;
}

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${path}`;
  const retryCount = config.retryCount ?? API_CONFIG.retryCount;
  const timeoutMs = config.timeoutMs ?? API_CONFIG.timeoutMs;

  const execute = async (
    retriesRemaining: number,
    currentToken: string | undefined,
    hasAttemptedRefresh: boolean
  ): Promise<T> => {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: config.method ?? 'GET',
          headers: buildHeaders({
            ...config,
            token: currentToken,
          }),
          body: config.body ? JSON.stringify(config.body) : undefined,
        },
        timeoutMs
      );

      const responseData = await parseJsonSafely(response);

      if (!response.ok) {
        if (
          response.status === 401 &&
          config.enableAuthRefresh &&
          currentToken &&
          !hasAttemptedRefresh &&
          refreshTokenHandler
        ) {
          const refreshedToken = await refreshTokenHandler(currentToken);

          if (refreshedToken) {
            return execute(retriesRemaining, refreshedToken, true);
          }
        }

        const message =
          typeof responseData === 'object' &&
          responseData !== null &&
          'message' in responseData &&
          typeof responseData.message === 'string'
            ? responseData.message
            : 'The server returned an unexpected error.';

        throw new ApiError({
          message,
          status: response.status,
        });
      }

      return responseData as T;
    } catch (error) {
      const normalizedError = normalizeApiError(error);

      if (shouldRetry(normalizedError, retriesRemaining)) {
        return execute(retriesRemaining - 1, currentToken, hasAttemptedRefresh);
      }

      throw normalizedError;
    }
  };

  return execute(retryCount, config.token, false);
}

export const apiClient = {
  setRefreshTokenHandler: (handler: RefreshTokenHandler | null) => {
    refreshTokenHandler = handler;
  },
  get: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, {
      ...config,
      method: 'GET',
    }),
  post: <T>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ) =>
    request<T>(path, {
      ...config,
      method: 'POST',
      body,
    }),
  put: <T>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ) =>
    request<T>(path, {
      ...config,
      method: 'PUT',
      body,
    }),
  patch: <T>(
    path: string,
    body?: unknown,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ) =>
    request<T>(path, {
      ...config,
      method: 'PATCH',
      body,
    }),
  delete: <T>(path: string, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    request<T>(path, {
      ...config,
      method: 'DELETE',
    }),
};
