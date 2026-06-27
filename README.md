# PILOTE — Webapp de pilotage d'activité freelance

Application web personnelle (mono-utilisateur) pour gérer toute l'activité freelance de Guillaume Giraud : agenda, clients, projets, tâches, suivi du temps, facturation, contenus, comptes rendus et assistant IA.

## Documentation
- 📋 [Cahier des charges](docs/CAHIER_DES_CHARGES.md) — périmètre, specs fonctionnelles & techniques
- 📐 [PRD](docs/PRD.md) — vision produit, user stories, parcours, modèle de données, roadmap
- 🚀 [Guide de déploiement](docs/DEPLOIEMENT.md) — Supabase + Google + Vercel, pas à pas
- 🗄️ [Setup SQL Supabase](docs/supabase-setup.sql) — bucket de stockage

## Démarrage rapide (local)
```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run db:push              # crée les tables dans Supabase
npm run dev                  # http://localhost:3000
```

## Modules
Tableau de bord · Agenda (sync Google Calendar) · Clients/CRM · Projets & Roadmaps ·
Tâches · Suivi du temps · Facturation (devis, factures PDF, paiements, TVA/URSSAF) ·
Comptes rendus (IA) · Calendrier éditorial · Assistant IA (Gemini) · Documents
(upload + Notion/Drive) · Dashboards & KPI · Automatisations (Vercel Cron) · Paramètres.

## Stack (prévue)
Next.js 15 · TypeScript · Tailwind + shadcn/ui · Supabase (Postgres + Auth + Storage) · Drizzle ORM · Google Gemini (IA) · Resend (e-mails) · déploiement **Vercel**.

## Intégrations
Google Calendar · Google Drive · Google Sheets · Notion · Gemini.

## Coût d'exploitation cible
≈ 0 €/mois (offres gratuites Vercel / Supabase / Gemini / Resend).

## Statut
Phase de spécification. Développement par lots (L0 → L7), voir la roadmap du PRD.
