import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env, isProd } from './config/env';
import { httpStream } from './config/logger';
import { requestId } from './middleware/requestId';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

export function createApp(): Application {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Security headers (Section 3B CSP).
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'img-src': ["'self'", 'https://res.cloudinary.com', 'data:'],
          'script-src': ["'self'", 'https://checkout.razorpay.com'],
          'style-src': ["'self'", "'unsafe-inline'"],
          'connect-src': ["'self'", 'https://api.razorpay.com'],
          'frame-ancestors': ["'none'"],
        },
      },
      hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );

  // CORS strict whitelist (Section 3B).
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true); // curl / same-origin / server-to-server
        if (env.FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
        return callback(new Error('Origin not allowed by CORS policy'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-CSRF', 'Idempotency-Key'],
      exposedHeaders: ['X-Request-Id'],
      maxAge: 86400,
    }),
  );

  app.use(requestId);

  // Body parsers — with a raw handler for the RP webhook (needs the untouched buffer).
  app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json', limit: '1mb' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(cookieParser());

  app.use(morgan(isProd ? 'combined' : 'dev', { stream: httpStream }));

  app.use('/api', apiRoutes);

  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return app;
}
