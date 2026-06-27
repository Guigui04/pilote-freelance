import { db } from "@/lib/db";
import { contentItems, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function listContent() {
  const userId = await getUserId();
  return db
    .select({
      id: contentItems.id,
      title: contentItems.title,
      platform: contentItems.platform,
      format: contentItems.format,
      status: contentItems.status,
      scheduledAt: contentItems.scheduledAt,
      companyName: companies.name,
    })
    .from(contentItems)
    .leftJoin(companies, eq(contentItems.companyId, companies.id))
    .where(eq(contentItems.userId, userId))
    .orderBy(desc(contentItems.createdAt));
}

export async function getContent(id: string) {
  const userId = await getUserId();
  const [item] = await db
    .select()
    .from(contentItems)
    .where(and(eq(contentItems.id, id), eq(contentItems.userId, userId)))
    .limit(1);
  return item ?? null;
}
