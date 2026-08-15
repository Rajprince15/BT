import mysql, { Pool, PoolConnection, PoolOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { env } from './env';

const options: PoolOptions = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  namedPlaceholders: true,
  timezone: '+00:00',
  dateStrings: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  decimalNumbers: true,
  multipleStatements: false,
  charset: 'utf8mb4_unicode_ci',
};

export const pool: Pool = mysql.createPool(options);

/**
 * Execute a parameterised query returning rows.
 * Always use placeholders; NEVER concatenate values into SQL.
 */
export async function query<T = RowDataPacket>(sql: string, params?: Record<string, unknown> | unknown[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params as never);
  return rows as T[];
}

/**
 * Execute a mutation returning the raw ResultSetHeader (affectedRows, insertId, ...).
 */
export async function exec(sql: string, params?: Record<string, unknown> | unknown[]): Promise<ResultSetHeader> {
  const [result] = await pool.execute(sql, params as never);
  return result as ResultSetHeader;
}

/**
 * Run a set of DB operations inside a transaction.
 * The callback receives a connection to use for its queries.
 */
export async function withTransaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function ping(): Promise<boolean> {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok');
    return Array.isArray(rows) && (rows as RowDataPacket[])[0]?.ok === 1;
  } catch {
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
