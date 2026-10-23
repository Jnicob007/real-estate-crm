import 'dotenv/config';
import { createDatabasePool } from '../config/database.js';
import { loadEnv } from '../config/env.js';
import { logger } from '../config/logger.js';
import { runMigrations } from './migrate.js';

const env = loadEnv();
const pool = createDatabasePool(env);

try {
  await runMigrations(pool);
  logger.info('Migracje zakończone');
} finally {
  await pool.end();
}
