import { NextResponse } from "next/server";
import { runAllCronJobs } from "@/lib/cron-jobs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Sécurité : Vercel Cron envoie l'en-tête Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
  }

  try {
    const result = await runAllCronJobs();
    return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
  } catch (e) {
    console.error("[cron] échec", e);
    return NextResponse.json({ ok: false, error: "Échec du cron" }, { status: 500 });
  }
}
