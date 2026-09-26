import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Log full error internally for debugging
  console.error('[Error Handler]', err);

  const e = err as Error & { statusCode?: number; status?: number; };
  const statusCode = e.statusCode || (e.status && typeof e.status === 'number' ? e.status : 500);

  // Return clean, generic/safe message without leaking internal server stack traces
  const message =
    statusCode >= 500
      ? 'An unexpected error occurred while processing your request. Please try again.'
      : e.message || 'Bad Request';

  return res.status(statusCode).json({
    error: message
  });
}
