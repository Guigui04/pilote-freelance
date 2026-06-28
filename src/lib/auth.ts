import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Utilisateur courant via vérification réseau Supabase (appel au serveur
 * d'auth — coûteux). Réservé aux cas hors cycle de requête. Dans les Server
 * Components / actions, préférer requireUser()/getUserId() qui lisent
 * l'en-tête posé par le middleware (déjà vérifié, sans appel réseau).
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Identité courante depuis les en-têtes posés par le middleware
 * (x-user-id / x-user-email). Le middleware a déjà vérifié le JWT et appliqué
 * la garde ALLOWED_EMAIL : aucun appel réseau ici. Redirige vers /login si
 * l'en-tête est absent (ne devrait pas arriver sur une route protégée).
 */
export async function requireUser() {
  const h = await headers();
  const id = h.get("x-user-id");
  if (!id) redirect("/login");
  const email = h.get("x-user-email") ?? undefined;
  return { id, email };
}

/**
 * Raccourci : renvoie uniquement l'id utilisateur courant.
 */
export async function getUserId() {
  const { id } = await requireUser();
  return id;
}
