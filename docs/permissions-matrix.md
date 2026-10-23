# Macierz uprawnień — szkic

| Operacja | Administrator | Kierownik | Agent |
|---|---|---|---|
| Bootstrap pierwszego konta (`POST /api/auth/bootstrap`) | Tylko gdy brak użytkowników | Tylko gdy brak użytkowników | Tylko gdy brak użytkowników |
| Logowanie / wylogowanie / `me` | Tak | Tak | Tak |
| Odbiór i ręczne tworzenie zgłoszeń | Tak | Według polityki | Nie |
| Przekazywanie zgłoszeń kierownikowi | Tak | Nie dotyczy | Nie |
| Przeglądanie pracowników | Tak | Tak | Nie |
| Tworzenie kont i nadawanie ról (`POST /api/users`) | Tak | Nie | Nie |
| Przydzielanie zadań | Tak, jeśli dopuszczone | Tak | Nie |
| Przegląd wszystkich zadań | Tak | Tak | Nie |
| Przegląd własnych zadań | Tak | Tak | Tak |
| Zmiana statusu własnego zadania | Tak | Tak | Tak |
| Konfiguracja systemu | Tak | Nie | Nie |

Wymuszaj te uprawnienia po stronie backendu, nie tylko w interfejsie.

## Przepływ rejestracji i sesji

- Publiczna samo-rejestracja jest wyłączona. Interfejs pokazuje logowanie i nie udostępnia formularza tworzenia zwykłego konta.
- Podczas pierwszej konfiguracji można utworzyć konto administratora przez `POST /api/auth/bootstrap`. API dopuszcza to wyłącznie, gdy nie ma jeszcze użytkowników; po utworzeniu konta bootstrap przestaje działać.
- Administrator tworzy kolejne konta przez `POST /api/users`. Kierownik i agent nie mają do tego uprawnień.
- Logowanie korzysta z `POST /api/auth/login`; aplikacja przesyła cookie sesyjne także przy sprawdzaniu `GET /api/auth/me` i wylogowaniu przez `POST /api/auth/logout`.
- Formularz bootstrapu wymaga imienia, nazwiska, poprawnego e-maila oraz hasła o długości co najmniej 12 znaków zawierającego literę i cyfrę. Walidacja serwera pozostaje źródłem prawdy.
- UI nie stanowi kontroli dostępu. Każde chronione żądanie jest sprawdzane przez API.
