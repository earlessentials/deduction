# THE LUCID HOUR

A playable full-stack TypeScript MVP for Case 001: THE LUCID HOUR, a reasoning-based detective deduction game.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- SQLite
- Prisma ORM
- JSON seed data
- Vitest validation tests

## Setup

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
```

The project includes `.env` with:

```bash
DATABASE_URL="file:./dev.db"
```

## Run Locally

```bash
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Seed Database

```bash
npm run db:push
npm run db:seed
```

The app can fall back to the JSON files during development, but the SQLite path is the intended full-stack flow.

## Run Tests

```bash
npm test
```

The tests cover the final deduction validator and confirm that naming the culprit alone is not enough to win.

## Edit Case Data

Player-facing case data lives in:

- `data/case.json`
- `data/characters.json`
- `data/locations.json`
- `data/evidence.json`
- `data/interviews.json`
- `data/public-timeline.json`
- `data/true-timeline.json`
- `data/relationships.json`

The definitive answer and validation requirements live separately in:

- `data/solution-hidden.json`

Do not import `solution-hidden.json` into client components. Keep it server-side for validation only.
