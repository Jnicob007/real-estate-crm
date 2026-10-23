import type { RegisteredUser } from '@real-estate-crm/shared-types';

export const apiPaths = {
  health: '/api/health',
  authBootstrap: '/api/auth/bootstrap',
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  authMe: '/api/auth/me',
  users: '/api/users',
} as const;

export type HealthResponse = {
  status: 'ok';
};

export type SessionUserResponse = {
  user: RegisteredUser;
};

export type CreateUserResponse = {
  user: RegisteredUser;
};
