import { Router } from 'express';
import { z } from 'zod';
import { exec, query, withTransaction } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { authMiddleware } from '../../middleware/auth';
import { authReadLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { requireOwnership } from '../../middleware/ownership';
import { NotFoundError, UnauthorizedError } from '../../utils/errors';

const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(20),
  addressLine1: z.string().trim().min(2).max(255),
  addressLine2: z.string().trim().max(255).optional().nullable(),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be a 6-digit Indian pincode.'),
  country: z.string().trim().max(80).default('India'),
  isDefault: z.coerce.boolean().default(false),
});

const router = Router();
router.use(authMiddleware(), authReadLimiter);

router.get('/', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query(
    `SELECT * FROM addresses WHERE user_id = :userId ORDER BY is_default DESC, id DESC`,
    { userId: req.user.id },
  );
  res.json(ok(camelize<unknown[]>(rows)));
}));

router.post('/', validate({ body: addressSchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const body = req.body as z.infer<typeof addressSchema>;
  const insertId = await withTransaction(async (conn) => {
    if (body.isDefault) {
      await conn.execute(`UPDATE addresses SET is_default = 0 WHERE user_id = ?`, [req.user!.id]);
    }
    const [result] = await conn.execute(
      `INSERT INTO addresses (user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user!.id, body.fullName, body.phone, body.addressLine1, body.addressLine2 ?? null, body.city, body.state, body.pincode, body.country, body.isDefault ? 1 : 0],
    );
    return (result as { insertId: number }).insertId;
  });
  const rows = await query(`SELECT * FROM addresses WHERE id = :id LIMIT 1`, { id: insertId });
  res.status(201).json(ok(camelize(rows[0])));
}));

router.patch('/:id', requireOwnership('address'), validate({ body: addressSchema.partial() }),
  asyncWrap(async (req, res) => {
    const patch = req.body as Partial<z.infer<typeof addressSchema>>;
    await withTransaction(async (conn) => {
      if (patch.isDefault === true) {
        await conn.execute(`UPDATE addresses SET is_default = 0 WHERE user_id = ?`, [req.user!.id]);
      }
      const setParts: string[] = [];
      const params: unknown[] = [];
      const map: Record<string, string> = {
        fullName: 'full_name', phone: 'phone', addressLine1: 'address_line1', addressLine2: 'address_line2',
        city: 'city', state: 'state', pincode: 'pincode', country: 'country', isDefault: 'is_default',
      };
      for (const [key, dbKey] of Object.entries(map)) {
        if (key in patch) {
          setParts.push(`${dbKey} = ?`);
          const val = (patch as Record<string, unknown>)[key];
          params.push(key === 'isDefault' ? (val ? 1 : 0) : (val ?? null));
        }
      }
      if (setParts.length) {
        params.push(req.params.id);
        await conn.execute(`UPDATE addresses SET ${setParts.join(', ')} WHERE id = ?`, params as never);
      }
    });
    const rows = await query(`SELECT * FROM addresses WHERE id = :id LIMIT 1`, { id: req.params.id });
    res.json(ok(camelize(rows[0])));
  }),
);

router.delete('/:id', requireOwnership('address'), asyncWrap(async (req, res) => {
  await exec(`DELETE FROM addresses WHERE id = :id`, { id: req.params.id });
  res.json(ok({ removed: true }));
}));

router.post('/:id/default', requireOwnership('address'), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  await withTransaction(async (conn) => {
    await conn.execute(`UPDATE addresses SET is_default = 0 WHERE user_id = ?`, [req.user!.id]);
    const [result] = await conn.execute(
      `UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user!.id],
    );
    if (!(result as { affectedRows: number }).affectedRows) throw new NotFoundError('Address not found.');
  });
  res.json(ok({ setDefault: true }));
}));

export default router;
