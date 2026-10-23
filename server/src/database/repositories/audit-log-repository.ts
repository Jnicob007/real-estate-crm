import type { DbClient } from '../db-client.js';

export type AuditLogRecord = {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata?: Record<string, unknown>;
};

export class AuditLogRepository {
  constructor(private readonly db: DbClient) {}

  async record(entry: AuditLogRecord) {
    await this.db.query(
      `INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, metadata_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.actorUserId,
        entry.action,
        entry.entityType,
        entry.entityId,
        entry.metadata ? JSON.stringify(entry.metadata) : null,
      ],
    );
  }
}
