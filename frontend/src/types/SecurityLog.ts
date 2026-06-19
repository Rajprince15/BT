export interface SecurityLog {
  id: number;
  userId?: number;
  event: string;
  ipAddress?: string;
  userAgent?: string;
  metaJson?: Record<string, unknown>;
  createdAt: string;
}
