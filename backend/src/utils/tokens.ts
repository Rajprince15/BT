import crypto from 'crypto';

/**
 * 64-byte random token, base64url-encoded (safe in cookies / URLs).
 * Used for refresh tokens, password-reset tokens, email-verification tokens.
 */
export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/** Hex SHA-256 hash — stored in DB so raw tokens never touch persistence. */
export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/** HMAC-SHA256, hex output. Used to verify Razorpay signatures. */
export function hmacSha256(secret: string, payload: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/** Constant-time comparison — required for signature checks. */
export function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Business-friendly order number: BT-YYYYMMDD-XXXX */
export function generateOrderNumber(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BT-${y}${m}${day}-${suffix}`;
}
