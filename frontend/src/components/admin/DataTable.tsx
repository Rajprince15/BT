'use client';

import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  testId?: string;
}

const ALIGN_MAP = { left: 'text-left', right: 'text-right', center: 'text-center' };

export default function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyMessage = 'No records found.',
  loading = false,
  onRowClick,
  testId = 'data-table',
}: DataTableProps<T>) {
  return (
    <div data-testid={testId} className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2/60 text-[11px] uppercase tracking-wider2 text-ink-2">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 font-semibold ${ALIGN_MAP[column.align ?? 'left']} ${column.className ?? ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-ink-2">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  data-testid={`${testId}-empty`}
                  className="px-4 py-16 text-center text-sm text-ink-2"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const rowId = getRowId(row);
                return (
                  <tr
                    key={String(rowId)}
                    data-testid={`${testId}-row-${rowId}`}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? 'cursor-pointer transition-colors hover:bg-bg' : ''}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 align-middle text-ink ${ALIGN_MAP[column.align ?? 'left']} ${column.className ?? ''}`}
                      >
                        {column.render
                          ? column.render(row)
                          : String((row as Record<string, unknown>)[column.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
