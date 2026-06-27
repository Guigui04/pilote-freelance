import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  const messages: Record<string, string> = {
    forbidden:
      "Cet e-mail n'est pas autorisé à accéder à l'application (compte mono-utilisateur).",
    exchange: "La connexion a échoué. Réessaie.",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold">Connexion impossible</h1>
      <p className="text-muted-foreground max-w-md">
        {messages[reason ?? ""] ?? "Une erreur est survenue lors de la connexion."}
      </p>
      <Link href="/login" className={buttonVariants()}>
        Retour à la connexion
      </Link>
    </div>
  );
}
