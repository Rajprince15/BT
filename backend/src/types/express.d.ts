import type { Role } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: {
        id: number;
        role: Role;
        ver: number;
      };
    }
  }
}

export {};
