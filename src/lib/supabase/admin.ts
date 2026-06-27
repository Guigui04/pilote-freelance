import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé service role — usage serveur uniquement
 * (jamais exposé au navigateur). Pour le stockage de fichiers, etc.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export const DOCUMENTS_BUCKET = "documents";
