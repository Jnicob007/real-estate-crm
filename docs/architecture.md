# Architektura systemu

Monorepo z frontendem React, API Express, wspólnymi kontraktami i bazą MySQL.

## Warstwy backendu

1. **Trasy** (`server/src/modules/*/ *.routes.ts`) — mapują HTTP, walidację i middleware uprawnień.
2. **Kontrolery** — cienkie: odczyt żądania, wywołanie usługi, odpowiedź.
3. **Usługi** — reguły biznesowe (rejestracja, bootstrap, logowanie).
4. **Repozytoria** — parametryzowane zapytania MySQL, bez logiki biznesowej.

Wspólne typy są w `packages/shared-types`, schematy Zod w `packages/validation`, ścieżki i kształty odpowiedzi w `packages/api-contracts`.

## Rejestracja użytkowników

Publiczna samo-rejestracja nie istnieje. Konta tworzy wyłącznie administrator (`POST /api/users`).

Pierwsze konto administratora powstaje przez `POST /api/auth/bootstrap`, tylko gdy tabela `users` jest pusta. Potem bootstrap jest wyłączony.

Konto (`users`) i profil pracownika (`employees`) są osobnymi bytami; profil można utworzyć w tej samej transakcji co konto.

Sesja cookie (`crm.sid`) wiąże żądania z `users.id`. Hasła są hashowane (bcrypt), nigdy nie wracają w JSON i nie trafiają do logów ani audytu.
