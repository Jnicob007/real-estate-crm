import type { Pool, PoolConnection } from 'mysql2/promise';

export type DbClient = Pool | PoolConnection;
