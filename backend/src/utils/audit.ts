import type { Request } from 'express';
import { exec } from '../config/db';

export interface AuditContext {
  action: string;
  entity: string;
  entityId?: string | number | null;
  before?: unknown;
  after?: unknown;
}

/**
 * Fire-and-forget audit trail. Never throws — audit failures must not break
 * the request they audit; they log to `error-*.log` instead.
 */
export async function audit(req: Request, ctx: AuditContext): Promise<void> {
  try {
    const actorId = req.user?.id ?? null;
    const actorRole = req.user?.role ?? null;
    await exec(
      `INSERT INTO audit_logs (actor_id, actor_role, action, entity, entity_id, before_json, after_json, ip_address, user_agent)
       VALUES (:actorId, :actorRole, :action, :entity, :entityId, :before, :after, :ip, :ua)`,
      {
        actorId,
        actorRole,
        action: ctx.action,
        entity: ctx.entity,
        entityId: ctx.entityId != null ? String(ctx.entityId) : null,
        before: ctx.before ? JSON.stringify(ctx.before) : null,
        after: ctx.after ? JSON.stringify(ctx.after) : null,
        ip: req.ip ?? null,
        ua: req.get('user-agent') ?? null,
      },
    );
  } catch (error) {
    // Deliberately swallow — never let audit block the response.
    // Consumers see the message inside the app error log.
    // eslint-disable-next-line no-console
    console.error('[audit] failed', (error as Error).message);
  }
}
