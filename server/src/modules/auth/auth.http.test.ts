import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { createApp } from '../../app.js';
import type { AppEnv } from '../../config/env.js';
import { AuthService } from './auth.service.js';
import { createInMemoryUserStore } from '../users/in-memory-user-store.js';
import { UserService } from '../users/user.service.js';

const env: AppEnv = {
  NODE_ENV: 'test',
  PORT: 5000,
  DATABASE_URL: 'mysql://crm_user:change_me@localhost:3306/real_estate_crm',
  SESSION_SECRET: 'replace_with_a_long_random_secret',
  WEB_ORIGIN: 'http://localhost:5173',
};

function createTestApp() {
  const store = createInMemoryUserStore();
  const userService = new UserService(null, store);
  const authService = new AuthService(store.users, userService);
  const app = createApp({
    env,
    users: store.users,
    userService,
    authService,
  });
  return { app, store, userService };
}

describe('HTTP rejestracja i sesja', () => {
  it('odrzuca tworzenie konta bez sesji administratora', async () => {
    const { app } = createTestApp();
    const response = await request(app).post('/api/users').send({
      email: 'agent@example.com',
      password: 'AgentHaslo123',
      role: 'agent',
    });

    assert.equal(response.status, 401);
    assert.equal(response.body.error.code, 'UNAUTHORIZED');
  });

  it('po bootstrapie pozwala administratorowi zarejestrować agenta', async () => {
    const { app } = createTestApp();
    const agent = request.agent(app);

    const bootstrap = await agent.post('/api/auth/bootstrap').send({
      email: 'admin@example.com',
      password: 'Administrator1',
      firstName: 'Anna',
      lastName: 'Nowak',
    });
    assert.equal(bootstrap.status, 201);
    assert.equal(bootstrap.body.user.role, 'administrator');

    const forbidden = await request(app).post('/api/users').send({
      email: 'agent@example.com',
      password: 'AgentHaslo123',
      role: 'agent',
    });
    assert.equal(forbidden.status, 401);

    const created = await agent.post('/api/users').send({
      email: 'agent@example.com',
      password: 'AgentHaslo123',
      role: 'agent',
      employee: { firstName: 'Piotr', lastName: 'Lis' },
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.user.role, 'agent');
    assert.equal(created.body.user.employee.firstName, 'Piotr');
    assert.equal(created.body.user.passwordHash, undefined);

    const me = await agent.get('/api/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.body.user.email, 'admin@example.com');
  });

  it('odrzuca rejestrację, gdy zalogowany jest agent', async () => {
    const { app, userService } = createTestApp();
    const admin = await userService.registerUser(
      {
        email: 'admin@example.com',
        password: 'Administrator1',
        role: 'administrator',
      },
      null,
    );
    await userService.registerUser(
      {
        email: 'agent@example.com',
        password: 'AgentHaslo123',
        role: 'agent',
      },
      admin,
    );

    const agent = request.agent(app);
    const login = await agent.post('/api/auth/login').send({
      email: 'agent@example.com',
      password: 'AgentHaslo123',
    });
    assert.equal(login.status, 200);

    const response = await agent.post('/api/users').send({
      email: 'kierownik@example.com',
      password: 'Kierownik1234',
      role: 'manager',
    });
    assert.equal(response.status, 403);
    assert.equal(response.body.error.code, 'FORBIDDEN');
  });
});
