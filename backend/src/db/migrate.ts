/**
 * Applies SQL migration files under src/db/migrations in alphabetical order.
 * Each file is executed as a single multi-statement batch.
 *
 * Usage: `pnpm migrate`  (see package.json)
 * Idempotency: the schema DROP-then-CREATE is idempotent by design (see schema.sql).
 * A `schema_migrations` table records applied filenames so future incremental
 * migrations skip already-run files.
 */
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { env } from '../config/env';
import { logger } from '../config/logger';

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

async function ensureMigrationsTable(conn: mysql.Connection): Promise<void> {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      filename VARCHAR(200) NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_schema_filename (filename)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function alreadyApplied(conn: mysql.Connection, filename: string): Promise<boolean> {
  const [rows] = await conn.query('SELECT id FROM schema_migrations WHERE filename = ?', [filename]);
  return Array.isArray(rows) && rows.length > 0;
}

async function main(): Promise<void> {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    logger.warn('No migration files found in %s', MIGRATIONS_DIR);
    return;
  }

  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    multipleStatements: true,
  });

  try {
    await ensureMigrationsTable(conn);
    for (const file of files) {
      if (await alreadyApplied(conn, file)) {
        logger.info(`↷ Skip ${file} (already applied)`);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      logger.info(`↳ Applying ${file}…`);
      await conn.query(sql);
      await conn.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
      logger.info(`✓ ${file} applied`);
    }
    logger.info('All migrations up to date.');
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  logger.error('Migration failed', { message: (error as Error).message, stack: (error as Error).stack });
  process.exitCode = 1;
});
