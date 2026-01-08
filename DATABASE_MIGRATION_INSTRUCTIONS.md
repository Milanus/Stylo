# Database Migration Instructions

## Manuálna aplikácia migrácie pre `user_agent` pole

### Možnosť 1: Supabase Dashboard (Odporúčané)

1. Otvor Supabase Dashboard: https://supabase.com/dashboard
2. Vyber tvoj projekt
3. V ľavom menu klikni na **SQL Editor**
4. Vytvor nový query a skopíruj nasledujúci SQL kód:

```sql
-- Add user_agent column to usage_logs table
ALTER TABLE usage_logs
ADD COLUMN IF NOT EXISTS user_agent VARCHAR(255);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_agent
ON usage_logs(user_agent);

-- Add documentation comment
COMMENT ON COLUMN usage_logs.user_agent IS 'User agent string for fingerprinting and security analysis';
```

5. Klikni **Run** alebo stlač `Ctrl/Cmd + Enter`
6. Over úspešnosť migrácie:

```sql
-- Verify column was added
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'usage_logs' AND column_name = 'user_agent';

-- Should return:
-- column_name | data_type      | character_maximum_length
-- user_agent  | character varying | 255
```

---

### Možnosť 2: Prisma db push (Terminal)

```bash
cd /Users/milanschon/Desktop/helper_projekt/text-editor-app

# Použiť direct connection namiesto pooled connection
# Nahraď port 6543 (pooler) za 5432 (direct)
DATABASE_URL="postgresql://postgres.ebblnqirzhmyncpkscux:cogwe0-jurpec-zaxxEf@aws-1-eu-west-1.pooler.supabase.com:5432/postgres" npx prisma db push
```

**Poznámka:** Direct connection používa port `5432` namiesto pooled `6543`

---

### Možnosť 3: psql CLI (ak máš nainštalované)

```bash
# Pripojiť sa k databáze
psql "postgresql://postgres.ebblnqirzhmyncpkscux:cogwe0-jurpec-zaxxEf@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# Spustiť SQL príkazy
\i prisma/migrations/add_user_agent_to_usage_logs.sql

# Overiť zmeny
\d usage_logs

# Odpojiť sa
\q
```

---

### Možnosť 4: Supabase CLI

```bash
# Nainštalovať Supabase CLI (ak ešte nemáš)
brew install supabase/tap/supabase

# Prihlásiť sa
supabase login

# Link projekt
supabase link --project-ref ebblnqirzhmyncpkscux

# Spustiť migráciu
supabase db execute --file prisma/migrations/add_user_agent_to_usage_logs.sql
```

---

## Verifikácia po migrácii

Po úspešnom spustení migrácie over funkčnosť:

### 1. Skontroluj štruktúru tabuľky

```sql
SELECT
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'usage_logs'
ORDER BY ordinal_position;
```

**Očakávaný výstup:**

| column_name | data_type | character_maximum_length | is_nullable |
|------------|-----------|-------------------------|-------------|
| id | bigint | NULL | NO |
| user_id | character varying | 255 | YES |
| ip_address | character varying | 255 | YES |
| endpoint | character varying | 100 | NO |
| user_agent | character varying | 255 | YES |
| created_at | timestamp without time zone | NULL | NO |

### 2. Skontroluj indexy

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'usage_logs';
```

**Očakávaný výstup obsahuje:**

```
idx_usage_logs_user_agent | CREATE INDEX idx_usage_logs_user_agent ON public.usage_logs USING btree (user_agent)
```

### 3. Test funkčnosti API

```bash
# Spusti lokálny server
npm run dev

# V druhom terminále pošli test request
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Test Migration)" \
  -d '{
    "text": "Test text",
    "transformationType": "grammar"
  }'
```

### 4. Overiť záznam v databáze

```sql
-- Pozri posledný záznam v usage_logs
SELECT id, user_id, ip_address, endpoint, user_agent, created_at
FROM usage_logs
ORDER BY created_at DESC
LIMIT 5;
```

**Očakávaný výstup:**
- `user_agent` pole by malo obsahovať hodnotu (napr. `"Mozilla/5.0 (Test Migration)"`)
- Nie je NULL

---

## Regenerácia Prisma Client

Po úspešnej migrácii regeneruj Prisma client:

```bash
cd /Users/milanschon/Desktop/helper_projekt/text-editor-app

# Regeneruj Prisma Client
npx prisma generate

# Reštartuj Next.js dev server
# Ctrl+C a potom:
npm run dev
```

---

## Rollback (ak niečo zlyhá)

Ak potrebuješ vrátiť zmeny:

```sql
-- Odstráň index
DROP INDEX IF EXISTS idx_usage_logs_user_agent;

-- Odstráň stĺpec
ALTER TABLE usage_logs DROP COLUMN IF EXISTS user_agent;
```

---

## Časté problémy a riešenia

### Problém: "prepared statement already exists"

**Riešenie:** Používaš pooled connection. Použi direct connection (port 5432):

```bash
DATABASE_URL="postgresql://postgres.ebblnqirzhmyncpkscux:cogwe0-jurpec-zaxxEf@aws-1-eu-west-1.pooler.supabase.com:5432/postgres" npx prisma db push
```

### Problém: "permission denied"

**Riešenie:** Over že máš správne prihlasovacie údaje a práva v Supabase projekte.

### Problém: "column already exists"

**Riešenie:** Migrácia už bola spustená. Over s:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'usage_logs' AND column_name = 'user_agent';
```

Ak vráti výsledok, migrácia je už hotová. ✅

---

## Po úspešnej migrácii

1. ✅ Odstráň tento súbor (ak chceš)
2. ✅ Aktualizuj `prisma/migrations/add_user_agent_to_usage_logs.sql` s dátumom
3. ✅ Commit zmeny do Git:

```bash
git add .
git commit -m "feat: add user_agent tracking to usage_logs for enhanced security"
git push
```

4. ✅ Deploy na Vercel (automaticky ak máš CI/CD)

---

## Kontakt na support

Ak máš problémy:
- Supabase Docs: https://supabase.com/docs/guides/database/migrations
- Prisma Docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
