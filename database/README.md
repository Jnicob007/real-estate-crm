# Baza danych

Docelowa baza: MySQL. Schemat należy rozwijać przez migracje w `migrations/`.

Migracja `001_users_employees_sessions.sql` dodaje `users`, `employees`, `audit_logs` i `sessions`. Dalsze encje: leads, tasks, task_history, lead_history, notifications, email_messages.

Przed wdrożeniem ustal dokładny schemat, klucze obce, indeksy, retencję danych i strategię kopii zapasowych.
