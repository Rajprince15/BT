import rateLimit, { Options } from 'express-rate-limit';
import { env } from '../config/env';
import { fail } from '../utils/envelope';

function make(windowMs: number, max: number, code = 'RATE_LIMITED'): ReturnType<typeof rateLimit> {
  const options: Partial<Options> = {
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json(fail(code, 'Too many attempts. Please try again shortly.'));
    },
  };
  return rateLimit(options as Options);
}

/** 5 attempts / 15 min — for login, forgot-password, reset-password. */
export const authLimiter = make(15 * 60 * 1000, env.RATE_LIMIT_AUTH_PER_15MIN, 'AUTH_RATE_LIMIT');

/** 10 / hour — for contact, wholesale, newsletter public forms. */
export const publicFormLimiter = make(60 * 60 * 1000, env.RATE_LIMIT_PUBLIC_FORM_PER_HOUR, 'FORM_RATE_LIMIT');

/** 120 / min — for anonymous read-only APIs. */
export const publicReadLimiter = make(60 * 1000, env.RATE_LIMIT_PUBLIC_READ_PER_MIN);

/** 300 / min — for signed-in read-heavy APIs. */
export const authReadLimiter = make(60 * 1000, env.RATE_LIMIT_AUTH_READ_PER_MIN);

/** 600 / min — for admin console. */
export const adminLimiter = make(60 * 1000, env.RATE_LIMIT_ADMIN_PER_MIN);
