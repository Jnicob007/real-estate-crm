import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AppError } from '../../utils/errors.js';
import { createInMemoryUserStore } from '../users/in-memory-user-store.js';
import { UserService } from '../users/user.service.js';
import { AuthService } from './auth.service.js';

const password = 'Administrator1';

function createAuth() {
  const store = createInMemoryUserStore();
  const userService = new UserService(null, store);
  const auth = new AuthService(store.users, userService);
  return { store, userService, auth };
}

describe('AuthService', () => {
  it('tworzy pierwszego administratora przez bootstrap', async () => {
    const { auth } = createAuth();
    const user = await auth.bootstrap({
      email: 'admin@example.com',
      password,
      firstName: 'Anna',
      lastName: 'Nowak',
    });

    assert.equal(user.role, 'administrator');
    assert.equal(user.employee?.lastName, 'Nowak');
  });

  it('blokuje bootstrap, gdy użytkownicy już istnieją', async () => {
    const { auth } = createAuth();
    const payload = {
      email: 'admin@example.com',
      password,
      firstName: 'Anna',
      lastName: 'Nowak',
    };
    await auth.bootstrap(payload);

    await assert.rejects(() => auth.bootstrap({ ...payload, email: 'other@example.com' }), (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.code, 'BOOTSTRAP_UNAVAILABLE');
      return true;
    });
  });

  it('loguje aktywnego użytkownika i ukrywa istnienie konta przy błędzie', async () => {
    const { auth } = createAuth();
    await auth.bootstrap({
      email: 'admin@example.com',
      password,
      firstName: 'Anna',
      lastName: 'Nowak',
    });

    const loggedIn = await auth.login({ email: 'admin@example.com', password });
    assert.equal(loggedIn.email, 'admin@example.com');

    await assert.rejects(
      () => auth.login({ email: 'missing@example.com', password }),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.code, 'INVALID_CREDENTIALS');
        return true;
      },
    );

    await assert.rejects(
      () => auth.login({ email: 'admin@example.com', password: 'zleHaslo1234' }),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.code, 'INVALID_CREDENTIALS');
        return true;
      },
    );
  });
});
