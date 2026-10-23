# Real Estate CRM

Szkielet projektu CRM dla agencji nieruchomości. Repozytorium zakłada oddzielenie aplikacji webowej, API, współdzielonych kontraktów i schematu bazy danych.

## Role
- **Administrator** — odbiera zgłoszenia, tworzy zgłoszenia z wiadomości e-mail i zarządza kontami.
- **Kierownik** — przegląda zgłoszenia i przydziela zadania pracownikom.
- **Agent** — widzi przypisane zadania, terminy i aktualizuje status.

## Typy zgłoszeń
- Klient poszukujący nieruchomości do kupna lub wynajmu.
- Klient oferujący nieruchomość na sprzedaż lub wynajem.

## Backend — rejestracja

Kont nie zakłada się publicznie. Pierwszy administrator: `POST /api/auth/bootstrap`. Kolejne konta: `POST /api/users` (sesja administratora). Szczegóły: `docs/api.md` i `docs/architecture.md`.

Migracje MySQL: `npm run db:migrate --workspace server`.

## Status
Szkielet aplikacji z pierwszą warstwą rejestracji i sesji po stronie API. Wiele katalogów modułów nadal zawiera `.gitkeep`.
