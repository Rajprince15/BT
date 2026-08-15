import { Router } from 'express';
import { z } from 'zod';
import { exec } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { publicFormLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { sanitizeHtml } from '../../utils/sanitize';

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(2).max(4000),
  website: z.string().max(200).optional(),
});

router.post('/', publicFormLimiter, validate({ body: contactSchema }), asyncWrap(async (req, res): Promise<void> => {
  const body = req.body as z.infer<typeof contactSchema>;
  if (body.website) {
    res.json(ok({ received: true }));
    return;
  }
  await exec(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES (:name, :email, :phone, :subject, :message)`,
    {
      name: body.name, email: body.email,
      phone: body.phone ?? null,
      subject: body.subject ? sanitizeHtml(body.subject) : null,
      message: sanitizeHtml(body.message),
    },
  );
  res.status(201).json(ok({ received: true }));
}));

export default router;
