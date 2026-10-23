import type { EmployeeProfile, PublicUser, UserRole, EmploymentStatus } from '@real-estate-crm/shared-types';

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export type EmployeeRow = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  employment_status: EmploymentStatus;
  created_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export function toEmployeeProfile(row: EmployeeRow): EmployeeProfile {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    employmentStatus: row.employment_status,
    createdAt: toIso(row.created_at),
  };
}
