"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/spreadsheets",
].join(" ");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    const supabase = createClient();
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: GOOGLE_SCOPES,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-primary-foreground text-2xl font-bold shadow-glow">
            P
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gradient">PILOTE</CardTitle>
          <CardDescription>Cockpit de pilotage freelance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Continuer avec Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {sent ? (
            <p className="text-sm text-center text-muted-foreground">
              Lien de connexion envoyé à <strong>{email}</strong>. Vérifie ta boîte mail.
            </p>
          ) : (
            <form onSubmit={signInWithEmail} className="space-y-3">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                Recevoir un lien magique
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
