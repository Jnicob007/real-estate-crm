import { apiPaths } from '@real-estate-crm/api-contracts';
import { bootstrapAdminSchema, loginSchema } from '@real-estate-crm/validation';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../../utils/async-handler.js';
import { validateBody } from '../../middleware/validate.js';
import type { AuthController } from './auth.controller.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Zbyt wiele prób. Spróbuj ponownie później.',
    },
  },
});

export function createAuthRouter(controller: AuthController) {
  const router = Router();
  router.post(
    apiPaths.authBootstrap.replace('/api/auth', ''),
    authLimiter,
    validateBody(bootstrapAdminSchema),
    asyncHandler(controller.bootstrap),
  );
  router.post(
    apiPaths.authLogin.replace('/api/auth', ''),
    authLimiter,
    validateBody(loginSchema),
    asyncHandler(controller.login),
  );
  router.post(apiPaths.authLogout.replace('/api/auth', ''), asyncHandler(controller.logout));
  router.get(apiPaths.authMe.replace('/api/auth', ''), asyncHandler(controller.me));
  return router;
}
