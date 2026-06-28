import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureSettings } from "@/lib/settings";
import { saveGoogleTokens } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Garde mono-utilisateur
      const allowed = process.env.ALLOWED_EMAIL?.toLowerCase().trim();
      const email = data.session.user.email?.toLowerCase().trim();
      if (allowed && email !== allowed) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/auth/error?reason=forbidden`);
      }

      // Initialise les paramètres du compte si nécessaire
      await ensureSettings(data.session.user.id);

      // Stocke les jetons Google (Calendar/Drive/Sheets) s'ils sont présents
      if (data.session.provider_token) {
        await saveGoogleTokens(data.session.user.id, {
          accessToken: data.session.provider_token,
          refreshToken: data.session.provider_refresh_token ?? null,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error?reason=exchange`);
}
