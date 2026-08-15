import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async controller so rejected promises reach the central error handler.
 * `router.get('/x', asyncWrap(handler))` — never write `handler(req,res).catch(next)` by hand.
 */
export function asyncWrap(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
