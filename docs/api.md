# API

## Zdrowie

`GET /api/health` — `{ "status": "ok" }`

## Uwierzytelnianie i rejestracja

Wszystkie odpowiedzi błędów: `{ "error": { "code": string, "message": string } }`.

### `POST /api/auth/bootstrap`

Tworzy pierwszego administratora, gdy nie ma jeszcze użytkowników. Ustawia sesję.

Ciało: `{ email, password, firstName, lastName }`

Hasło: min. 12 znaków, litera i cyfra.

### `POST /api/auth/login`

Ciało: `{ email, password }`. Przy błędzie zawsze ten sam komunikat (bez enumeracji kont).

### `POST /api/auth/logout`

Niszczy sesję. `204`.

### `GET /api/auth/me`

Zwraca zalogowanego użytkownika. `401` bez sesji.

### `POST /api/users`

Tylko rola `administrator`. Tworzy konto pracownika.

Ciało:

```json
{
  "email": "agent@example.com",
  "password": "AgentHaslo123",
  "role": "administrator | manager | agent",
  "employee": { "firstName": "Piotr", "lastName": "Lis" }
}
```

`employee` jest opcjonalne. `201` + `{ user }` bez `passwordHash`.

`401` bez sesji, `403` dla kierownika i agenta, `409` przy konflikcie e-maila.
