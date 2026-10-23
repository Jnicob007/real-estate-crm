# Schemat relacji — szkic

- `users` 1:0..1 `employees`
- `users` 1:N `notifications`
- `leads` 1:N `tasks`
- `employees` 1:N `tasks` (jako przypisany agent)
- `tasks` 1:N `task_history`
- `leads` 1:N `lead_history`

To wstępny model logiczny; dokładne kolumny, ograniczenia i indeksy należy ustalić przed migracjami produkcyjnymi.
