import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-5xl font-bold text-primary">404</p>
      <p className="text-muted-foreground">Cette page n'existe pas.</p>
      <Link href="/" className={buttonVariants()}>
        Retour au tableau de bord
      </Link>
    </div>
  );
}
