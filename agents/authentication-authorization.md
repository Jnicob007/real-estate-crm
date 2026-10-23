# Uwierzytelnianie i autoryzacja

## Odpowiedzialność
Logowanie, wylogowanie, sesje i kontrola dostępu na podstawie ról.

## Role
- Administrator
- Kierownik
- Agent

## Reguły
- Tworzenie kont i nadawanie ról jest dostępne tylko dla administratora.
- Autoryzację sprawdzaj na backendzie przy każdym chronionym żądaniu.
- Agent może odczytywać i zmieniać tylko dozwolone mu zadania.
- Stosuj bezpieczne hashowanie haseł i ograniczanie prób logowania.
- Nie ujawniaj, czy konkretny e-mail istnieje, jeśli mogłoby to ułatwiać enumerację kont.

## Przed zmianą
- Zaktualizuj `docs/permissions-matrix.md`.
- Dodaj testy negatywne dla prób dostępu bez uprawnień.
