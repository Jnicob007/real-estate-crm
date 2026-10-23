# Wdrożenie

1. Skonfiguruj środowisko i sekrety poza repozytorium (`DATABASE_URL`, `SESSION_SECRET` min. 32 znaki, `WEB_ORIGIN`).
2. Przygotuj MySQL i wykonaj `npm run db:migrate --workspace server`. Nie uruchamiaj migracji automatycznie przy starcie API.
3. Zbuduj frontend i backend.
4. Skonfiguruj HTTPS, logowanie, kopie zapasowe i monitoring.
5. Sprawdź procedurę odtwarzania kopii zapasowej.
