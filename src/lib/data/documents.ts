import { db } from "@/lib/db";
import { documents, companies, projects } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function listDocuments() {
  const userId = await getUserId();
  return db
    .select({
      id: documents.id,
      name: documents.name,
      type: documents.type,
      url: documents.url,
      category: documents.category,
      createdAt: documents.createdAt,
      companyName: companies.name,
      projectName: projects.name,
    })
    .from(documents)
    .leftJoin(companies, eq(documents.companyId, companies.id))
    .leftJoin(projects, eq(documents.projectId, projects.id))
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));
}
