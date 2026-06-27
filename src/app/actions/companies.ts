"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, contacts } from "@/lib/db/schema";
import { getUserId } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

function str(v: FormDataEntryValue | null) {
  const s = (v as string)?.toString().trim();
  return s ? s : null;
}

export async function createCompany(formData: FormData) {
  const userId = await getUserId();
  const name = str(formData.get("name"));
  if (!name) return;

  const [created] = await db
    .insert(companies)
    .values({
      userId,
      name,
      sector: str(formData.get("sector")),
      siret: str(formData.get("siret")),
      address: str(formData.get("address")),
      status: (str(formData.get("status")) as never) ?? "prospect",
      color: str(formData.get("color")) ?? "#6366f1",
      notes: str(formData.get("notes")),
    })
    .returning();

  revalidatePath("/clients");
  redirect(`/clients/${created.id}`);
}

export async function updateCompany(id: string, formData: FormData) {
  const userId = await getUserId();
  await db
    .update(companies)
    .set({
      name: str(formData.get("name")) ?? "Sans nom",
      sector: str(formData.get("sector")),
      siret: str(formData.get("siret")),
      address: str(formData.get("address")),
      status: (str(formData.get("status")) as never) ?? "prospect",
      color: str(formData.get("color")) ?? "#6366f1",
      notes: str(formData.get("notes")),
      updatedAt: new Date(),
    })
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
}

export async function deleteCompany(id: string) {
  const userId = await getUserId();
  await db
    .delete(companies)
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));
  revalidatePath("/clients");
  redirect("/clients");
}

export async function createContact(companyId: string, formData: FormData) {
  const userId = await getUserId();
  const fullName = str(formData.get("fullName"));
  if (!fullName) return;

  await db.insert(contacts).values({
    userId,
    companyId,
    fullName,
    role: str(formData.get("role")),
    email: str(formData.get("email")),
    phone: str(formData.get("phone")),
    notes: str(formData.get("notes")),
  });

  revalidatePath(`/clients/${companyId}`);
}

export async function deleteContact(id: string, companyId: string) {
  const userId = await getUserId();
  await db
    .delete(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.userId, userId)));
  revalidatePath(`/clients/${companyId}`);
}
