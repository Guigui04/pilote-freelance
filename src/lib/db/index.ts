import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// `||` (et non `??`) pour que DATABASE_URL absent OU vide retombe sur le fallback :
// sur Vercel la variable peut exister mais valoir "", ce qui ferait planter
// `postgres("")` (Invalid URL) au chargement du module, donc au build.
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/postgres";

if (!process.env.DATABASE_URL) {
  // Avertissement non bloquant au build : la connexion n'est utilisée qu'au runtime.
  console.warn("[db] DATABASE_URL manquant — la base de données ne sera pas accessible.");
}

// Réutilisation de la connexion en dev (HMR) pour éviter d'épuiser le pool.
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client =
  globalForDb.client ??
  postgres(connectionString, {
    prepare: false,
    // Petit pool pour que les requêtes lancées en parallèle (Promise.all)
    // s'exécutent réellement en concurrence. Le pooler Supabase (transaction)
    // gère la montée en charge côté serveur. Pas d'idle_timeout : on garde les
    // connexions chaudes sur une instance Fluid Compute réutilisée (évite une
    // poignée de main TLS au premier clic après une pause).
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
export { schema };
