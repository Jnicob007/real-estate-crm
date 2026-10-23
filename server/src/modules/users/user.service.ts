import { randomUUID } from 'node:crypto';
import type { CreateUserInput, PublicUser, RegisteredUser } from '@real-estate-crm/shared-types';
import type { Pool } from 'mysql2/promise';
import { AuditLogRepository } from '../../database/repositories/audit-log-repository.js';
import { EmployeeRepository } from '../../database/repositories/employee-repository.js';
import { UserRepository } from '../../database/repositories/user-repository.js';
import { toPublicUser } from '../../database/mappers.js';
import { errors } from '../../utils/errors.js';
import { normalizeEmail } from './email.js';
import { hashPassword } from './password.js';

export type UserWriteStore = {
  users: UserRepository;
  employees: EmployeeRepository;
  auditLogs: AuditLogRepository;
};

export class UserService {
  constructor(
    private readonly pool: Pick<Pool, 'getConnection'> | null,
    private readonly store: UserWriteStore,
  ) {}

  async registerUser(input: CreateUserInput, actor: PublicUser | null): Promise<RegisteredUser> {
    const email = normalizeEmail(input.email);
    const existing = await this.store.users.findByEmail(email);
    if (existing) {
      throw errors.conflict('Nie można utworzyć konta dla podanego adresu e-mail.');
    }

    const userId = randomUUID();
    const employeeId = input.employee ? randomUUID() : null;
    const passwordHash = await hashPassword(input.password);

    await this.withTransaction(async (store) => {
      await store.users.create({
        id: userId,
        email,
        passwordHash,
        role: input.role,
      });

      if (input.employee && employeeId) {
        await store.employees.create({
          id: employeeId,
          userId,
          firstName: input.employee.firstName,
          lastName: input.employee.lastName,
        });
      }

      await store.auditLogs.record({
        id: randomUUID(),
        actorUserId: actor?.id ?? userId,
        action: actor ? 'user.create' : 'user.bootstrap',
        entityType: 'user',
        entityId: userId,
        metadata: {
          role: input.role,
          hasEmployeeProfile: Boolean(input.employee),
        },
      });
    });

    return this.getRegisteredUser(userId);
  }

  async getRegisteredUser(userId: string): Promise<RegisteredUser> {
    const row = await this.store.users.findById(userId);
    if (!row) {
      throw errors.notFound('Nie znaleziono użytkownika.');
    }

    const employee = await this.store.employees.findByUserId(userId);
    return {
      ...toPublicUser(row),
      employee,
    };
  }

  private async withTransaction(work: (store: UserWriteStore) => Promise<void>) {
    if (!this.pool) {
      await work(this.store);
      return;
    }

    const connection = await this.pool.getConnection();
    const store: UserWriteStore = {
      users: new UserRepository(connection),
      employees: new EmployeeRepository(connection),
      auditLogs: new AuditLogRepository(connection),
    };

    try {
      await connection.beginTransaction();
      await work(store);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
