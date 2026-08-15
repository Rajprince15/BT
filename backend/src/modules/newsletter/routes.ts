import { Router } from 'express';
import { z } from 'zod';
import { exec } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { publicFormLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';

const router = Router();

router.post(
  '/subscribe',
  publicFormLimiter,
  validate({ body: z.object({ email: z.string().trim().toLowerCase().email(), source: z.string().max(60).optional() }) }),
  asyncWrap(async (req, res) => {
    const { email, source } = req.body as { email: string; source?: string };
    await exec(
      `INSERT INTO newsletter_subscribers (email, source) VALUES (:email, :source)
       ON DUPLICATE KEY UPDATE unsubscribed_at = NULL, source = COALESCE(VALUES(source), source)`,
      { email, source: source ?? null },
    );
    res.status(201).json(ok({ subscribed: true }));
  }),
);

router.post(
  '/unsubscribe',
  validate({ body: z.object({ email: z.string().trim().toLowerCase().email() }) }),
  asyncWrap(async (req, res) => {
    await exec(
      `UPDATE newsletter_subscribers SET unsubscribed_at = CURRENT_TIMESTAMP WHERE email = :email`,
      { email: req.body.email },
    );
    res.json(ok({ unsubscribed: true }));
  }),
);

export default router;
