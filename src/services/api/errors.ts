import type { ApiErrorShape } from '@/types/api';

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor({ message, status, code }: ApiErrorShape) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
    });
  }

  return new ApiError({
    message: 'Something went wrong while communicating with the server.',
  });
}
