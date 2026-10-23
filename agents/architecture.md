# Architektura

## Odpowiedzialność
Definiuje granice modułów, zależności oraz przepływy między frontendem, API i bazą danych.

## Reguły
- Trzymaj UI, reguły biznesowe i dostęp do danych w oddzielnych warstwach.
- Moduły komunikują się przez jawne interfejsy.
- Unikaj cyklicznych zależności i importowania prywatnych elementów innych modułów.
- Zgłoszenie klienta (`lead`) jest odrębnym bytem od zadania (`task`); jedno zgłoszenie może mieć wiele zadań.

## Przed zmianą
- Sprawdź, czy zmiana narusza granice modułów.
- Zaktualizuj `docs/architecture.md` i testy, jeśli to potrzebne.
