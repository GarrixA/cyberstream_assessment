# CyberStream Backend

Express + TypeScript API backend for CyberStream.

## Getting started

```bash
cp .env-example .env
npm install
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm test` | Run tests with coverage |
| `npm run lint` | Run ESLint |

## Routes

| Route | Description |
|-------|-------------|
| `GET /` | HTML welcome page |
| `GET /health` | Health check |
| `GET /api/v1` | JSON welcome message |
| `GET /api/v1/docs` | Swagger UI |

## Docker

Docker reads your existing `DB_DEV_URL` and `DB_TEST_URL` values. Inside containers, `localhost` is rewritten to the `postgresdb` service automatically.

```bash
docker compose up --build
```
