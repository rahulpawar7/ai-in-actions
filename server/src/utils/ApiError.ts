export interface ApiErrorDetail {
  field: string;
  message: string;
}

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details: ApiErrorDetail[];

  constructor(
    statusCode: number,
    message: string,
    options: { code?: string; details?: ApiErrorDetail[] } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = options.code ?? 'ERROR';
    this.details = options.details ?? [];
  }

  static badRequest(message: string, details?: ApiErrorDetail[]) {
    return new ApiError(400, message, { code: 'BAD_REQUEST', details });
  }

  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message, { code: 'UNAUTHORIZED' });
  }

  static forbidden(message = 'You do not have permission to do this') {
    return new ApiError(403, message, { code: 'FORBIDDEN' });
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message, { code: 'NOT_FOUND' });
  }

  static conflict(message: string) {
    return new ApiError(409, message, { code: 'CONFLICT' });
  }

  static unprocessable(message: string, details?: ApiErrorDetail[]) {
    return new ApiError(422, message, { code: 'VALIDATION_ERROR', details });
  }

  static tooMany(message = 'Too many requests') {
    return new ApiError(429, message, { code: 'RATE_LIMITED' });
  }

  static internal(message = 'Something went wrong') {
    return new ApiError(500, message, { code: 'INTERNAL' });
  }

  static serviceUnavailable(message: string) {
    return new ApiError(503, message, { code: 'UNAVAILABLE' });
  }
}
