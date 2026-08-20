import type { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function ok<T>(res: Response, data: T, message = 'OK', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function created<T>(res: Response, data: T, message = 'Created') {
  return ok(res, data, message, 201);
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) };
}
