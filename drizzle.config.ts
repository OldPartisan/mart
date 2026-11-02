import { defineConfig } from "drizzle-kit";

/**
 * Схема одинакова для локального PGlite и продакшен-PostgreSQL.
 * `pnpm db:generate` создаёт SQL-миграции, которые применяются автоматически
 * при первом обращении к БД (см. src/db/index.ts).
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/irbis_mart",
  },
  strict: false,
  verbose: true,
});
