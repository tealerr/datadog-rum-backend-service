# Datadog Synthetic Mock API

Backend playground for Datadog Synthetic API tests.

## Run

```bash
npm start
```

The service listens on `http://localhost:3000`. Set `PORT` to use another port.
Copy `.env.example` to `.env` and set `LOGIN_ENCRYPTION_KEY` to the same value
used by the frontend encryption logic.

### Run with Docker Compose

```bash
docker compose up --build
```

The service is available at `http://localhost:3000`. To change the published
port or protected-endpoint API key, set `APP_PORT` or `SYNTHETIC_API_KEY`:

```bash
APP_PORT=8080 SYNTHETIC_API_KEY=my-secret docker compose up --build
```

Stop and remove the container with `docker compose down`.

## Test endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Availability and JSON schema assertions |
| GET | `/api/status/:code` | HTTP status assertions, from 200 to 599 |
| GET | `/api/delay/:milliseconds` | Response-time tests, up to 10 seconds |
| ANY | `/api/echo` | Request method, query, header, and body assertions |
| POST | `/api/auth/token` | Multi-step token extraction test |
| POST | `/api/login` | Validate login credentials against `src/data/users.js` |
| GET | `/api/protected` | API-key authentication test |

`POST /api/login` expects an AES-256-GCM encrypted `password` using the shared
`LOGIN_ENCRYPTION_KEY`. Send it as `iv:authTag:ciphertext`, with each part Base64
encoded. The backend decrypts the value and compares it with `src/data/users.js`.

Default credentials for the mock token endpoint:

```json
{
  "username": "synthetic-user",
  "password": "synthetic-password"
}
```

The protected endpoint accepts either `Authorization: Bearer synthetic-test-token` or `x-api-key: synthetic-api-key`. Override the API key with the `SYNTHETIC_API_KEY` environment variable outside local development.

## Suggested Datadog assertions

For `/api/health`, assert status `200`, response time below your threshold, and JSONPath `$.status` equals `ok`.

For a multi-step test, call `/api/auth/token`, extract `$.accessToken`, then call `/api/protected` with `Authorization: Bearer {{ACCESS_TOKEN}}`. Use `/api/status/500` and `/api/delay/3000` to verify alert behavior.

## Automated tests

```bash
npm test
```
