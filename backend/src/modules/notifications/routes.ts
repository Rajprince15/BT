import { Router } from 'express';
import { exec, query } from '../../config/db';
import { authMiddleware } from '../../middleware/auth';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { UnauthorizedError, NotFoundError } from '../../utils/errors';

const router = Router();
router.use(authMiddleware());
router.get('/', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query(`SELECT id, type, title, message, created_at, read_at, related_order_id FROM notifications WHERE user_id = :userId ORDER BY created_at DESC`, { userId: req.user.id });
  res.json(ok(camelize(rows).map((item: Record<string, unknown>) => ({ ...item, read: Boolean(item.readAt) }))));
}));
router.post('/read-all', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  await exec(`UPDATE notifications SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP) WHERE user_id = :userId`, { userId: req.user.id });
  res.json(ok({ success: true }));
}));
router.post('/:id/read', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const result = await exec(`UPDATE notifications SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP) WHERE id = :id AND user_id = :userId`, { id: req.params.id, userId: req.user.id });
  if (!result.affectedRows) throw new NotFoundError('Notification not found.');
  res.json(ok({ success: true }));
}));
export default router;
