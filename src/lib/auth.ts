import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Récupère l'utilisateur connecté (ou null).
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Exige un utilisateur connecté. Redirige vers /login sinon.
 * Renvoie l'id utilisateur (= user_id de toutes les tables).
 */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");

  // Garde mono-utilisateur : seul l'e-mail autorisé peut accéder.
  const allowed = process.env.ALLOWED_EMAIL?.toLowerCase().trim();
  if (allowed && user.email?.toLowerCase().trim() !== allowed) {
    redirect("/auth/error?reason=forbidden");
  }

  return { id: user.id, email: user.email, user };
}

/**
 * Raccourci : renvoie uniquement l'id utilisateur courant.
 */
export async function getUserId() {
  const { id } = await requireUser();
  return id;
}
