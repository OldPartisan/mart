import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "node:path";
import fs from "node:fs";
import * as schema from "./schema";
import { seedDatabase } from "./seed-data";

export type AppDb = PgliteDatabase<typeof schema>;

type DbGlobal = {
  promise?: Promise<AppDb>;
  client?: PGlite | ReturnType<typeof postgres>;
};

const globalForDb = globalThis as unknown as { __irbisDb?: DbGlobal };

/**
 * Локально по умолчанию используется PGlite — полноценный PostgreSQL,
 * скомпилированный в WASM. Данные лежат в ./.data/pglite и переживают
 * перезапуски. Если задан DATABASE_URL, подключается обычный PostgreSQL
 * (Supabase / Neon / собственный сервер) — схема и SQL идентичны.
 */
async function createDb(): Promise<AppDb> {
  const url = process.env.DATABASE_URL?.trim();
  const migrationsFolder = path.join(process.cwd(), "src/db/migrations");

  if (url) {
    const client = postgres(url, { max: 10, idle_timeout: 20, prepare: false });
    const db = drizzlePostgres(client, { schema }) as unknown as AppDb;
    await migratePostgres(db as never, { migrationsFolder });
    await seedDatabase(db);
    globalForDb.__irbisDb = { ...globalForDb.__irbisDb, client };
    return db;
  }

  const dataDir = path.join(process.cwd(), ".data/pglite");
  fs.mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  await client.waitReady;
  const db = drizzlePglite(client, { schema });
  await migratePglite(db, { migrationsFolder });
  await seedDatabase(db);
  globalForDb.__irbisDb = { ...globalForDb.__irbisDb, client };
  return db;
}

export async function getDb(): Promise<AppDb> {
  if (!globalForDb.__irbisDb) globalForDb.__irbisDb = {};
  if (!globalForDb.__irbisDb.promise) {
    globalForDb.__irbisDb.promise = createDb().catch((error) => {
      globalForDb.__irbisDb = {};
      throw error;
    });
  }
  return globalForDb.__irbisDb.promise;
}

export { schema };
