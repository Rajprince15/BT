export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function ok<T>(data: T, meta?: Record<string, unknown> | object): ApiSuccess<T> {
  return meta === undefined ? { success: true, data } : { success: true, data, meta: meta as Record<string, unknown> };
}

export function fail(code: string, message: string, fields?: Record<string, string>): ApiError {
  const error: ApiError['error'] = { code, message };
  if (fields) error.fields = fields;
  return { success: false, error };
}

/**
 * Convert snake_case keys to camelCase on outgoing rows.
 * The DB stores snake_case; the API contract with the frontend is camelCase.
 */
export function camelize<T = unknown>(value: unknown): T {
  if (value === null || value === undefined) return value as T;
  if (Array.isArray(value)) return value.map((entry) => camelize(entry)) as T;
  if (value instanceof Date) return value as T;
  if (typeof value !== 'object') return value as T;
  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(source)) {
    const camelKey = key.replace(/_([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
    result[camelKey] = camelize(val);
  }
  return result as T;
}
