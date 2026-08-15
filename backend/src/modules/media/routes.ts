/**
 * Cloudinary signed uploads.
 * The client uploads directly to Cloudinary using a server-signed payload,
 * then calls /api/upload/persist so we record `cloud_id` + `secure_url` in DB.
 */
import { Router } from 'express';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { env } from '../../config/env';
import { authMiddleware } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { BadRequestError } from '../../utils/errors';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const router = Router();
router.use(authMiddleware(), requireAdmin);

// GET /api/upload/signature?folder=bhavita/products
router.get(
  '/signature',
  validate({ query: z.object({ folder: z.string().max(120).default('bhavita/products') }) }),
  asyncWrap(async (req, res) => {
    if (!env.CLOUDINARY_API_SECRET) throw new BadRequestError('Cloudinary is not configured.', {}, 'MISSING_CLOUDINARY');
    const timestamp = Math.round(Date.now() / 1000);
    const folder = (req.query.folder as string) || 'bhavita/products';
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder, transformation: 'f_auto,q_auto:good' },
      env.CLOUDINARY_API_SECRET,
    );
    res.json(ok({
      timestamp,
      folder,
      transformation: 'f_auto,q_auto:good',
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      signature,
    }));
  }),
);

// Persist an uploaded asset — the actual DB row is added by the caller module
// (e.g. products.addImage). This endpoint returns the metadata after basic
// safety checks; the workflow's contract with the frontend expects this shape.
router.post(
  '/persist',
  validate({
    body: z.object({
      secureUrl: z.string().url(),
      publicId: z.string().min(1).max(200),
      alt: z.string().max(180).optional(),
      sortOrder: z.number().int().min(0).optional(),
    }),
  }),
  asyncWrap(async (req, res) => {
    res.json(ok(req.body));
  }),
);

export default router;
