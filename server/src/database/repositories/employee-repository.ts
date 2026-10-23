import type { RowDataPacket } from 'mysql2/promise';
import type { DbClient } from '../db-client.js';
import { toEmployeeProfile, type EmployeeRow } from '../mappers.js';

type EmployeeRowPacket = EmployeeRow & RowDataPacket;

export type NewEmployeeRecord = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
};

export class EmployeeRepository {
  constructor(private readonly db: DbClient) {}

  async create(record: NewEmployeeRecord) {
    await this.db.query(
      `INSERT INTO employees (id, user_id, first_name, last_name, employment_status)
       VALUES (?, ?, ?, ?, 'active')`,
      [record.id, record.userId, record.firstName, record.lastName],
    );
  }

  async findByUserId(userId: string) {
    const [rows] = await this.db.query<EmployeeRowPacket[]>(
      `SELECT id, user_id, first_name, last_name, employment_status, created_at
       FROM employees WHERE user_id = ? LIMIT 1`,
      [userId],
    );
    return rows[0] ? toEmployeeProfile(rows[0]) : null;
  }
}
