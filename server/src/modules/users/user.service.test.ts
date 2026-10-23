import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AppError } from '../../utils/errors.js';
import { createInMemoryUserStore } from './in-memory-user-store.js';
import { UserService } from './user.service.js';

const password = 'Administrator1';

describe('UserService.registerUser', () => {
  it('tworzy konto i profil pracownika bez zwracania hasha hasła', async () => {
    const store = createInMemoryUserStore();
    const service = new UserService(null, store);

    const user = await service.registerUser(
      {
        email: 'Admin@example.com',
        password,
        role: 'administrator',
        employee: { firstName: 'Anna', lastName: 'Kowalska' },
      },
      null,
    );

    assert.equal(user.email, 'admin@example.com');
    assert.equal(user.role, 'administrator');
    assert.equal(user.employee?.firstName, 'Anna');
    assert.equal(store.recordedAudits[0]?.action, 'user.bootstrap');
    assert.equal('passwordHash' in user, false);
    assert.ok(!JSON.stringify(user).includes(password));
  });

  it('odrzuca duplikat e-maila', async () => {
    const store = createInMemoryUserStore();
    const service = new UserService(null, store);
    const input = {
      email: 'agent@example.com',
      password,
      role: 'agent' as const,
    };

    await service.registerUser(input, null);

    await assert.rejects(() => service.registerUser(input, null), (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.statusCode, 409);
      return true;
    });
  });
});
