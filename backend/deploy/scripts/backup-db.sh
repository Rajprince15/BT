#!/usr/bin/env bash
# Nightly MySQL backup. Rotates on-disk backups older than 14 days.
# Env: DB_HOST DB_PORT DB_NAME DB_USER DB_PASS BACKUP_DIR
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/bhavita}"
mkdir -p "$BACKUP_DIR"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="$BACKUP_DIR/bhavita-${TS}.sql.gz"

mysqldump \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="${DB_USER}" \
  --password="${DB_PASS}" \
  --single-transaction --quick --lock-tables=false --routines --triggers \
  "$DB_NAME" | gzip -9 > "$OUT"

# Retention: 14 days.
find "$BACKUP_DIR" -type f -name '*.sql.gz' -mtime +14 -delete

echo "Backup written: $OUT"
