import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de ton activité."
      />
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue sur PILOTE</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Les fondations sont en place. Les modules de pilotage arrivent au lot
          suivant.
        </CardContent>
      </Card>
    </div>
  );
}
