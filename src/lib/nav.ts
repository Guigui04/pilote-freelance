import {
  LayoutDashboard,
  Calendar,
  Building2,
  FolderKanban,
  ListTodo,
  Timer,
  Receipt,
  FileText,
  Megaphone,
  Sparkles,
  FolderOpen,
  BarChart3,
  Zap,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  group: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard, group: "Pilotage" },
  { href: "/agenda", label: "Agenda", icon: Calendar, group: "Pilotage" },
  { href: "/clients", label: "Clients", icon: Building2, group: "Pilotage" },
  { href: "/projets", label: "Projets", icon: FolderKanban, group: "Pilotage" },
  { href: "/taches", label: "Tâches", icon: ListTodo, group: "Pilotage" },
  { href: "/temps", label: "Suivi du temps", icon: Timer, group: "Pilotage" },

  { href: "/facturation", label: "Facturation", icon: Receipt, group: "Finances" },
  { href: "/finances", label: "Finances", icon: BarChart3, group: "Finances" },

  { href: "/contenus", label: "Contenus", icon: Megaphone, group: "Production" },
  { href: "/comptes-rendus", label: "Comptes rendus", icon: FileText, group: "Production" },
  { href: "/assistant", label: "Assistant IA", icon: Sparkles, group: "Production" },
  { href: "/documents", label: "Documents", icon: FolderOpen, group: "Production" },

  { href: "/dashboards", label: "Dashboards & KPI", icon: BarChart3, group: "Analyse" },
  { href: "/automatisations", label: "Automatisations", icon: Zap, group: "Analyse" },

  { href: "/parametres", label: "Paramètres", icon: Settings, group: "Système" },
];

export const NAV_GROUPS = ["Pilotage", "Finances", "Production", "Analyse", "Système"];
