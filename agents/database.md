# Baza danych

## Odpowiedzialność
Schemat MySQL, migracje, relacje, indeksy i integralność danych.

## Reguły
- Zmiany schematu wykonuj przez wersjonowane migracje.
- Używaj kluczy obcych, indeksów i ograniczeń odpowiednich do relacji.
- Nie przechowuj haseł w postaci jawnej — tylko bezpieczne hashe.
- Nie używaj danych produkcyjnych w seedach developerskich.
- Chroń istniejące dane przed destrukcyjnymi zmianami.

## Przed zmianą
- Określ strategię migracji i ewentualnego wycofania.
- Zaktualizuj `docs/database-schema.md`.
