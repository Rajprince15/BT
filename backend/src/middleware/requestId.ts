import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Assigns a stable request id used across logs, error responses,
 * Sentry breadcrumbs and (optionally) forwarded downstream.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header('x-request-id');
  const id = incoming && /^[a-zA-Z0-9-]{6,64}$/.test(incoming) ? incoming : randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
}
