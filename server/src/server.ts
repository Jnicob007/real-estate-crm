import 'dotenv/config';
import { createApp } from './app.js';
import { createDatabasePool } from './config/database.js';
import { loadEnv } from './config/env.js';
import { logger } from './config/logger.js';
import { AuditLogRepository } from './database/repositories/audit-log-repository.js';
import { EmployeeRepository } from './database/repositories/employee-repository.js';
import { UserRepository } from './database/repositories/user-repository.js';
import { AuthService } from './modules/auth/auth.service.js';
import { UserService } from './modules/users/user.service.js';

const env = loadEnv();
const pool = createDatabasePool(env);
const users = new UserRepository(pool);
const userService = new UserService(pool, {
  users,
  employees: new EmployeeRepository(pool),
  auditLogs: new AuditLogRepository(pool),
});
const authService = new AuthService(users, userService);
const app = createApp({
  env,
  users,
  userService,
  authService,
});

app.listen(env.PORT, () => {
  logger.info('CRM API nasłuchuje', { port: env.PORT });
});
