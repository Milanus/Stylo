# Databázová migrácia: Pridanie User Prompts

## Prehľad
Táto migrácia pridáva podporu pre vlastné používateľské prompty.

## SQL Migračný skript

```sql
-- Vytvorenie tabuľky user_prompts
CREATE TABLE "user_prompts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "template_id" VARCHAR(20) NOT NULL,
    "keywords" TEXT[] NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_prompts_pkey" PRIMARY KEY ("id")
);

-- Vytvorenie indexov
CREATE INDEX "user_prompts_user_id_idx" ON "user_prompts"("user_id");

-- Vytvorenie unique constraint (používateľ nemôže mať dva prompty s rovnakým názvom)
CREATE UNIQUE INDEX "user_prompts_user_id_name_key" ON "user_prompts"("user_id", "name");

-- Pridanie foreign key
ALTER TABLE "user_prompts" ADD CONSTRAINT "user_prompts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
```

## Manuálne spustenie migrácie

### 1. Cez Supabase Dashboard

1. Prejdite do Supabase projektu
2. Otvorte **SQL Editor**
3. Skopírujte SQL skript vyššie
4. Kliknite **Run**

### 2. Cez Prisma CLI (automaticky)

```bash
cd /Users/milanschon/Desktop/helper_projekt/text-editor-app
npx prisma migrate dev --name add_user_prompts
```

Tento príkaz:
- Vytvorí migračný súbor v `prisma/migrations/`
- Aplikuje migráciu na databázu
- Regeneruje Prisma Client

### 3. Cez psql (príkazový riadok)

```bash
# Pripojenie k databáze
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"

# Spustenie SQL skriptu
\i MIGRATION_add_user_prompts.sql
```

## Verifikácia migrácie

```sql
-- Skontrolujte, či tabuľka existuje
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'user_prompts';

-- Skontrolujte stĺpce
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_prompts';

-- Skontrolujte indexy
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_prompts';
```

## Rollback (v prípade potreby)

```sql
-- Zmazanie tabuľky (CASCADE zmaže všetky foreign keys)
DROP TABLE IF EXISTS "user_prompts" CASCADE;
```

## Testovanie po migrácii

```sql
-- Test: Vytvorenie testovacieho promptu
INSERT INTO "user_prompts" (
    "user_id",
    "name",
    "template_id",
    "keywords",
    "updated_at"
) VALUES (
    '[YOUR_USER_UUID]'::uuid,  -- Nahraďte skutočným UUID používateľa
    'Test Prompt',
    'formal',
    ARRAY['professional', 'concise', 'clear'],
    CURRENT_TIMESTAMP
);

-- Test: Načítanie promptu
SELECT * FROM "user_prompts" WHERE "user_id" = '[YOUR_USER_ID]';

-- Test: Vymazanie testovacieho promptu
DELETE FROM "user_prompts" WHERE "name" = 'Test Prompt';
```

## Poznámky

- Tabuľka `user_prompts` používa `ON DELETE CASCADE`, takže pri zmazaní používateľa sa automaticky zmažú aj všetky jeho prompty
- Unique constraint `(user_id, name)` zabezpečuje, že jeden používateľ nemôže mať dva prompty s rovnakým názvom
- `keywords` je pole (`TEXT[]`) - PostgreSQL podporuje natívne array typy
- `is_active` umožňuje "soft delete" - prompt sa neukáže, ale zostane v databáze

## Príklady dát

```sql
-- Príklad: Formálny biznis štýl
INSERT INTO "user_prompts" (
    "user_id", "name", "template_id", "keywords", "updated_at"
) VALUES (
    '[USER_UUID]'::uuid,  -- Nahraďte skutočným UUID používateľa
    'Business Email',
    'formal',
    ARRAY['professional', 'polite', 'brief', 'action-oriented'],
    CURRENT_TIMESTAMP
);

-- Príklad: Technická dokumentácia
INSERT INTO "user_prompts" (
    "user_id", "name", "template_id", "keywords", "updated_at"
) VALUES (
    '[USER_UUID]'::uuid,  -- Nahraďte skutočným UUID používateľa
    'Technical Docs',
    'technical',
    ARRAY['precise', 'step-by-step', 'code-examples'],
    CURRENT_TIMESTAMP
);

-- Tip: Získanie UUID aktuálneho používateľa
-- SELECT id FROM "user_profiles" WHERE email = 'vas-email@example.com';
```
