import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type Role = 'customer' | 'admin' | 'super_admin';

export interface AccessTokenClaims extends JwtPayload {
  sub: string;   // user id as string
  role: Role;
  ver: number;   // token version for change-password invalidation
}

export function signAccessToken(claims: Pick<AccessTokenClaims, 'sub' | 'role' | 'ver'>): string {
  const options: SignOptions = { algorithm: 'HS256', expiresIn: env.JWT_ACCESS_TTL as SignOptions['expiresIn'] };
  return jwt.sign({ sub: claims.sub, role: claims.role, ver: claims.ver }, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] }) as AccessTokenClaims;
}
