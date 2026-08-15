import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

function extractBearer(req: Request): string | null {
  const header = req.header('authorization') ?? '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

/**
 * Verifies a Bearer JWT and attaches `req.user`.
 * If `required` is false the middleware silently passes through when no token
 * is presented — handy for endpoints that alter behaviour when signed in.
 */
export function authMiddleware({ required = true }: { required?: boolean } = {}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const token = extractBearer(req);
    if (!token) {
      if (!required) return next();
      return next(new UnauthorizedError());
    }
    try {
      const claims = verifyAccessToken(token);
      req.user = {
        id: Number(claims.sub),
        role: claims.role,
        ver: Number(claims.ver ?? 0),
      };
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedError('Session expired. Please refresh.', 'TOKEN_EXPIRED'));
      }
      next(new UnauthorizedError('Invalid session.', 'INVALID_TOKEN'));
    }
  };
}
