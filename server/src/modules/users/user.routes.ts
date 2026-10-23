import { createUserSchema } from '@real-estate-crm/validation';
import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { validateBody } from '../../middleware/validate.js';
import { requireRole } from '../../middleware/require-role.js';
import type { UserController } from './user.controller.js';
import type { RequestHandler } from 'express';

export function createUserRouter(controller: UserController, requireAuth: RequestHandler) {
  const router = Router();
  router.post(
    '/',
    requireAuth,
    requireRole('administrator'),
    validateBody(createUserSchema),
    asyncHandler(controller.create),
  );
  return router;
}
