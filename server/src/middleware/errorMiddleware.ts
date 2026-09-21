import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Log full error internally for debugging
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || (err.status && typeof err.status === 'number' ? err.status : 500);

  // Return clean, generic/safe message without leaking internal server stack traces
  const message =
    statusCode >= 500
      ? 'An unexpected error occurred while processing your request. Please try again.'
      : err.message || 'Bad Request';

  return res.status(statusCode).json({
    error: message
  });
}
