export type ApiEnvelope<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

export type PaginatedApiEnvelope<T> = ApiEnvelope<T> & {
  page?: number;
  totalPages?: number;
  totalItems?: number;
};

export type ApiErrorShape = {
  message: string;
  status?: number;
  code?: string;
};
