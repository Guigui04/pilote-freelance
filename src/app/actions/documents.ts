"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { createAdminClient, DOCUMENTS_BUCKET } from "@/lib/supabase/admin";
import { getGoogleDrive } from "@/lib/google";
import { searchNotion as notionSearch } from "@/lib/notion";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

export async function uploadDocument(formData: FormData): Promise<void> {
  const userId = await getUserId();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  const arrayBuffer = await file.arrayBuffer();
  const path = `${userId}/${Date.now()}-${file.name}`;

  try {
    const admin = createAdminClient();
    const { error } = await admin.storage
      .from(DOCUMENTS_BUCKET)
      .upload(path, new Uint8Array(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (error) {
      console.error("[storage] upload", error);
      return;
    }
    const { data } = admin.storage.from(DOCUMENTS_BUCKET).getPublicUrl(path);

    await db.insert(documents).values({
      userId,
      name: str(formData.get("name")) ?? file.name,
      type: "file",
      url: data.publicUrl,
      storagePath: path,
      category: str(formData.get("category")),
      companyId: str(formData.get("companyId")),
      projectId: str(formData.get("projectId")),
    });

    revalidatePath("/documents");
  } catch (e) {
    console.error("[storage] upload exception", e);
  }
}

export async function addLink(formData: FormData) {
  const userId = await getUserId();
  const name = str(formData.get("name"));
  const url = str(formData.get("url"));
  if (!name || !url) return;
  await db.insert(documents).values({
    userId,
    name,
    url,
    type: (str(formData.get("type")) as never) ?? "link",
    category: str(formData.get("category")),
    companyId: str(formData.get("companyId")),
    projectId: str(formData.get("projectId")),
  });
  revalidatePath("/documents");
}

export async function deleteDocument(id: string) {
  const userId = await getUserId();
  const [doc] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, userId)))
    .limit(1);
  if (!doc) return;

  if (doc.storagePath) {
    try {
      const admin = createAdminClient();
      await admin.storage.from(DOCUMENTS_BUCKET).remove([doc.storagePath]);
    } catch (e) {
      console.error("[storage] remove", e);
    }
  }
  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath("/documents");
}

// --- Intégrations : import ---

export async function searchNotionAction(query: string) {
  const userId = await getUserId();
  try {
    const results = await notionSearch(userId, query || "");
    return { ok: true, results };
  } catch (e) {
    console.error("[notion] action", e);
    return { ok: false, results: [], error: "Notion non disponible." };
  }
}

export async function listDriveFilesAction(query: string) {
  const userId = await getUserId();
  const drive = await getGoogleDrive(userId);
  if (!drive) return { ok: false, results: [], error: "Google Drive non connecté." };
  try {
    const res = await drive.files.list({
      q: query ? `name contains '${query.replace(/'/g, "")}' and trashed = false` : "trashed = false",
      pageSize: 15,
      fields: "files(id, name, webViewLink, mimeType)",
      orderBy: "modifiedTime desc",
    });
    const results = (res.data.files ?? []).map((f) => ({
      id: f.id ?? "",
      title: f.name ?? "(sans nom)",
      url: f.webViewLink ?? "",
    }));
    return { ok: true, results };
  } catch (e) {
    console.error("[drive] list", e);
    return { ok: false, results: [], error: "Échec Google Drive." };
  }
}

export async function attachExternal(
  type: "notion" | "drive",
  name: string,
  url: string
) {
  const userId = await getUserId();
  await db.insert(documents).values({
    userId,
    name,
    url,
    type,
    category: type === "notion" ? "Notion" : "Drive",
  });
  revalidatePath("/documents");
}
