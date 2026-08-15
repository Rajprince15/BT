import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { sendMail } from '../../config/mailer';
import { securityLogger } from '../../config/logger';
import { withTransaction } from '../../config/db';
import { signAccessToken } from '../../utils/jwt';
import { randomToken, sha256 } from '../../utils/tokens';
import { BadRequestError, ConflictError, ForbiddenError, TooManyRequestsError, UnauthorizedError } from '../../utils/errors';
import { refreshTokenRepo, userRepo, type UserRow } from './repository';
import type { ChangePasswordInput, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from './schema';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TTL_MS = 30 * 60 * 1000;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MINUTES = 15;

export const REFRESH_COOKIE = 'bt_refresh';

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax' as const,
    domain: env.COOKIE_DOMAIN,
    path: '/api/auth',
    maxAge: REFRESH_TTL_MS,
  };
}

function toPublicUser(row: UserRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    emailVerified: !!row.email_verified,
    status: row.status,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

async function issueSession(user: UserRow, req: Request, res: Response) {
  const accessToken = signAccessToken({ sub: String(user.id), role: user.role, ver: user.token_version });
  const refreshToken = randomToken(32);
  const tokenHash = sha256(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  await refreshTokenRepo.create({
    userId: user.id,
    tokenHash,
    userAgent: req.get('user-agent') ?? null,
    ip: req.ip ?? null,
    expiresAt,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
  return { accessToken };
}

export const authService = {
  async register(input: RegisterInput, req: Request, res: Response) {
    const existing = await userRepo.findByEmail(input.email);
    if (existing) throw new ConflictError('An account with this email already exists.', 'EMAIL_TAKEN');

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    const rawVerify = randomToken(32);
    const hashedVerify = sha256(rawVerify);

    const userId = await userRepo.create({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash,
      emailVerificationToken: hashedVerify,
    });
    const user = await userRepo.findById(userId);
    if (!user) throw new BadRequestError('Registration failed.');

    const verifyUrl = `${env.APP_URL}/auth/verify-email?token=${rawVerify}`;
    await sendMail({
      to: user.email,
      subject: 'Verify your email · Bhavita Textiles',
      template: 'verify-email',
      data: { name: user.name, verifyUrl, year: new Date().getFullYear() },
    }).catch(() => undefined);

    securityLogger.info('user.registered', { userId: user.id, ip: req.ip });
    const { accessToken } = await issueSession(user, req, res);
    return { user: toPublicUser(user), accessToken };
  },

  async login(input: LoginInput, req: Request, res: Response) {
    const user = await userRepo.findByEmail(input.email);
    // Constant-work check even when user is missing — mitigates enumeration.
    if (!user) {
      await bcrypt.compare(input.password, '$2b$12$abcdefghijklmnopqrstuv');
      securityLogger.info('login.fail.no_user', { email: input.email, ip: req.ip });
      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }
    if (user.status === 'suspended' || user.status === 'deleted') {
      throw new ForbiddenError('This account is not available. Please contact support.');
    }
    if (user.lockout_until && new Date(user.lockout_until).getTime() > Date.now()) {
      throw new TooManyRequestsError('Too many failed attempts. Please try again in a few minutes.');
    }
    const okPassword = await bcrypt.compare(input.password, user.password_hash);
    if (!okPassword) {
      await userRepo.recordFailedLogin(user.id, LOCKOUT_MINUTES, LOCKOUT_THRESHOLD);
      securityLogger.info('login.fail.wrong_password', { userId: user.id, ip: req.ip });
      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }
    await userRepo.recordSuccessfulLogin(user.id);
    securityLogger.info('login.success', { userId: user.id, ip: req.ip });
    const { accessToken } = await issueSession(user, req, res);
    return { user: toPublicUser(user), accessToken };
  },

  async refresh(rawRefresh: string | undefined, req: Request, res: Response) {
    if (!rawRefresh) throw new UnauthorizedError('Missing refresh token.', 'NO_REFRESH');
    const hash = sha256(rawRefresh);
    const row = await refreshTokenRepo.findByHash(hash);
    if (!row) throw new UnauthorizedError('Invalid refresh token.', 'INVALID_REFRESH');
    if (row.revoked_at) {
      // Reuse detection → revoke the whole chain.
      await refreshTokenRepo.revokeChainFrom(row.id);
      securityLogger.warn('refresh.reuse_detected', { userId: row.user_id, ip: req.ip });
      throw new UnauthorizedError('Session invalidated. Please sign in again.', 'REFRESH_REUSED');
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new UnauthorizedError('Refresh token expired.', 'REFRESH_EXPIRED');
    }
    const user = await userRepo.findById(row.user_id);
    if (!user) throw new UnauthorizedError();
    // Rotate: revoke this row, mint a new one.
    const newRaw = randomToken(32);
    const newHash = sha256(newRaw);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
    const newId = await refreshTokenRepo.create({
      userId: user.id,
      tokenHash: newHash,
      userAgent: req.get('user-agent') ?? null,
      ip: req.ip ?? null,
      expiresAt,
    });
    await refreshTokenRepo.revoke(row.id, newId);
    res.cookie(REFRESH_COOKIE, newRaw, refreshCookieOptions());
    const accessToken = signAccessToken({ sub: String(user.id), role: user.role, ver: user.token_version });
    return { accessToken };
  },

  async logout(rawRefresh: string | undefined, res: Response) {
    if (rawRefresh) {
      const row = await refreshTokenRepo.findByHash(sha256(rawRefresh));
      if (row && !row.revoked_at) await refreshTokenRepo.revoke(row.id);
    }
    res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions(), maxAge: 0 });
  },

  async me(userId: number) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError();
    return toPublicUser(user);
  },

  async changePassword(userId: number, input: ChangePasswordInput, req: Request, res: Response) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError();
    const ok = await bcrypt.compare(input.currentPassword, user.password_hash);
    if (!ok) throw new UnauthorizedError('Current password is incorrect.', 'WRONG_PASSWORD');

    await withTransaction(async (conn) => {
      const newHash = await bcrypt.hash(input.newPassword, env.BCRYPT_ROUNDS);
      await conn.execute(
        `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [newHash, userId],
      );
      await refreshTokenRepo.revokeAllForUser(userId, conn);
    });

    securityLogger.info('password.changed', { userId, ip: req.ip });
    await sendMail({
      to: user.email,
      subject: 'Your password was updated',
      template: 'password-changed',
      data: { name: user.name, changedAt: new Date().toUTCString(), year: new Date().getFullYear() },
    }).catch(() => undefined);

    res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions(), maxAge: 0 });
  },

  async forgotPassword(input: ForgotPasswordInput, req: Request) {
    const user = await userRepo.findByEmail(input.email);
    // Always respond identically to avoid enumeration.
    if (!user) {
      securityLogger.info('forgot.no_user', { email: input.email, ip: req.ip });
      return;
    }
    const raw = randomToken(32);
    const hashed = sha256(raw);
    const expires = new Date(Date.now() + RESET_TTL_MS);
    await userRepo.setResetToken(user.id, hashed, expires);
    const resetUrl = `${env.APP_URL}/auth/reset-password?token=${raw}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your password · Bhavita Textiles',
      template: 'forgot-password',
      data: { name: user.name, resetUrl, year: new Date().getFullYear() },
    }).catch(() => undefined);
    securityLogger.info('forgot.sent', { userId: user.id });
  },

  async resetPassword(input: ResetPasswordInput, req: Request) {
    const hashed = sha256(input.token);
    const user = await userRepo.findByResetToken(hashed);
    if (!user) throw new BadRequestError('This reset link is invalid or has expired.', {}, 'RESET_INVALID');
    await withTransaction(async (conn) => {
      const newHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
      await conn.execute(
        `UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [newHash, user.id],
      );
      await refreshTokenRepo.revokeAllForUser(user.id, conn);
    });
    securityLogger.info('password.reset', { userId: user.id, ip: req.ip });
    await sendMail({
      to: user.email,
      subject: 'Your password was updated',
      template: 'password-changed',
      data: { name: user.name, changedAt: new Date().toUTCString(), year: new Date().getFullYear() },
    }).catch(() => undefined);
  },

  async verifyEmail(token: string) {
    const hashed = sha256(token);
    const user = await userRepo.findByVerificationToken(hashed);
    if (!user) throw new BadRequestError('This verification link is invalid or has already been used.', {}, 'VERIFY_INVALID');
    await userRepo.markEmailVerified(user.id);
    await sendMail({
      to: user.email,
      subject: 'Welcome to Bhavita Textiles',
      template: 'welcome',
      data: { name: user.name, year: new Date().getFullYear() },
    }).catch(() => undefined);
    return { email: user.email };
  },

  async resendVerification(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user || user.email_verified) return; // silent for safety
    const raw = randomToken(32);
    const hashed = sha256(raw);
    await userRepo.setVerificationToken(user.id, hashed);
    const verifyUrl = `${env.APP_URL}/auth/verify-email?token=${raw}`;
    await sendMail({
      to: user.email,
      subject: 'Verify your email · Bhavita Textiles',
      template: 'verify-email',
      data: { name: user.name, verifyUrl, year: new Date().getFullYear() },
    }).catch(() => undefined);
  },
};
