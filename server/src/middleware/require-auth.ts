import type { NextFunction, Request, Response } from 'express';
import type { UserRepository } from '../database/repositories/user-repository.js';
import { errors } from '../utils/errors.js';

export function createRequireAuth(userRepository: UserRepository) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        throw errors.unauthorized();
      }

      const user = await userRepository.findPublicById(userId);
      if (!user || !user.isActive) {
        req.session.userId = undefined;
        throw errors.unauthorized();
      }

      req.currentUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}
