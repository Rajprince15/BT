import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required env: ${key}`);
    }
    // eslint-disable-next-line no-console
    console.warn(`[env] ${key} is not set — using empty string in non-production.`);
    return '';
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function intEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  const n = raw ? Number(raw) : fallback;
  return Number.isFinite(n) ? n : fallback;
}

function boolEnv(key: string, fallback = false): boolean {
  const raw = (process.env[key] ?? '').toLowerCase();
  if (!raw) return fallback;
  return raw === '1' || raw === 'true' || raw === 'yes';
}

export const env = {
  NODE_ENV: (process.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test',
  PORT: intEnv('PORT', 4000),
  APP_URL: required('APP_URL', 'http://localhost:3000'),
  API_URL: required('API_URL', 'http://localhost:4000/api'),
  FRONTEND_ORIGINS: optional('FRONTEND_ORIGINS', 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  DB_HOST: required('DB_HOST', '127.0.0.1'),
  DB_PORT: intEnv('DB_PORT', 3306),
  DB_NAME: required('DB_NAME', 'bhavita_textiles'),
  DB_USER: required('DB_USER', 'root'),
  DB_PASS: optional('DB_PASS', ''),

  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET', 'dev-access'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', 'dev-refresh'),
  JWT_ACCESS_TTL: optional('JWT_ACCESS_TTL', '15m'),
  JWT_REFRESH_TTL: optional('JWT_REFRESH_TTL', '7d'),
  BCRYPT_ROUNDS: intEnv('BCRYPT_ROUNDS', 12),

  COOKIE_DOMAIN: optional('COOKIE_DOMAIN', 'localhost'),
  COOKIE_SECURE: boolEnv('COOKIE_SECURE', false),

  RAZORPAY_KEY_ID: optional('RAZORPAY_KEY_ID', ''),
  RAZORPAY_KEY_SECRET: optional('RAZORPAY_KEY_SECRET', ''),
  RAZORPAY_WEBHOOK_SECRET: optional('RAZORPAY_WEBHOOK_SECRET', ''),

  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),

  EMAIL_PROVIDER: (optional('EMAIL_PROVIDER', 'smtp') as 'smtp' | 'sendgrid' | 'ses'),
  EMAIL_FROM: optional('EMAIL_FROM', 'Bhavita Textiles <no-reply@bhavitatextiles.com>'),
  SMTP_HOST: optional('SMTP_HOST', 'localhost'),
  SMTP_PORT: intEnv('SMTP_PORT', 1025),
  SMTP_USER: optional('SMTP_USER', ''),
  SMTP_PASS: optional('SMTP_PASS', ''),
  SENDGRID_API_KEY: optional('SENDGRID_API_KEY', ''),

  SENTRY_DSN: optional('SENTRY_DSN', ''),
  LOG_LEVEL: optional('LOG_LEVEL', 'info'),

  RATE_LIMIT_AUTH_PER_15MIN: intEnv('RATE_LIMIT_AUTH_PER_15MIN', 5),
  RATE_LIMIT_PUBLIC_FORM_PER_HOUR: intEnv('RATE_LIMIT_PUBLIC_FORM_PER_HOUR', 10),
  RATE_LIMIT_PUBLIC_READ_PER_MIN: intEnv('RATE_LIMIT_PUBLIC_READ_PER_MIN', 120),
  RATE_LIMIT_AUTH_READ_PER_MIN: intEnv('RATE_LIMIT_AUTH_READ_PER_MIN', 300),
  RATE_LIMIT_ADMIN_PER_MIN: intEnv('RATE_LIMIT_ADMIN_PER_MIN', 600),

  RECAPTCHA_SECRET: optional('RECAPTCHA_SECRET', ''),
};

export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const isDev = !isProd && !isTest;
