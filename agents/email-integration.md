# Integracja e-mail

## Odpowiedzialność
Integracja skrzynki pocztowej i tworzenie zgłoszeń na podstawie wiadomości.

## Reguły
- Nie zakładaj, że integracja e-mail działa, dopóki nie zostanie skonfigurowany dostawca.
- Przechowuj identyfikator wiadomości dostawcy, aby wykrywać duplikaty.
- Traktuj treść e-mail jako niezaufane dane wejściowe.
- Nie zapisuj haseł do skrzynki ani tokenów w repozytorium.
- Obsługuj błędy i ponawianie przetwarzania.

## Przed zmianą
- Udokumentuj wymagane sekrety i ustawienia środowiska.
- Przetestuj duplikaty, nieprawidłowe wiadomości i błędy dostawcy.
