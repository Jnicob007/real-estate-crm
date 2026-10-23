import type { UserRole } from '@real-estate-crm/shared-types';
import type { NextFunction, Request, Response } from 'express';
import { errors } from '../utils/errors.js';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (!user) {
      next(errors.unauthorized());
      return;
    }
    if (!roles.includes(user.role)) {
      next(errors.forbidden());
      return;
    }
    next();
  };
}
