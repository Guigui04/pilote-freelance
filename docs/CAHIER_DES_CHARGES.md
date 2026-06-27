# Cahier des charges — « PILOTE » 
### Webapp de pilotage d'activité freelance

| | |
|---|---|
| **Client / Porteur** | Guillaume Giraud (freelance — pilotage digital, IA & automatisation, marketing) |
| **Type de projet** | Application web personnelle (SaaS mono-utilisateur) |
| **Version du document** | 1.0 |
| **Date** | 27/06/2026 |
| **Statut** | Spécification fonctionnelle & technique — livrable final (pas de MVP) |
| **Hébergement cible** | Vercel |

> *PILOTE* est un nom de travail. Il pourra être renommé librement (ex : Cockpit, Orbit, Hub, Atlas…).

---

## 1. Contexte & objectifs

### 1.1 Contexte
Guillaume Giraud se lance en freelance avec **plusieurs clients, plusieurs sociétés et plusieurs projets en parallèle**. Ses missions couvrent 10 domaines : pilotage de projet, IA & automatisation, analyse de performances, marketing, communication & contenus, design, vidéo, coordination technique, organisation interne et conseil.

Le besoin : un **poste de pilotage unique** (un « cockpit ») qui centralise l'agenda, les clients, les projets, les tâches, le temps, la facturation, les contenus et un assistant IA — pour remplacer la dispersion entre Notion, Google Agenda, fichiers Sheets, outils de facturation, etc.

### 1.2 Objectif général
Concevoir, développer et déployer sur Vercel une **application web complète, mono-utilisateur**, qui permet à Guillaume de **gérer 100 % de son activité freelance** depuis une interface unique.

### 1.3 Objectifs détaillés
- **Centraliser** : un seul endroit pour voir l'ensemble de l'activité (agenda, clients, projets, finances).
- **Piloter** : suivre l'avancement des projets, prioriser les tâches, tenir les deadlines.
- **Gagner du temps** : automatiser le répétitif (comptes rendus, génération de contenus, rappels) via l'IA.
- **Facturer & suivre les revenus** : devis, factures, paiements, vision financière freelance (TVA, URSSAF).
- **Mesurer** : tableaux de bord d'activité et de performance.
- **Évoluer** : architecture prête à accueillir des connecteurs externes (Meta Ads, réseaux sociaux) quand ce sera pertinent.

### 1.4 Critères de réussite
- Guillaume n'a plus besoin d'ouvrir 5 outils différents pour piloter sa journée.
- Création d'une facture en moins de 2 minutes.
- Génération d'un compte rendu de réunion en moins de 1 minute via l'IA.
- Coût d'exploitation mensuel ≈ **0 €** (utilisation des offres gratuites).

---

## 2. Périmètre fonctionnel

### 2.1 Cartographie missions → modules de l'app

| # | Domaine de mission | Module(s) de l'app |
|---|---|---|
| 1 | Pilotage de projet digital | Projets & Roadmaps, Tâches, Comptes rendus |
| 2 | IA & automatisation | Assistant IA, Automatisations |
| 3 | Analyse de performances & reporting | Dashboards & KPI (réseaux : extensible) |
| 4 | Marketing & stratégie digitale | Assistant IA, Contenus, Comptes rendus |
| 5 | Communication & contenus | Calendrier éditorial, Contenus, Assistant IA |
| 6 | Design & supports visuels | Documents & Ressources (suivi des livrables) |
| 7 | Vidéo & montage | Documents & Ressources, Tâches (suivi des livrables) |
| 8 | Coordination technique | Projets (bugs/évolutions), Tâches, Comptes rendus |
| 9 | Organisation interne & outils | Documents, intégrations Notion/Drive/Sheets |
| 10 | Conseil & accompagnement global | Dashboards, Comptes rendus, Assistant IA |

### 2.2 Liste des modules (tous inclus dans le livrable final)

1. **Tableau de bord (Home)** — vue 360° de l'activité
2. **Agenda / Calendrier** — synchronisé Google Calendar
3. **Clients & Sociétés** — mini-CRM
4. **Projets & Roadmaps** — kanban, jalons, deadlines
5. **Tâches** — to-do, priorisation, échéances
6. **Suivi du temps** — time tracking par client/projet
7. **Facturation & Finances** — devis, factures PDF, paiements, TVA/URSSAF
8. **Comptes rendus & Points d'avancement** — générés/assistés par IA
9. **Calendrier éditorial & Contenus** — planning des publications
10. **Assistant IA** — génération de contenus, CR, résumés, recommandations
11. **Documents & Ressources** — centralisation + liens Notion/Drive/Sheets
12. **Dashboards & KPI** — indicateurs d'activité, temps, finances (réseaux à venir)
13. **Automatisations** — rappels, tâches récurrentes, déclencheurs
14. **Paramètres & Intégrations** — connexions Google, Notion, IA, préférences

### 2.3 Hors périmètre (cette version)
- Accès clients / multi-utilisateurs (l'app est mono-utilisateur).
- Connecteurs automatiques Meta Ads / Instagram / réseaux sociaux (prévus, **non développés** maintenant — Guillaume n'est pas encore actif sur les réseaux). L'architecture reste prête à les accueillir (import manuel possible plus tard).
- Application mobile native (l'app sera **responsive**, utilisable sur mobile via le navigateur).
- Comptabilité légale certifiée (l'app facilite la facturation mais ne remplace pas un expert-comptable).

---

## 3. Utilisateurs & rôles

- **Utilisateur unique** : Guillaume Giraud (administrateur, accès total).
- **Authentification** : connexion sécurisée via Google (OAuth) — pratique car réutilisée pour Google Calendar/Drive. Magic link e-mail en secours.
- Pas de gestion de rôles/permissions multiples dans cette version.

---

## 4. Spécifications fonctionnelles par module

### 4.1 Tableau de bord (Home)
- Vue synthétique du jour : rendez-vous, tâches prioritaires, deadlines proches.
- Widgets : CA du mois, factures impayées, projets à risque (deadline dépassée/proche), temps passé cette semaine.
- Raccourcis rapides : « + Tâche », « + RDV », « + Facture », « Générer un CR ».
- Filtre global par client/société.

### 4.2 Agenda / Calendrier
- Vues jour / semaine / mois.
- Création/édition d'événements (titre, date/heure, durée, client/projet, lieu, notes, couleur).
- **Synchronisation bidirectionnelle Google Calendar** (lecture + écriture).
- Blocs de travail rattachés à un projet/client (« time blocking »).
- Rappels (notifications navigateur / e-mail).
- Vue « charge » : temps planifié par client sur la semaine.

### 4.3 Clients & Sociétés (CRM)
- Fiche société : nom, logo, secteur, SIRET, adresse, notes.
- Fiche contact : nom, rôle, e-mail, téléphone, rattachement société.
- Une société peut avoir plusieurs contacts et plusieurs projets.
- Historique : projets, factures, temps passé, derniers CR.
- Statut relation (prospect, actif, en pause, terminé).

### 4.4 Projets & Roadmaps
- Fiche projet : nom, client/société, description, statut, dates de début/fin, budget, tags.
- **Vue Kanban** (colonnes personnalisables : À faire / En cours / En validation / Terminé).
- **Roadmap / jalons** : étapes clés avec dates (vue timeline).
- Avancement (% calculé sur les tâches).
- Suivi des bugs/évolutions (type de tâche « bug » / « évolution » pour la coordination technique).
- Indicateur de risque (deadline, retard, budget consommé).

### 4.5 Tâches
- To-do liée à un projet et/ou un client.
- Champs : titre, description, priorité (basse/moyenne/haute/urgente), échéance, statut, estimation de temps, tags, sous-tâches, checklist.
- Vues : liste, kanban, « Aujourd'hui », « Cette semaine », « En retard ».
- Tâches récurrentes.
- Tri/priorisation (matrice priorité × échéance).

### 4.6 Suivi du temps
- Démarrage/arrêt d'un **chronomètre** rattaché à un projet/tâche.
- Saisie manuelle d'une durée a posteriori.
- Catégorisation (facturable / non facturable).
- Récapitulatif par jour/semaine/mois, par client/projet.
- Conversion des temps facturables en lignes de facture (taux horaire).

### 4.7 Facturation & Finances *(complet)*
- **Devis** : création, lignes (désignation, qté, prix unitaire, TVA), conditions, statut (brouillon/envoyé/accepté/refusé), conversion en facture.
- **Factures** : numérotation automatique conforme, lignes, TVA, totaux HT/TTC, mentions légales freelance (auto-entrepreneur : « TVA non applicable, art. 293 B du CGI » paramétrable), échéances.
- **Export PDF** propre et personnalisable (logo, coordonnées).
- **Envoi par e-mail** au client (avec PDF joint).
- **Suivi des paiements** : statut (en attente, payé, en retard, partiel), date de paiement, relances.
- **Tableau de bord financier** : CA mensuel/annuel, encaissé vs facturé, top clients, prévisionnel.
- **Suivi TVA & URSSAF** : calcul indicatif des cotisations (taux paramétrable selon régime), provisions, échéances déclaratives.
- Génération depuis le suivi du temps (temps facturable → lignes).

### 4.8 Comptes rendus & Points d'avancement
- Création de CR rattachés à un projet/client/réunion.
- **Génération assistée par IA** : à partir de notes brutes / points clés → CR structuré.
- Modèles réutilisables (point hebdo, CR de réunion, bilan mensuel).
- Export PDF / envoi e-mail / copie pour partage.

### 4.9 Calendrier éditorial & Contenus
- Planning des publications/contenus (date, plateforme cible, format, statut : idée/en cours/à valider/programmé/publié).
- Vue calendrier + vue kanban des contenus.
- Stockage du brief, du texte, des visuels associés (liens Drive).
- **Génération IA** : éditos, articles d'actualité, idées de campagnes, optimisation de messages.
- Suivi des publications.

### 4.10 Assistant IA *(central, API gratuite)*
- **Moteur** : Google Gemini API (Gemini 2.0 Flash) — offre gratuite, excellent en français.
- Fonctions :
  - Génération de comptes rendus à partir de notes.
  - Rédaction d'éditos, articles, posts, idées de campagnes.
  - Résumés (réunions, documents, threads).
  - Recommandations stratégiques (à partir du contexte client/projet).
  - Aide à la priorisation des tâches.
- Interface : panneau de chat contextuel + actions « générer » intégrées dans les modules (CR, contenu…).
- Historique des générations, possibilité de réutiliser/éditer.
- Garde-fous : choix du ton, longueur, langue.

### 4.11 Documents & Ressources
- Centralisation des liens et fichiers par client/projet.
- **Intégration Notion / Google Drive / Sheets** : recherche et accès rapide aux documents liés.
- Upload de fichiers (stockage Supabase Storage) : briefs, livrables, visuels.
- Catégorisation et recherche.

### 4.12 Dashboards & KPI
- KPI d'activité : nb de projets actifs, tâches en cours/en retard, temps facturable vs non facturable.
- KPI financiers : CA, marge temps, taux horaire effectif.
- KPI par client : temps consommé, rentabilité, volume facturé.
- **Module reporting réseaux/Meta Ads : structure prévue mais non alimentée** (à activer via import manuel ou API plus tard).
- Graphiques (barres, lignes, donuts), filtres par période/client.

### 4.13 Automatisations
- Rappels automatiques (deadline proche, facture impayée, RDV à venir).
- Tâches récurrentes générées automatiquement.
- Déclencheurs simples (ex : projet « terminé » → proposer de facturer).
- Exécution via tâches planifiées (Vercel Cron).

### 4.14 Paramètres & Intégrations
- Connexions : Google (Calendar/Drive/Sheets), Notion, clé API Gemini.
- Préférences : devise, taux horaire par défaut, régime fiscal, mentions de facturation, logo, fuseau horaire, thème (clair/sombre).
- Sauvegarde/export des données.

---

## 5. Spécifications techniques

### 5.1 Stack retenue (optimisée Vercel, coût ≈ 0 €)

| Couche | Technologie | Pourquoi |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React + TypeScript** | Full-stack, déploiement natif Vercel, Server Actions |
| UI | **Tailwind CSS + shadcn/ui (Radix)** | Composants modernes, rapides, accessibles |
| Graphiques | **Tremor / Recharts** | Dashboards & KPI |
| Base de données | **Supabase (PostgreSQL)** | Free tier généreux, robuste, relationnel |
| Auth | **Supabase Auth (Google OAuth + magic link)** | Sécurisé, intégré, gratuit |
| ORM | **Drizzle ORM** | Léger, typé, idéal serverless |
| Stockage fichiers | **Supabase Storage** | Documents, logos, livrables |
| IA | **Google Gemini API (gemini-2.0-flash)** | **Gratuit**, performant en français |
| PDF | **@react-pdf/renderer** | Génération de devis/factures |
| E-mail | **Resend** (free tier) | Envoi factures/CR |
| Tâches planifiées | **Vercel Cron** | Automatisations/rappels |
| Données client | **TanStack Query + Server Actions** | Synchro UI/serveur |
| Hébergement | **Vercel (Hobby)** | Gratuit, CI/CD Git, edge |

### 5.2 Architecture
- Application Next.js full-stack (front + API routes / Server Actions).
- Base PostgreSQL hébergée par Supabase, accès via Drizzle ORM.
- Sécurité par **Row Level Security (RLS)** Supabase (données isolées au compte).
- Intégrations externes via API officielles (OAuth2 pour Google, token pour Notion, clé API pour Gemini).
- Variables sensibles dans les **variables d'environnement Vercel** (jamais en clair dans le code).

### 5.3 Intégrations externes
| Intégration | Usage | Mode |
|---|---|---|
| Google Calendar | Synchro agenda (lecture/écriture) | OAuth2 |
| Google Drive | Accès/recherche documents | OAuth2 |
| Google Sheets | Lecture/écriture tableaux | OAuth2 |
| Notion | Accès pages/bases de connaissances | Token d'intégration |
| Google Gemini | Assistant IA | Clé API (free tier) |
| Resend | Envoi d'e-mails | Clé API (free tier) |
| Meta Ads / réseaux | Reporting | **Prévu, non développé** |

### 5.4 Modèle de données (entités principales)
- `companies` (sociétés)
- `contacts` (contacts, liés à company)
- `projects` (projets, liés à company)
- `tasks` (tâches, liées à project — type: tâche/bug/évolution)
- `milestones` (jalons de roadmap, liés à project)
- `calendar_events` (événements, liés à project/company, id Google)
- `time_entries` (temps, liés à task/project, facturable)
- `quotes` (devis) + `quote_items`
- `invoices` (factures) + `invoice_items`
- `payments` (paiements, liés à invoice)
- `content_items` (calendrier éditorial)
- `reports` (comptes rendus)
- `documents` (ressources/fichiers, liens externes)
- `ai_generations` (historique IA)
- `automations` (règles)
- `integrations` (tokens/connexions)
- `settings` (préférences)

*(Schéma relationnel détaillé fourni dans le PRD, section 9.)*

### 5.5 Exigences non-fonctionnelles
- **Responsive** (desktop prioritaire, mobile fonctionnel).
- **Performance** : chargement initial < 2 s, interactions fluides (rendu serveur + cache).
- **Disponibilité** : dépend des SLA gratuits Vercel/Supabase (suffisant pour un usage perso).
- **Accessibilité** : composants Radix (a11y de base).
- **Thème clair/sombre**.
- **Langue** : interface en français.

### 5.6 Sécurité & RGPD
- Authentification obligatoire (OAuth Google).
- RLS Postgres : isolation stricte des données.
- Secrets en variables d'environnement chiffrées (Vercel).
- HTTPS systématique.
- Tokens d'intégration stockés chiffrés.
- Données clients (contacts) : usage strictement professionnel, droit à l'effacement (suppression possible).
- Export/sauvegarde des données à la demande.

---

## 6. Déploiement (Vercel)
1. Dépôt Git (GitHub) connecté à Vercel (CI/CD automatique).
2. Projet Supabase (DB + Auth + Storage) provisionné, migrations Drizzle appliquées.
3. Variables d'environnement configurées sur Vercel :
   - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `NOTION_TOKEN`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
4. Domaine : sous-domaine Vercel par défaut, possibilité d'un domaine personnalisé.
5. Vercel Cron pour les automatisations.
6. Environnements : `production` + `preview` (branches).

---

## 7. Lotissement (phases de réalisation)
> Pas de MVP livré séparément, mais une **construction par lots** pour structurer le développement vers le livrable final.

| Lot | Contenu | 
|---|---|
| **L0 — Fondations** | Projet Next.js, Supabase, Auth Google, layout, navigation, thème, modèle de données |
| **L1 — Pilotage** | Clients/Sociétés, Projets/Roadmaps, Tâches, Tableau de bord |
| **L2 — Temps & Agenda** | Suivi du temps, Agenda + synchro Google Calendar |
| **L3 — Finances** | Devis, Factures PDF, Paiements, TVA/URSSAF, dashboard financier |
| **L4 — IA & Contenus** | Assistant IA (Gemini), Comptes rendus, Calendrier éditorial |
| **L5 — Intégrations & Docs** | Notion/Drive/Sheets, Documents & Ressources |
| **L6 — Dashboards & Automatisations** | KPI, graphiques, rappels, Vercel Cron |
| **L7 — Finitions** | Responsive, polish UX, export données, déploiement final |

---

## 8. Budget & coûts d'exploitation

| Service | Offre | Coût |
|---|---|---|
| Vercel | Hobby | 0 € |
| Supabase | Free | 0 € |
| Google APIs | Calendar/Drive/Sheets | 0 € |
| Notion API | Gratuit | 0 € |
| Google Gemini | Free tier | 0 € |
| Resend | Free (100 e-mails/jour) | 0 € |
| Domaine (optionnel) | — | ~10–15 €/an |

**Total mensuel : ≈ 0 €** (hors domaine personnalisé optionnel).

---

## 9. Livrables
1. Code source (dépôt Git) de l'application complète.
2. Application déployée et fonctionnelle sur Vercel.
3. Base de données Supabase configurée (schéma + RLS).
4. Documentation : ce cahier des charges + le PRD + un README d'installation/configuration.
5. Guide de configuration des intégrations (Google, Notion, Gemini, Resend).

---

## 10. Points d'attention / décisions ouvertes
- Nom définitif de l'application.
- Domaine personnalisé souhaité ou non.
- Régime fiscal exact (auto-entrepreneur / EI / EURL) pour paramétrer TVA/URSSAF précisément.
- Préférences visuelles (charte graphique, couleurs, logo).
- Modèles de documents (format des factures/CR souhaité).
