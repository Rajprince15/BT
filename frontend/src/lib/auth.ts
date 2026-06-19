export interface AuthTokenPayload {
  accessToken: string;
  expiresIn: number;
}

export interface UserSession {
  userId: string;
  role: 'customer' | 'admin' | 'super_admin';
  email: string;
}
