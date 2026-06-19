import api from '@/lib/api';
import type { AuditLog } from '@/types/AuditLog';
import type { ApiResponse, ListResponse } from '@/types/api';
import { simulateLatency, useMockService, paginate } from '@/services/_mock-runtime';

async function callApi<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AuditListParams {
  page?: number;
  pageSize?: number;
  entity?: string;
  actorId?: number;
}

// Small in-memory mock store — audit logs grow as admins act in mock mode.
const NOW = '2025-12-15T10:00:00.000Z';
const auditLogs: AuditLog[] = [
  { id: 1, actorId: 2, actorRole: 'admin', action: 'update', entity: 'product', entityId: '6', ipAddress: '203.0.113.10', userAgent: 'Mozilla/5.0', createdAt: NOW },
  { id: 2, actorId: 2, actorRole: 'admin', action: 'create', entity: 'banner', entityId: '4', ipAddress: '203.0.113.10', userAgent: 'Mozilla/5.0', createdAt: NOW },
  { id: 3, actorId: 3, actorRole: 'super_admin', action: 'moderate', entity: 'review', entityId: '17', ipAddress: '203.0.113.11', userAgent: 'Mozilla/5.0', createdAt: NOW },
];

export function pushAuditMock(entry: Omit<AuditLog, 'id' | 'createdAt'>): void {
  auditLogs.push({
    ...entry,
    id: Math.max(0, ...auditLogs.map((a) => a.id)) + 1,
    createdAt: new Date().toISOString(),
  });
}

export const adminAuditService = {
  async list(params: AuditListParams = {}) {
    if (useMockService) {
      await simulateLatency();
      let items = [...auditLogs];
      if (params.entity) items = items.filter((a) => a.entity === params.entity);
      if (params.actorId) items = items.filter((a) => a.actorId === params.actorId);
      return paginate(items, params.page ?? 1, params.pageSize ?? 20);
    }
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.entity) query.set('entity', params.entity);
    if (params.actorId) query.set('actorId', String(params.actorId));
    return callApi<ListResponse<AuditLog>>(`/admin/audit?${query.toString()}`);
  },
};

export default adminAuditService;
