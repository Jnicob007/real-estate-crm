import mysql from 'mysql2/promise';
import type { AppEnv } from './env.js';

export type DatabasePool = mysql.Pool;

export function createDatabasePool(env: AppEnv): DatabasePool {
  return mysql.createPool({
    uri: env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    timezone: 'Z',
  });
}
