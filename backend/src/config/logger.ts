import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { env, isProd } from './env';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const REDACT_KEYS = new Set([
  'password',
  'passwordHash',
  'password_hash',
  'currentPassword',
  'newPassword',
  'token',
  'refresh_token',
  'refreshToken',
  'accessToken',
  'access_token',
  'signature',
  'razorpay_signature',
  'authorization',
  'cookie',
  'set-cookie',
]);

function redact(value: unknown): unknown {
  if (value == null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(redact);
  const entries = Object.entries(value as Record<string, unknown>);
  return entries.reduce<Record<string, unknown>>((acc, [key, val]) => {
    acc[key] = REDACT_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : redact(val);
    return acc;
  }, {});
}

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format((info) => {
    if (info.meta) info.meta = redact(info.meta);
    return info;
  })(),
  isProd ? winston.format.json() : winston.format.combine(winston.format.colorize(), winston.format.simple()),
);

function rotateTransport(filename: string, level?: string) {
  return new DailyRotateFile({
    filename: path.join(LOG_DIR, `${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level,
  });
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format,
  transports: [
    new winston.transports.Console({ level: env.LOG_LEVEL }),
    rotateTransport('app', 'info'),
    rotateTransport('error', 'error'),
  ],
});

// Named channels for security & payment audit trails (Section 2 + Phase 7A).
export const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [rotateTransport('security')],
});

export const paymentLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [rotateTransport('payment')],
});

export const httpLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [rotateTransport('http')],
});

export const httpStream = {
  write: (line: string) => httpLogger.info(line.trim()),
};
