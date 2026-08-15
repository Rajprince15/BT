import type { Request, Response, NextFunction } from 'express';
import type { Role } from '../utils/jwt';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * Server-side RBAC gate. NEVER trust the client for the role — this middleware
 * reads only `req.user.role` which was decoded from the signed JWT.
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    if (roles.includes(req.user.role)) return next();
    next(new ForbiddenError('Your account does not have access to this area.'));
  };
}

export const requireAdmin = requireRole('admin', 'super_admin');
export const requireSuperAdmin = requireRole('super_admin');
