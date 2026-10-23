# Schemat bazy danych

Migracje: `database/migrations/`. Uruchomienie: `npm run db:migrate --workspace server`.

## `001_users_employees_sessions.sql`

- `users` — konto logowania: `id`, unikalny `email` (normalizowany do małych liter), `password_hash`, `role` (`administrator` | `manager` | `agent`), `is_active`. Hasło nigdy nie jest przechowywane jawnym tekstem.
- `employees` — profil pracownika `1:0..1` z `users` (`user_id` unikalny, FK, bez kaskadowego usuwania).
- `audit_logs` — operacje administracyjne (`user.create`, `user.bootstrap`) bez haseł.
- `sessions` — zarezerwowane pod trwały magazyn sesji; na razie API używa magazynu pamięciowego `express-session` (do produkcji należy podłączyć tabelę lub Redis).
- `schema_migrations` — tworzone przez runner migracji.

Wycofanie `001`: usunąć tabele w odwrotnej kolejności (`sessions`, `audit_logs`, `employees`, `users`, `schema_migrations`) tylko na środowisku bez danych produkcyjnych.
