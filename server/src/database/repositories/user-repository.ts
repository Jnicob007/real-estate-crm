import type { UserRole } from '@real-estate-crm/shared-types';
import type { RowDataPacket } from 'mysql2/promise';
import type { DbClient } from '../db-client.js';
import { toPublicUser, type UserRow } from '../mappers.js';

type UserRowPacket = UserRow & RowDataPacket;

export type NewUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export class UserRepository {
  constructor(private readonly db: DbClient) {}

  async count(): Promise<number> {
    const [rows] = await this.db.query<Array<{ total: number } & RowDataPacket>>(
      'SELECT COUNT(*) AS total FROM users',
    );
    return Number(rows[0]?.total ?? 0);
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await this.db.query<UserRowPacket[]>(
      'SELECT id, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [email],
    );
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<UserRow | null> {
    const [rows] = await this.db.query<UserRowPacket[]>(
      'SELECT id, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  }

  async findPublicById(id: string) {
    const row = await this.findById(id);
    return row ? toPublicUser(row) : null;
  }

  async create(record: NewUserRecord) {
    await this.db.query(
      `INSERT INTO users (id, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [record.id, record.email, record.passwordHash, record.role],
    );
  }
}
