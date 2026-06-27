import { db } from "@/lib/db";
import { quotes, quoteItems, companies } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";

export async function listQuotes() {
  const userId = await getUserId();
  return db
    .select({
      id: quotes.id,
      number: quotes.number,
      status: quotes.status,
      issueDate: quotes.issueDate,
      validUntil: quotes.validUntil,
      total: quotes.total,
      companyName: companies.name,
    })
    .from(quotes)
    .leftJoin(companies, eq(quotes.companyId, companies.id))
    .where(eq(quotes.userId, userId))
    .orderBy(desc(quotes.issueDate), desc(quotes.createdAt));
}

export async function getQuote(id: string) {
  const userId = await getUserId();
  const [quote] = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.id, id), eq(quotes.userId, userId)))
    .limit(1);
  if (!quote) return null;

  const company = quote.companyId
    ? (await db.select().from(companies).where(eq(companies.id, quote.companyId)).limit(1))[0]
    : null;

  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, id))
    .orderBy(quoteItems.position);

  return { quote, company, items };
}
