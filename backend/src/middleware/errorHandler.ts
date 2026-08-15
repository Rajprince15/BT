import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { AppError, ValidationError } from '../utils/errors';
import { fail } from '../utils/envelope';
import { logger } from '../config/logger';
import { isProd } from '../config/env';

export function notFoundHandler(_req: Request, res: Response, next: NextFunction): void {
  res.status(404).json(fail('NOT_FOUND', 'Route not found.'));
  next();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  // zod at the boundary → structured field errors
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) fields[issue.path.join('.') || '_'] = issue.message;
    res.status(400).json(fail('VALIDATION_ERROR', 'Please correct the highlighted fields.', fields));
    return;
  }

  if (err instanceof AppError) {
    if (err instanceof ValidationError) {
      res.status(err.status).json(fail(err.code, err.message, err.fields));
      return;
    }
    res.status(err.status).json(fail(err.code, err.message, err.fields));
    return;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json(fail('INVALID_TOKEN', 'Invalid session.'));
    return;
  }

  const message = err instanceof Error ? err.message : String(err);
  logger.error('Unhandled error', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    message,
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json(
    fail('SERVER_ERROR', isProd ? 'Something went wrong on our side.' : message),
  );
}
