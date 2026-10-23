# AGENTS.md — Real Estate CRM

## Cel projektu
System CRM dla agencji nieruchomości do obsługi zgłoszeń klientów, przydzielania zadań i zarządzania pracownikami.

## Proponowany stos
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Baza danych: MySQL
- Wspólne typy i walidacja: `packages/`

## Zasady ogólne
- Przed zmianą kodu zapoznaj się z odpowiednim plikiem w `agents/`.
- Nie mieszaj logiki interfejsu, logiki biznesowej i dostępu do bazy danych.
- Nie omijaj walidacji ani kontroli uprawnień.
- Nie duplikuj istniejącej logiki bez uzasadnienia.
- Aktualizuj testy i dokumentację po zmianach.
- Nie zapisuj sekretów ani haseł w repozytorium.
- Nie wykonuj destrukcyjnych migracji bez analizy wpływu na dane.

## Dokumentacja tematyczna
- Architektura: `agents/architecture.md`
- Frontend: `agents/frontend.md`
- Backend: `agents/backend.md`
- Baza danych: `agents/database.md`
- Logowanie i uprawnienia: `agents/authentication-authorization.md`
- Formularze publiczne: `agents/public-intake.md`
- Zgłoszenia: `agents/leads.md`
- Zadania: `agents/tasks.md`
- Pracownicy: `agents/employees.md`
- Powiadomienia: `agents/notifications.md`
- Integracja e-mail: `agents/email-integration.md`
- Testy: `agents/testing.md`
- Bezpieczeństwo: `agents/security.md`
- Wdrożenie: `agents/deployment.md`

## Przed zakończeniem pracy
1. Uruchom odpowiednie testy.
2. Sprawdź typy i lintowanie.
3. Zweryfikuj uprawnienia i walidację.
4. Zaktualizuj dokumentację, jeśli jest potrzebna.
5. Podsumuj zmienione pliki i znane ograniczenia.
