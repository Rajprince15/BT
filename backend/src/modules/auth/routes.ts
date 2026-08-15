import { Router, type Request, type Response, type NextFunction } from 'express';
import { authController } from './controller';
import { validate } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimit';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailQuerySchema,
} from './schema';

const router = Router();

// Async handler wrapper so thrown promises land in errorHandler.
const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

router.post('/register', authLimiter, validate({ body: registerSchema }), wrap(authController.register));
router.post('/login', authLimiter, validate({ body: loginSchema }), wrap(authController.login));
router.post('/refresh', wrap(authController.refresh));
router.post('/logout', wrap(authController.logout));
router.get('/me', authMiddleware(), wrap(authController.me));
router.post('/change-password', authMiddleware(), validate({ body: changePasswordSchema }), wrap(authController.changePassword));
router.post('/forgot-password', authLimiter, validate({ body: forgotPasswordSchema }), wrap(authController.forgotPassword));
router.post('/reset-password', authLimiter, validate({ body: resetPasswordSchema }), wrap(authController.resetPassword));
router.get('/verify-email', validate({ query: verifyEmailQuerySchema }), wrap(authController.verifyEmail));
router.post('/resend-verification', authLimiter, validate({ body: resendVerificationSchema }), wrap(authController.resendVerification));

export default router;
