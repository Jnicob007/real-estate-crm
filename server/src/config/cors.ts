import type { CorsOptions } from 'cors';
import type { AppEnv } from './env.js';

export function createCorsOptions(env: AppEnv): CorsOptions {
  return {
    origin: env.WEB_ORIGIN,
    credentials: true,
  };
}
