import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getContent } from "@/lib/data/content";
import { listCompanies } from "@/lib/data/companies";
import { updateContent, deleteContent } from "@/app/actions/content";
import { generateContentBody } from "@/app/actions/ai";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmForm } from "@/components/confirm-form";
import { ContentEditor } from "@/components/content-editor";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getContent(id);
  if (!item) notFound();
  const companies = await listCompanies();

  return (
    <div>
      <Link href="/contenus" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Contenus
      </Link>

      <PageHeader title={item.title}>
        <ConfirmForm action={deleteContent.bind(null, item.id)} message="Supprimer ce contenu ?">
          <Button variant="ghost" size="icon" type="submit"><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </ConfirmForm>
      </PageHeader>

      <ContentEditor
        content={item}
        companies={companies.map((c) => ({ id: c.id, name: c.name }))}
        generate={generateContentBody.bind(null, item.id)}
        save={updateContent.bind(null, item.id)}
      />
    </div>
  );
}
