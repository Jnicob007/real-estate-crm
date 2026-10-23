import { apiPaths } from '@real-estate-crm/api-contracts';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import type { AppEnv } from './config/env.js';
import { createCorsOptions } from './config/cors.js';
import { errorHandler } from './middleware/error-handler.js';
import { createRequireAuth } from './middleware/require-auth.js';
import { createAuthRouter } from './modules/auth/auth.routes.js';
import type { AuthService } from './modules/auth/auth.service.js';
import { AuthController } from './modules/auth/auth.controller.js';
import { createUserRouter } from './modules/users/user.routes.js';
import { UserController } from './modules/users/user.controller.js';
import type { UserService } from './modules/users/user.service.js';
import type { UserRepository } from './database/repositories/user-repository.js';

export type AppDependencies = {
  env: AppEnv;
  users: UserRepository;
  userService: UserService;
  authService: AuthService;
};

export function createApp(deps: AppDependencies) {
  const app = express();
  const userController = new UserController(deps.userService);
  const authController = new AuthController(deps.authService, deps.userService);
  const requireAuth = createRequireAuth(deps.users);

  app.use(helmet());
  app.use(cors(createCorsOptions(deps.env)));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    session({
      name: 'crm.sid',
      secret: deps.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: deps.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60 * 1000,
      },
    }),
  );

  app.get(apiPaths.health, (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', createAuthRouter(authController));
  app.use('/api/users', createUserRouter(userController, requireAuth));
  app.use(errorHandler);

  return app;
}
