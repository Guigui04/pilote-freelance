-- ===========================================================================
-- PILOTE — Configuration Supabase (à exécuter dans le SQL Editor de Supabase)
-- ===========================================================================
-- 1) Les tables sont créées par les migrations Drizzle :
--      npm run db:push        (applique le schéma directement)
--    ou
--      npm run db:migrate     (applique les fichiers de migration générés)
--
-- 2) Ce script crée le bucket de stockage des documents et ses règles d'accès.
-- ---------------------------------------------------------------------------

-- Bucket public pour les documents/livrables téléversés
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Lecture publique des fichiers du bucket (les URL publiques fonctionnent)
drop policy if exists "Lecture publique documents" on storage.objects;
create policy "Lecture publique documents"
  on storage.objects for select
  using (bucket_id = 'documents');

-- NB : l'écriture et la suppression de fichiers se font côté serveur avec la
-- clé service_role (SUPABASE_SERVICE_ROLE_KEY), qui contourne les policies.
-- L'accès aux données applicatives est sécurisé dans le code (auth + filtre
-- par user_id) car Drizzle se connecte avec le rôle Postgres.
