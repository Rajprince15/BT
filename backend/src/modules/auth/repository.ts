import type { PoolConnection } from 'mysql2/promise';
import { exec, pool, query } from '../../config/db';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role: 'customer' | 'admin' | 'super_admin';
  email_verified: 0 | 1;
  email_verification_token: string | null;
  password_reset_token: string | null;
  password_reset_expires: Date | null;
  failed_login_count: number;
  lockout_until: Date | null;
  last_login_at: Date | null;
  status: 'active' | 'suspended' | 'deleted';
  token_version: number; // logical field, mapped from a virtual column below
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * `token_version` is not persisted separately in the shipped schema.sql;
 * we derive it from `updated_at` for now so that change-password bumps it.
 * The auth service reads this value into the JWT `ver` claim and rejects
 * tokens whose `ver` mismatches after a password change.
 */
function withVersion<T extends { updated_at: Date }>(row: T): T & { token_version: number } {
  const version = Math.floor(new Date(row.updated_at).getTime() / 1000);
  return Object.assign(row, { token_version: version });
}

export const userRepo = {
  async findByEmail(email: string): Promise<UserRow | undefined> {
    const rows = await query<UserRow>(
      `SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1`,
      { email },
    );
    return rows[0] ? withVersion(rows[0]) : undefined;
  },
  async findById(id: number): Promise<UserRow | undefined> {
    const rows = await query<UserRow>(
      `SELECT * FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1`,
      { id },
    );
    return rows[0] ? withVersion(rows[0]) : undefined;
  },
  async findByVerificationToken(hashed: string): Promise<UserRow | undefined> {
    const rows = await query<UserRow>(
      `SELECT * FROM users WHERE email_verification_token = :hashed AND deleted_at IS NULL LIMIT 1`,
      { hashed },
    );
    return rows[0] ? withVersion(rows[0]) : undefined;
  },
  async findByResetToken(hashed: string): Promise<UserRow | undefined> {
    const rows = await query<UserRow>(
      `SELECT * FROM users
       WHERE password_reset_token = :hashed
         AND password_reset_expires > CURRENT_TIMESTAMP
         AND deleted_at IS NULL
       LIMIT 1`,
      { hashed },
    );
    return rows[0] ? withVersion(rows[0]) : undefined;
  },
  async create(input: {
    name: string;
    email: string;
    phone: string | null;
    passwordHash: string;
    role?: 'customer' | 'admin' | 'super_admin';
    emailVerificationToken: string;
  }): Promise<number> {
    const result = await exec(
      `INSERT INTO users (name, email, phone, password_hash, role, email_verification_token)
       VALUES (:name, :email, :phone, :passwordHash, :role, :evt)`,
      {
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash: input.passwordHash,
        role: input.role ?? 'customer',
        evt: input.emailVerificationToken,
      },
    );
    return result.insertId;
  },
  async setPassword(userId: number, hash: string): Promise<void> {
    await exec(
      `UPDATE users SET password_hash = :hash, updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { hash, id: userId },
    );
  },
  async markEmailVerified(userId: number): Promise<void> {
    await exec(
      `UPDATE users SET email_verified = 1, email_verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { id: userId },
    );
  },
  async setVerificationToken(userId: number, hashedToken: string): Promise<void> {
    await exec(
      `UPDATE users SET email_verification_token = :hashed, updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { hashed: hashedToken, id: userId },
    );
  },
  async setResetToken(userId: number, hashedToken: string, expiresAt: Date): Promise<void> {
    await exec(
      `UPDATE users
       SET password_reset_token = :hashed, password_reset_expires = :expires, updated_at = CURRENT_TIMESTAMP
       WHERE id = :id`,
      { hashed: hashedToken, expires: expiresAt, id: userId },
    );
  },
  async clearResetToken(userId: number): Promise<void> {
    await exec(
      `UPDATE users
       SET password_reset_token = NULL, password_reset_expires = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE id = :id`,
      { id: userId },
    );
  },
  async recordSuccessfulLogin(userId: number): Promise<void> {
    await exec(
      `UPDATE users
       SET failed_login_count = 0, lockout_until = NULL, last_login_at = CURRENT_TIMESTAMP
       WHERE id = :id`,
      { id: userId },
    );
  },
  async recordFailedLogin(userId: number, lockoutMinutes: number, threshold: number): Promise<void> {
    await exec(
      `UPDATE users
       SET failed_login_count = failed_login_count + 1,
           lockout_until = CASE WHEN failed_login_count + 1 >= :threshold
                                THEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL :mins MINUTE)
                                ELSE lockout_until END
       WHERE id = :id`,
      { id: userId, threshold, mins: lockoutMinutes },
    );
  },
};

export interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  user_agent: string | null;
  ip_address: string | null;
  expires_at: Date;
  revoked_at: Date | null;
  replaced_by_id: number | null;
  created_at: Date;
}

export const refreshTokenRepo = {
  async create(input: {
    userId: number;
    tokenHash: string;
    userAgent: string | null;
    ip: string | null;
    expiresAt: Date;
  }): Promise<number> {
    const result = await exec(
      `INSERT INTO refresh_tokens (user_id, token_hash, user_agent, ip_address, expires_at)
       VALUES (:userId, :tokenHash, :ua, :ip, :expires)`,
      {
        userId: input.userId,
        tokenHash: input.tokenHash,
        ua: input.userAgent,
        ip: input.ip,
        expires: input.expiresAt,
      },
    );
    return result.insertId;
  },
  async findByHash(hash: string): Promise<RefreshTokenRow | undefined> {
    const rows = await query<RefreshTokenRow>(
      `SELECT * FROM refresh_tokens WHERE token_hash = :hash LIMIT 1`,
      { hash },
    );
    return rows[0];
  },
  async revoke(id: number, replacedById?: number): Promise<void> {
    await exec(
      `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP, replaced_by_id = :replaced WHERE id = :id AND revoked_at IS NULL`,
      { replaced: replacedById ?? null, id },
    );
  },
  async revokeAllForUser(userId: number, connArg?: PoolConnection): Promise<void> {
    const conn = connArg ?? pool;
    await conn.execute(
      `UPDATE refresh_tokens SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL`,
      [userId],
    );
  },
  async revokeChainFrom(rowId: number): Promise<void> {
    // Chain-revoke: walk backward from a reused token and revoke every token
    // sharing its family. Simplification: revoke everything on the user for now.
    const rows = await query<RefreshTokenRow>(`SELECT user_id FROM refresh_tokens WHERE id = :id LIMIT 1`, { id: rowId });
    if (!rows[0]) return;
    await this.revokeAllForUser(rows[0].user_id);
  },
};
