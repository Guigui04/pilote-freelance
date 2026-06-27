import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getReport } from "@/lib/data/reports";
import { updateReport, deleteReport } from "@/app/actions/reports";
import { generateReport } from "@/app/actions/ai";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmForm } from "@/components/confirm-form";
import { ReportEditor } from "@/components/report-editor";
import { REPORT_TYPE } from "@/lib/labels";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  return (
    <div>
      <Link href="/comptes-rendus" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Comptes rendus
      </Link>

      <PageHeader title={report.title}>
        <Badge variant="secondary">{REPORT_TYPE[report.type]}</Badge>
        <ConfirmForm action={deleteReport.bind(null, report.id)} message="Supprimer ce compte rendu ?">
          <Button variant="ghost" size="icon" type="submit"><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </ConfirmForm>
      </PageHeader>

      <ReportEditor
        title={report.title}
        type={report.type}
        initialNotes={report.sourceNotes ?? ""}
        initialContent={report.content ?? ""}
        generate={generateReport.bind(null, report.id)}
        save={updateReport.bind(null, report.id)}
      />
    </div>
  );
}
