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
