# Guide de déploiement — PILOTE

Ce guide explique comment mettre l'application en ligne **gratuitement** (Supabase + Vercel + Gemini + Resend). Compter ~30 minutes.

---

## 1. Prérequis
- Un compte **GitHub** (pour héberger le code)
- Un compte **Supabase** (base de données + auth + stockage)
- Un compte **Google Cloud** (OAuth pour la connexion + Calendar/Drive/Sheets)
- Un compte **Vercel** (hébergement)
- Une clé **Google Gemini** (IA, gratuite) et **Resend** (e-mails, gratuit) — optionnelles mais recommandées

---

## 2. Supabase (base de données, auth, stockage)

1. Crée un projet sur https://supabase.com (région **Europe — eu-west-3** de préférence).
2. Récupère dans **Project Settings → API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
3. Dans **Project Settings → Database → Connection string** :
   - Mode **Transaction** (port 6543) → `DATABASE_URL`
   - Mode **Session/Direct** (port 5432) → `DIRECT_URL`
4. **Active le provider Google** dans **Authentication → Providers → Google** (voir étape 3 pour les identifiants).
5. **Crée les tables** : en local, remplis `.env.local`, puis lance :
   ```bash
   npm run db:push
   ```
6. **Crée le bucket de stockage** : ouvre **SQL Editor** et exécute le contenu de `docs/supabase-setup.sql`.

---

## 3. Google OAuth (connexion + Calendar/Drive/Sheets)

1. Sur https://console.cloud.google.com, crée un projet.
2. **APIs & Services → Library** : active *Google Calendar API*, *Google Drive API*, *Google Sheets API*.
3. **OAuth consent screen** : type « External », ajoute ton e-mail comme utilisateur de test, scopes calendar/drive/sheets.
4. **Credentials → Create OAuth client ID → Web application** :
   - **Authorized redirect URIs** : ajoute l'URL de callback Supabase
     `https://<ton-projet>.supabase.co/auth/v1/callback`
   - Récupère `Client ID` → `GOOGLE_CLIENT_ID` et `Client secret` → `GOOGLE_CLIENT_SECRET`
5. Renseigne ces identifiants **dans Supabase** (Authentication → Providers → Google) **et** dans les variables d'environnement.

> La connexion par **lien magique e-mail** fonctionne aussi sans Google.

---

## 4. Clés IA & e-mail (gratuites)

- **Gemini** : crée une clé sur https://aistudio.google.com/app/apikey → `GEMINI_API_KEY`
- **Resend** : crée une clé sur https://resend.com → `RESEND_API_KEY` (et un expéditeur vérifié → `RESEND_FROM_EMAIL`)

---

## 5. Variables d'environnement

Copie `.env.example` en `.env.local` (local) et reporte les mêmes valeurs dans **Vercel → Settings → Environment Variables**. Variables clés :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Connexion Supabase (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Stockage de fichiers (serveur) |
| `DATABASE_URL` / `DIRECT_URL` | Base Postgres (Drizzle) |
| `ALLOWED_EMAIL` | **Ton e-mail** — seul autorisé à se connecter |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `GEMINI_API_KEY` | Assistant IA |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Envoi de factures par e-mail |
| `NOTION_TOKEN` | Intégration Notion (optionnel) |
| `CRON_SECRET` | Protège l'endpoint `/api/cron` (recommandé) |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app |

---

## 6. Déploiement sur Vercel

1. Pousse le code sur GitHub :
   ```bash
   git remote add origin https://github.com/<toi>/pilote-freelance.git
   git push -u origin main
   ```
2. Sur https://vercel.com → **Add New Project** → importe le dépôt.
3. Ajoute **toutes les variables d'environnement** (étape 5).
4. **Deploy**. Vercel détecte Next.js automatiquement.
5. Le **cron quotidien** (`vercel.json`, 7 h) s'active tout seul.
6. Mets à jour `NEXT_PUBLIC_APP_URL` avec l'URL finale, et ajoute cette URL dans les redirections autorisées si besoin.

---

## 7. Première connexion
1. Ouvre l'app, connecte-toi avec l'e-mail défini dans `ALLOWED_EMAIL` (Google ou lien magique).
2. Va dans **Paramètres** : renseigne ton identité (facturation), ton régime fiscal et tes taux.
3. C'est prêt 🎉

---

## 8. Développement local
```bash
npm install
cp .env.example .env.local   # puis remplir
npm run db:push              # crée les tables
npm run dev                  # http://localhost:3000
```

Pour le développement local de Google OAuth, ajoute aussi
`http://localhost:3000/auth/callback` (côté Supabase, l'URL de redirection reste celle de Supabase).
