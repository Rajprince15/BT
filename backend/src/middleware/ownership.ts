import type { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../utils/errors';

type OwnershipResource = 'address' | 'order' | 'cart_item' | 'review';

interface RowWithUser {
  user_id: number;
}

const OWNERSHIP_SQL: Record<OwnershipResource, string> = {
  address: 'SELECT user_id FROM addresses WHERE id = :id',
  order: 'SELECT user_id FROM orders WHERE order_number = :id',
  cart_item: `SELECT c.user_id FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE ci.id = :id`,
  review: 'SELECT user_id FROM reviews WHERE id = :id',
};

/**
 * Confirms the current user owns the resource identified in the URL param.
 * Admins are allowed through (they may need to inspect any record).
 */
export function requireOwnership(resource: OwnershipResource, param = 'id') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) return next(new UnauthorizedError());
    if (req.user.role === 'admin' || req.user.role === 'super_admin') return next();

    const id = req.params[param];
    if (!id) return next(new NotFoundError());

    try {
      const rows = await query<RowWithUser>(OWNERSHIP_SQL[resource], { id });
      const row = rows[0];
      if (!row) return next(new NotFoundError());
      if (row.user_id !== req.user.id) return next(new ForbiddenError());
      next();
    } catch (error) {
      next(error);
    }
  };
}
