# Backend

## Odpowiedzialność
Node.js, Express, API i reguły biznesowe.

## Reguły
- Utrzymuj podział na routes, controllers, services i repositories.
- Kontrolery powinny być cienkie; reguły biznesowe umieszczaj w usługach.
- Waliduj dane na granicy API.
- Używaj transakcji przy operacjach wymagających atomowości.
- Centralizuj obsługę błędów i logowanie.

## Przed zmianą
- Sprawdź wpływ na API i współdzielone kontrakty.
- Dodaj testy dla ścieżek poprawnych i błędnych.
