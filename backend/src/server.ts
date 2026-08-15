import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { closePool, ping } from './config/db';

async function main(): Promise<void> {
  const app = createApp();

  const dbOk = await ping().catch(() => false);
  if (!dbOk) {
    logger.warn('[boot] MySQL is not reachable yet — the server will start anyway; /api/health/deep will report the degradation.');
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`[boot] Bhavita API listening on ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`[boot] ${signal} received — closing gracefully…`);
    server.close(async () => {
      await closePool().catch(() => undefined);
      process.exit(0);
    });
    // Force-exit if graceful shutdown hangs.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((error) => {
  logger.error('Fatal boot error', { message: (error as Error).message, stack: (error as Error).stack });
  process.exitCode = 1;
});
