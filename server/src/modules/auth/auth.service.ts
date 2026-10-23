import type { BootstrapAdminInput, LoginInput, RegisteredUser } from '@real-estate-crm/shared-types';
import { UserRepository } from '../../database/repositories/user-repository.js';
import { errors } from '../../utils/errors.js';
import { normalizeEmail } from '../users/email.js';
import { verifyPassword } from '../users/password.js';
import { UserService } from '../users/user.service.js';

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly userService: UserService,
  ) {}

  async bootstrap(input: BootstrapAdminInput): Promise<RegisteredUser> {
    const userCount = await this.users.count();
    if (userCount > 0) {
      throw errors.bootstrapUnavailable();
    }

    return this.userService.registerUser(
      {
        email: input.email,
        password: input.password,
        role: 'administrator',
        employee: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      },
      null,
    );
  }

  async login(input: LoginInput): Promise<RegisteredUser> {
    const user = await this.users.findByEmail(normalizeEmail(input.email));
    if (!user || !user.is_active) {
      throw errors.invalidCredentials();
    }

    const passwordMatches = await verifyPassword(input.password, user.password_hash);
    if (!passwordMatches) {
      throw errors.invalidCredentials();
    }

    return this.userService.getRegisteredUser(user.id);
  }
}
