import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof ZodError) {
    apiError = ApiError.unprocessable(
      'Request validation failed',
      error.issues.map((issue) => ({ field: issue.path.join('.') || 'body', message: issue.message })),
    );
  } else if (error instanceof mongoose.Error.ValidationError) {
    apiError = ApiError.unprocessable(
      'Document validation failed',
      Object.values(error.errors).map((issue) => ({ field: issue.path, message: issue.message })),
    );
  } else if (error instanceof mongoose.Error.CastError) {
    apiError = ApiError.badRequest(`Invalid value for "${error.path}"`);
  } else if (error instanceof TokenExpiredError) {
    apiError = new ApiError(401, 'Session expired, please sign in again', { code: 'TOKEN_EXPIRED' });
  } else if (error instanceof JsonWebTokenError) {
    apiError = ApiError.unauthorized('Invalid authentication token');
  } else {
    apiError = ApiError.internal(env.isProduction ? 'Something went wrong' : (error as Error).message);
  }

  if (apiError.statusCode >= 500) logger.error({ err: error, url: req.originalUrl }, apiError.message);
  else logger.warn({ url: req.originalUrl, status: apiError.statusCode }, apiError.message);

  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    error: { code: apiError.code, details: apiError.details },
  });
};

export function notFound(_req: import('express').Request, _res: import('express').Response, next: import('express').NextFunction) {
  next(ApiError.notFound('Route not found'));
}
