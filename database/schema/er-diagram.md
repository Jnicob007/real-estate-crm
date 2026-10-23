# Schemat relacji — szkic

- `users` 1:0..1 `employees`
- `users` 1:N `audit_logs` (jako aktor; `ON DELETE SET NULL`)
- `users` 1:N `notifications`
- `leads` 1:N `tasks`
- `employees` 1:N `tasks` (jako przypisany agent)
- `tasks` 1:N `task_history`
- `leads` 1:N `lead_history`

## Kolumny rejestracji (`001`)

`users(id, email UNIQUE, password_hash, role, is_active, created_at, updated_at)`
`employees(id, user_id UNIQUE FK, first_name, last_name, employment_status, created_at)`
`audit_logs(id, actor_user_id FK NULL, action, entity_type, entity_id, metadata_json, created_at)`
