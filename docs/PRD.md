# PRD — « PILOTE »
### Product Requirements Document — Webapp de pilotage d'activité freelance

| | |
|---|---|
| **Produit** | PILOTE (nom de travail) |
| **Auteur** | Guillaume Giraud |
| **Version** | 1.0 |
| **Date** | 27/06/2026 |
| **Type** | Webapp full-stack, mono-utilisateur, déployée sur Vercel |
| **Document lié** | `CAHIER_DES_CHARGES.md` |

---

## 1. Vision produit

> **« Un seul cockpit pour piloter toute mon activité freelance. »**

PILOTE est l'outil de travail quotidien de Guillaume Giraud, freelance multi-clients. Il rassemble dans une interface unique tout ce qui est aujourd'hui éparpillé entre Google Agenda, Notion, Sheets, outils de facturation et fichiers divers : agenda, clients, projets, tâches, temps, finances, contenus et un assistant IA.

L'objectif n'est pas de « faire comme Notion » mais d'offrir un outil **taillé pour le métier de freelance digital** : du suivi de projet jusqu'à la facture, en passant par l'IA qui génère comptes rendus et contenus.

---

## 2. Problème & opportunité

### 2.1 Problèmes actuels
- **Dispersion** : l'info est répartie sur trop d'outils → perte de temps, oublis.
- **Multi-clients** : difficile de garder une vision claire « par client » et « par projet ».
- **Facturation manuelle** : chronophage, risque d'erreurs, suivi des paiements approximatif.
- **Répétitif** : comptes rendus, contenus, reportings refaits à la main.
- **Pilotage** : pas de vision consolidée du temps passé, de la rentabilité, des deadlines.

### 2.2 Opportunité
Un outil unique, gratuit à exploiter, qui fait gagner plusieurs heures par semaine et donne une vision claire de l'activité — avec l'IA comme accélérateur sur les tâches de production.

---

## 3. Persona

**Guillaume — Freelance pilotage digital & IA**
- Gère 3 à 10 clients/sociétés simultanément, plusieurs projets chacun.
- Polyvalent : gestion de projet, IA/automatisation, marketing, contenus, design, vidéo, coordination technique.
- A besoin de basculer vite d'un contexte client à un autre.
- Veut automatiser le répétitif et garder le contrôle sur le stratégique.
- Sensible aux coûts (outil perso) → solutions gratuites privilégiées.

---

## 4. Objectifs produit & métriques de succès

| Objectif | Indicateur de succès |
|---|---|
| Centraliser l'activité | 0 outil externe nécessaire pour le pilotage quotidien |
| Accélérer la facturation | Facture créée + envoyée en < 2 min |
| Automatiser la production | CR généré par IA en < 1 min |
| Vision claire multi-clients | Bascule par client en 1 clic, KPI par client visibles |
| Coût maîtrisé | ≈ 0 €/mois |
| Adoption | Utilisé quotidiennement comme page d'accueil de travail |

---

## 5. User stories par module

### 5.1 Tableau de bord
- *En tant que* Guillaume, *je veux* voir d'un coup d'œil mes RDV, tâches prioritaires et deadlines du jour *afin de* démarrer ma journée sans rien oublier.
- *Je veux* voir mon CA du mois et mes factures impayées *afin de* suivre ma trésorerie.
- *Je veux* filtrer toute l'app par client *afin de* me concentrer sur une mission.

### 5.2 Agenda
- *Je veux* que mon agenda se synchronise avec Google Calendar *afin de* ne gérer qu'un seul calendrier.
- *Je veux* bloquer des créneaux de travail rattachés à un projet *afin de* planifier ma charge.
- *Je veux* recevoir des rappels avant mes RDV.

### 5.3 Clients & Sociétés
- *Je veux* créer une fiche société avec ses contacts *afin de* centraliser mes interlocuteurs.
- *Je veux* voir l'historique d'un client (projets, factures, temps, CR) *afin d'*avoir tout le contexte.

### 5.4 Projets & Roadmaps
- *Je veux* gérer mes projets en kanban *afin de* visualiser l'avancement.
- *Je veux* définir des jalons avec dates *afin de* tenir une roadmap.
- *Je veux* être alerté quand un projet est à risque (retard/deadline).
- *Je veux* tracer les bugs/évolutions techniques *afin de* coordonner avec le développeur.

### 5.5 Tâches
- *Je veux* prioriser mes tâches par urgence et échéance.
- *Je veux* une vue « Aujourd'hui » et « En retard ».
- *Je veux* créer des tâches récurrentes.

### 5.6 Suivi du temps
- *Je veux* lancer un chrono sur une tâche/projet *afin de* mesurer mon temps réel.
- *Je veux* marquer le temps facturable *afin de* le convertir en facture.
- *Je veux* un récap hebdo par client.

### 5.7 Facturation & Finances
- *Je veux* créer un devis et le convertir en facture.
- *Je veux* générer une facture PDF propre avec mes mentions légales.
- *Je veux* l'envoyer par e-mail au client.
- *Je veux* suivre les paiements et relancer les retards.
- *Je veux* voir mon CA, mon encaissé et une estimation TVA/URSSAF.
- *Je veux* transformer mon temps facturable en lignes de facture.

### 5.8 Comptes rendus
- *Je veux* générer un compte rendu structuré à partir de mes notes via l'IA.
- *Je veux* l'exporter en PDF ou l'envoyer au client.

### 5.9 Calendrier éditorial & Contenus
- *Je veux* planifier mes contenus sur un calendrier.
- *Je veux* générer des éditos/articles/idées via l'IA.
- *Je veux* suivre le statut de chaque contenu (idée → publié).

### 5.10 Assistant IA
- *Je veux* un assistant qui connaît le contexte de mes clients/projets.
- *Je veux* générer CR, contenus, résumés et recommandations.
- *Je veux* retrouver l'historique de mes générations.

### 5.11 Documents & Ressources
- *Je veux* relier mes documents Notion/Drive/Sheets à un projet.
- *Je veux* uploader des livrables et les retrouver par client/projet.

### 5.12 Dashboards & KPI
- *Je veux* visualiser temps, CA et rentabilité par client/période.
- *Je veux* (plus tard) brancher mes données réseaux/Meta Ads.

---

## 6. Parcours utilisateurs clés

### 6.1 Démarrage de journée
Connexion → Tableau de bord → consultation RDV + tâches du jour → lancement du chrono sur la 1ère tâche.

### 6.2 De la mission à la facture
Création société/contact → création projet → ajout tâches & jalons → suivi du temps (chrono) → projet terminé → génération facture depuis le temps facturable → export PDF → envoi e-mail → suivi paiement.

### 6.3 Production de contenu assistée
Calendrier éditorial → nouveau contenu (brief) → bouton « Générer avec l'IA » → édition → planification → publication → statut « publié ».

### 6.4 Compte rendu de réunion
Après un RDV → « Générer un CR » → collage des notes → IA produit le CR structuré → relecture → export/envoi au client.

---

## 7. Spécifications UI/UX

### 7.1 Navigation
- **Barre latérale gauche** : Tableau de bord, Agenda, Clients, Projets, Tâches, Temps, Facturation, Contenus, Comptes rendus, Documents, Dashboards, Assistant IA, Paramètres.
- **Sélecteur de client global** (en haut) pour filtrer toute l'app.
- **Bouton « + »** d'action rapide (tâche, RDV, facture, CR).
- **Panneau IA** accessible partout (icône flottante / raccourci clavier).

### 7.2 Principes de design
- Interface en français, claire, dense mais lisible (style « cockpit »).
- Composants shadcn/ui, cohérence visuelle, thème clair/sombre.
- Code couleur par client/projet.
- Responsive (desktop d'abord, mobile fonctionnel).
- Actions rapides au clavier (raccourcis).

### 7.3 Écrans principaux
1. Dashboard (widgets + filtres)
2. Agenda (jour/semaine/mois)
3. Liste & fiche client
4. Board projets + fiche projet (kanban + roadmap)
5. Tâches (liste/kanban/aujourd'hui)
6. Suivi du temps (chrono + récap)
7. Facturation (liste devis/factures + éditeur + PDF)
8. Finances (dashboard financier)
9. Contenus (calendrier éditorial)
10. Comptes rendus (liste + éditeur IA)
11. Documents (par client/projet)
12. Dashboards & KPI
13. Assistant IA (chat)
14. Paramètres & intégrations

---

## 8. Architecture technique

- **Next.js 15 (App Router) + TypeScript** — front + back (Server Actions / Route Handlers).
- **Supabase** : PostgreSQL + Auth (Google OAuth) + Storage, sécurité par **RLS**.
- **Drizzle ORM** pour l'accès typé à la base.
- **Tailwind + shadcn/ui** (UI), **Tremor/Recharts** (graphes).
- **Google Gemini API** (`gemini-2.0-flash`) pour l'IA — free tier.
- **@react-pdf/renderer** (factures/devis PDF), **Resend** (e-mails).
- **Vercel** (hébergement + CI/CD Git + Cron pour automatisations).
- Intégrations : Google Calendar/Drive/Sheets (OAuth2), Notion (token).

```
[Navigateur] ── Next.js (Vercel) ── Server Actions/API
                                   │
                 ┌─────────────────┼───────────────────┐
            Supabase           Gemini API          Google/Notion APIs
        (Postgres+Auth+Storage)  (IA)            (Calendar/Drive/Notion)
                                   │
                              Resend (e-mails) · Vercel Cron (automatisations)
```

---

## 9. Modèle de données détaillé

> PostgreSQL (Supabase). Tous les enregistrements appartiennent au compte unique (`user_id`), protégés par RLS. Clés étrangères en `ON DELETE` cohérent (cascade/set null selon le cas).

### `companies`
`id, user_id, name, logo_url, sector, siret, address, status (prospect|actif|pause|termine), notes, created_at, updated_at`

### `contacts`
`id, user_id, company_id (FK), full_name, role, email, phone, notes, created_at`

### `projects`
`id, user_id, company_id (FK), name, description, status (a_faire|en_cours|en_validation|termine), start_date, end_date, budget, hourly_rate, color, tags[], progress, created_at, updated_at`

### `milestones`
`id, user_id, project_id (FK), title, due_date, status, order, created_at`

### `tasks`
`id, user_id, project_id (FK, nullable), company_id (FK, nullable), parent_task_id (FK, nullable), title, description, type (tache|bug|evolution), priority (basse|moyenne|haute|urgente), status, due_date, estimated_minutes, is_recurring, recurrence_rule, tags[], position, created_at, updated_at`

### `calendar_events`
`id, user_id, project_id (FK, nullable), company_id (FK, nullable), title, description, start_at, end_at, location, color, google_event_id (nullable), reminder_minutes, created_at`

### `time_entries`
`id, user_id, task_id (FK, nullable), project_id (FK), description, started_at, ended_at, duration_minutes, billable (bool), hourly_rate, invoiced (bool), created_at`

### `quotes`
`id, user_id, company_id (FK), number, status (brouillon|envoye|accepte|refuse), issue_date, valid_until, subtotal, vat_amount, total, notes, terms, created_at`

### `quote_items`
`id, quote_id (FK), description, quantity, unit_price, vat_rate, position`

### `invoices`
`id, user_id, company_id (FK), quote_id (FK, nullable), number, status (brouillon|envoyee|payee|en_retard|partiel), issue_date, due_date, subtotal, vat_amount, total, paid_amount, legal_mentions, notes, pdf_url, created_at`

### `invoice_items`
`id, invoice_id (FK), description, quantity, unit_price, vat_rate, position`

### `payments`
`id, user_id, invoice_id (FK), amount, paid_at, method, notes`

### `content_items`
`id, user_id, company_id (FK, nullable), project_id (FK, nullable), title, platform, format, status (idee|en_cours|a_valider|programme|publie), scheduled_at, brief, body, assets_links[], created_at, updated_at`

### `reports`
`id, user_id, company_id (FK, nullable), project_id (FK, nullable), title, type (cr_reunion|point_hebdo|bilan), content, source_notes, ai_generated (bool), pdf_url, created_at`

### `documents`
`id, user_id, company_id (FK, nullable), project_id (FK, nullable), name, type (file|notion|drive|sheet|link), url, storage_path, category, created_at`

### `ai_generations`
`id, user_id, type (cr|contenu|resume|reco|autre), prompt, output, context_ref, created_at`

### `automations`
`id, user_id, name, trigger_type, conditions (jsonb), action (jsonb), is_active, last_run_at, created_at`

### `integrations`
`id, user_id, provider (google|notion|gemini|resend), access_token (chiffré), refresh_token (chiffré), scopes, expires_at, metadata (jsonb), created_at`

### `settings`
`id, user_id, currency, default_hourly_rate, fiscal_regime, vat_applicable (bool), legal_mentions, logo_url, company_info (jsonb), timezone, theme, created_at`

---

## 10. Intégrations — détails

| Intégration | Données | Auth | Notes |
|---|---|---|---|
| Google Calendar | Événements (R/W) | OAuth2 | Synchro bidirectionnelle, `google_event_id` |
| Google Drive | Fichiers (lecture/recherche) | OAuth2 | Liens vers livrables/docs |
| Google Sheets | Lignes (R/W) | OAuth2 | Import/export tableaux |
| Notion | Pages/bases | Token d'intégration | Centralisation connaissances |
| Gemini | Génération texte | Clé API | `gemini-2.0-flash`, free tier |
| Resend | E-mails | Clé API | Envoi factures/CR |

---

## 11. Roadmap de développement (par lots)

| Lot | Livrable | Dépendances |
|---|---|---|
| **L0 Fondations** | Setup Next.js + Supabase + Auth Google + navigation + thème + migrations DB | — |
| **L1 Pilotage** | Clients/Sociétés, Projets/Roadmaps (kanban+jalons), Tâches, Dashboard | L0 |
| **L2 Temps & Agenda** | Suivi du temps (chrono), Agenda + synchro Google Calendar | L1 |
| **L3 Finances** | Devis, Factures PDF, Paiements, TVA/URSSAF, dashboard financier | L1, L2 |
| **L4 IA & Contenus** | Assistant IA (Gemini), Comptes rendus, Calendrier éditorial | L1 |
| **L5 Intégrations & Docs** | Notion/Drive/Sheets, Documents & Ressources | L0 |
| **L6 Dashboards & Auto** | KPI/graphes, automatisations + Vercel Cron | L1–L4 |
| **L7 Finitions** | Responsive, polish UX, export données, déploiement final | tous |

---

## 12. Risques & mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Limites free tier (Gemini/Supabase) | Moyen | Usage perso < quotas ; cache ; surveillance |
| Complexité synchro Google Calendar | Moyen | Synchro incrémentale, gestion des conflits |
| Quotas OAuth Google (app non vérifiée) | Faible | App en mode test/usage perso, scopes minimaux |
| Conformité facturation (mentions légales) | Moyen | Paramétrage selon régime, validation par Guillaume |
| Périmètre large (pas de MVP) | Moyen | Construction par lots, chaque lot livrable |

---

## 13. Questions ouvertes
- Nom & charte graphique définitifs.
- Régime fiscal exact (pour TVA/URSSAF).
- Domaine personnalisé.
- Modèles de facture/CR souhaités.
- Priorité de l'ordre des lots (par défaut : L0 → L7).

---

## 14. Prochaine étape proposée
Après validation de ce PRD et du cahier des charges :
1. Initialiser le dépôt + projet Next.js + Supabase (Lot L0).
2. Mettre en place le schéma de base de données et l'authentification.
3. Dérouler les lots L1 → L7.
4. Déployer sur Vercel à chaque lot (environnement preview), puis livrable final en production.
