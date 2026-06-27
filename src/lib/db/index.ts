import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Avertissement non bloquant au build : la connexion n'est utilisée qu'au runtime.
  console.warn("[db] DATABASE_URL manquant — la base de données ne sera pas accessible.");
}

// Réutilisation de la connexion en dev (HMR) pour éviter d'épuiser le pool.
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.client ??
  postgres(connectionString ?? "postgres://localhost:5432/postgres", {
    prepare: false,
    max: 1,
  });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
export { schema };
