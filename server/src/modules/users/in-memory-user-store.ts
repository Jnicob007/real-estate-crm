import type { UserRole } from '@real-estate-crm/shared-types';
import { toEmployeeProfile, toPublicUser, type EmployeeRow, type UserRow } from '../../database/mappers.js';
import type { AuditLogRecord } from '../../database/repositories/audit-log-repository.js';
import type { NewEmployeeRecord } from '../../database/repositories/employee-repository.js';
import type { NewUserRecord } from '../../database/repositories/user-repository.js';
import type { UserWriteStore } from './user.service.js';

export function createInMemoryUserStore(): UserWriteStore & {
  userRows: Map<string, UserRow>;
  employeeRows: Map<string, EmployeeRow>;
  recordedAudits: AuditLogRecord[];
} {
  const userRows = new Map<string, UserRow>();
  const employeeRows = new Map<string, EmployeeRow>();
  const recordedAudits: AuditLogRecord[] = [];

  const users = {
    async count() {
      return userRows.size;
    },
    async findByEmail(email: string) {
      return [...userRows.values()].find((row) => row.email === email) ?? null;
    },
    async findById(id: string) {
      return userRows.get(id) ?? null;
    },
    async findPublicById(id: string) {
      const row = userRows.get(id);
      return row ? toPublicUser(row) : null;
    },
    async create(record: NewUserRecord) {
      const now = new Date();
      userRows.set(record.id, {
        id: record.id,
        email: record.email,
        password_hash: record.passwordHash,
        role: record.role as UserRole,
        is_active: 1,
        created_at: now,
        updated_at: now,
      });
    },
  };

  const employees = {
    async create(record: NewEmployeeRecord) {
      employeeRows.set(record.userId, {
        id: record.id,
        user_id: record.userId,
        first_name: record.firstName,
        last_name: record.lastName,
        employment_status: 'active',
        created_at: new Date(),
      });
    },
    async findByUserId(userId: string) {
      const row = employeeRows.get(userId);
      return row ? toEmployeeProfile(row) : null;
    },
  };

  const auditLogs = {
    async record(entry: AuditLogRecord) {
      recordedAudits.push(entry);
    },
  };

  return {
    userRows,
    employeeRows,
    recordedAudits,
    users: users as UserWriteStore['users'],
    employees: employees as UserWriteStore['employees'],
    auditLogs: auditLogs as UserWriteStore['auditLogs'],
  };
}
