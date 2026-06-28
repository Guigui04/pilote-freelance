import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/auth/error", "/api/cron"];

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));

  // En-têtes transmis au rendu en aval. On efface toute valeur d'identité
  // venue du client : seul ce middleware peut la poser, après vérification
  // du JWT par le serveur d'auth Supabase.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-user-id");
  requestHeaders.delete("x-user-email");

  const refreshed: { name: string; value: string; options?: Record<string, unknown> }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          refreshed.push(...cookiesToSet);
        },
      },
    }
  );

  // UNIQUE vérification réseau de l'identité pour toute la requête. Le rendu
  // (layout, fonctions data, server actions) lira ensuite l'en-tête x-user-id
  // pose ci-dessous, sans rappeler le serveur d'auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Garde mono-utilisateur appliquee une seule fois, ici.
  if (user && !isPublic) {
    const allowed = process.env.ALLOWED_EMAIL?.toLowerCase().trim();
    const email = user.email?.toLowerCase().trim();
    if (allowed && email !== allowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/error";
      url.searchParams.set("reason", "forbidden");
      return NextResponse.redirect(url);
    }
  }

  if (user) {
    requestHeaders.set("x-user-id", user.id);
    if (user.email) requestHeaders.set("x-user-email", user.email);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  refreshed.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );
  return response;
}
