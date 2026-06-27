export const COMPANY_STATUS: Record<string, string> = {
  prospect: "Prospect",
  actif: "Actif",
  pause: "En pause",
  termine: "Terminé",
};

export const PROJECT_STATUS: Record<string, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  en_validation: "En validation",
  termine: "Terminé",
};

export const PROJECT_STATUS_ORDER = ["a_faire", "en_cours", "en_validation", "termine"];

export const TASK_STATUS: Record<string, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  en_validation: "En validation",
  termine: "Terminé",
};

export const TASK_PRIORITY: Record<string, string> = {
  basse: "Basse",
  moyenne: "Moyenne",
  haute: "Haute",
  urgente: "Urgente",
};

export const PRIORITY_VARIANT: Record<string, "secondary" | "default" | "warning" | "destructive"> = {
  basse: "secondary",
  moyenne: "default",
  haute: "warning",
  urgente: "destructive",
};

export const TASK_TYPE: Record<string, string> = {
  tache: "Tâche",
  bug: "Bug",
  evolution: "Évolution",
};

export const INVOICE_STATUS: Record<string, string> = {
  brouillon: "Brouillon",
  envoyee: "Envoyée",
  payee: "Payée",
  en_retard: "En retard",
  partiel: "Partiel",
};

export const QUOTE_STATUS: Record<string, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accepte: "Accepté",
  refuse: "Refusé",
};

export const CONTENT_STATUS: Record<string, string> = {
  idee: "Idée",
  en_cours: "En cours",
  a_valider: "À valider",
  programme: "Programmé",
  publie: "Publié",
};

export const CONTENT_STATUS_ORDER = ["idee", "en_cours", "a_valider", "programme", "publie"];

export const REPORT_TYPE: Record<string, string> = {
  cr_reunion: "CR de réunion",
  point_hebdo: "Point hebdo",
  bilan: "Bilan",
  autre: "Autre",
};
