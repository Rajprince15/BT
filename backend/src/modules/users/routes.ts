import { Router } from 'express';
import { z } from 'zod';
import { exec, query } from '../../config/db';
import { authMiddleware } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { UnauthorizedError, NotFoundError } from '../../utils/errors';

const router = Router();
router.use(authMiddleware());
const profileSchema = z.object({ name: z.string().trim().min(2).max(120).optional(), phone: z.string().trim().max(20).optional().nullable() });

router.get('/me', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query(`SELECT id, name, email, phone, role, email_verified, status, last_login_at, created_at, updated_at, deleted_at FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1`, { id: req.user.id });
  if (!rows[0]) throw new NotFoundError('User not found.');
  res.json(ok(camelize(rows[0])));
}));

router.patch('/me', validate({ body: profileSchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const patch = req.body as z.infer<typeof profileSchema>;
  if (patch.name !== undefined || patch.phone !== undefined) {
    await exec(`UPDATE users SET name = COALESCE(:name, name), phone = :phone WHERE id = :id AND deleted_at IS NULL`, { id: req.user.id, name: patch.name ?? null, phone: patch.phone ?? null });
  }
  const rows = await query(`SELECT id, name, email, phone, role, email_verified, status, last_login_at, created_at, updated_at, deleted_at FROM users WHERE id = :id LIMIT 1`, { id: req.user.id });
  res.json(ok(camelize(rows[0])));
}));

export default router;
