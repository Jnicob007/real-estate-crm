import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { UserService } from '../users/user.service.js';
import { errors } from '../../utils/errors.js';

export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UserService,
  ) {}

  bootstrap = async (req: Request, res: Response) => {
    const user = await this.auth.bootstrap(req.body);
    await this.createSession(req, user.id);
    res.status(201).json({ user });
  };

  login = async (req: Request, res: Response) => {
    const user = await this.auth.login(req.body);
    await this.createSession(req, user.id);
    res.status(200).json({ user });
  };

  logout = async (req: Request, res: Response) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    res.status(204).send();
  };

  me = async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (!userId) {
      throw errors.unauthorized();
    }
    const user = await this.users.getRegisteredUser(userId);
    res.status(200).json({ user });
  };

  private async createSession(req: Request, userId: string) {
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) {
          reject(error);
          return;
        }
        req.session.userId = userId;
        resolve();
      });
    });
  }
}
