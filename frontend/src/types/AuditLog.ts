export interface AuditLog {
  id: number;
  actorId?: number;
  actorRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  beforeJson?: Record<string, unknown>;
  afterJson?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
