export type TMeta = {
  limit: number;
  total: number;
  hasMore: boolean;
  nextSkip: number;
};

export type TSuccessResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: TMeta;
  data: T;
};

export type TErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errorDetails: {
    issues?: Record<string, unknown>;
    path?: string;
    [key: string]: unknown;
  };
};
