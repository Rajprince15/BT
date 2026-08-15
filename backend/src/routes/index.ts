import { Router } from 'express';
import { asyncWrap } from '../utils/asyncWrap';
import { ok } from '../utils/envelope';
import { ping } from '../config/db';
import authRoutes from '../modules/auth/routes';
import categoriesRoutes from '../modules/categories/routes';
import productsRoutes from '../modules/products/routes';
import cartRoutes from '../modules/cart/routes';
import wishlistRoutes from '../modules/wishlist/routes';
import addressesRoutes from '../modules/addresses/routes';
import checkoutRoutes from '../modules/checkout/routes';
import ordersRoutes from '../modules/orders/routes';
import reviewsRoutes from '../modules/reviews/routes';
import wholesaleRoutes from '../modules/wholesale/routes';
import newsletterRoutes from '../modules/newsletter/routes';
import contactRoutes from '../modules/contact/routes';
import bannersRoutes from '../modules/banners/routes';
import mediaRoutes from '../modules/media/routes';
import adminRoutes from '../modules/admin/routes';
import webhookRoutes from '../modules/payments/routes';
import seoRoutes from '../modules/seo/routes';

const router = Router();

router.get('/health', (_req, res) => res.json(ok({ status: 'ok' })));
router.get(
  '/health/deep',
  asyncWrap(async (_req, res) => {
    const db = await ping();
    res.json(ok({ status: db ? 'ok' : 'degraded', checks: { db } }));
  }),
);

router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/collections', productsRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/me/addresses', addressesRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', ordersRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/wholesale-inquiry', wholesaleRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/contact', contactRoutes);
router.use('/banners', bannersRoutes);
router.use('/upload', mediaRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/', seoRoutes); // sitemap.xml, robots.txt

export default router;
