import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL jest wymagane.'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET musi mieć co najmniej 32 znaki.'),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join('; ');
    throw new Error(`Niepoprawna konfiguracja środowiska: ${details}`);
  }
  return parsed.data;
}
