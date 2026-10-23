import type { Request, Response } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  constructor(private readonly users: UserService) {}

  create = async (req: Request, res: Response) => {
    const actor = req.currentUser;
    if (!actor) {
      throw new Error('create wymaga requireAuth');
    }

    const user = await this.users.registerUser(req.body, actor);
    res.status(201).json({ user });
  };
}
