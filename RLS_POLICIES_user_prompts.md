# Row Level Security (RLS) Politiky pre user_prompts

## Prehľad
RLS politiky zabezpečujú, že používatelia môžu pristupovať len k svojim vlastným promptom.

## SQL Príkazy

### 1. Povoliť RLS na tabuľke
```sql
ALTER TABLE "user_prompts" ENABLE ROW LEVEL SECURITY;
```

### 2. Policy: SELECT - Čítanie vlastných promptov
```sql
CREATE POLICY "Users can view their own prompts"
ON "user_prompts"
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

### 3. Policy: INSERT - Vytváranie vlastných promptov
```sql
CREATE POLICY "Users can create their own prompts"
ON "user_prompts"
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
```

### 4. Policy: UPDATE - Úprava vlastných promptov
```sql
CREATE POLICY "Users can update their own prompts"
ON "user_prompts"
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### 5. Policy: DELETE - Mazanie vlastných promptov
```sql
CREATE POLICY "Users can delete their own prompts"
ON "user_prompts"
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

---

## Všetko naraz (kompletné RLS nastavenie)

```sql
-- 1. Povoliť RLS
ALTER TABLE "user_prompts" ENABLE ROW LEVEL SECURITY;

-- 2. SELECT policy
CREATE POLICY "Users can view their own prompts"
ON "user_prompts"
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3. INSERT policy
CREATE POLICY "Users can create their own prompts"
ON "user_prompts"
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 4. UPDATE policy
CREATE POLICY "Users can update their own prompts"
ON "user_prompts"
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 5. DELETE policy
CREATE POLICY "Users can delete their own prompts"
ON "user_prompts"
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

---

## Verifikácia

### Skontrolovať či je RLS povolený
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_prompts';
```

Očakávaný výstup:
```
 tablename    | rowsecurity
--------------+-------------
 user_prompts | t
```

### Zobraziť všetky politiky
```sql
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_prompts';
```

---

## Testovanie RLS

### Test 1: Používateľ vidí len svoje prompty
```sql
-- Prihlás sa ako User A
-- Spusti dotaz
SELECT * FROM user_prompts;
-- Mal by vidieť len svoje prompty
```

### Test 2: Používateľ nemôže čítať cudzie prompty
```sql
-- Prihlás sa ako User A
-- Skús prečítať prompt User B
SELECT * FROM user_prompts WHERE user_id = '[USER_B_UUID]';
-- Mal by vrátiť prázdny výsledok
```

### Test 3: Používateľ nemôže vytvoriť prompt pre iného
```sql
-- Prihlás sa ako User A
-- Skús vytvoriť prompt pre User B
INSERT INTO user_prompts (id, user_id, name, prompt, keywords, updated_at)
VALUES (gen_random_uuid(), '[USER_B_UUID]', 'Test', 'test prompt', ARRAY['test'], CURRENT_TIMESTAMP);
-- Mal by zlyhať s chybou: new row violates row-level security policy
```

---

## Odstránenie RLS (rollback)

Ak potrebuješ odstrániť RLS:

```sql
-- Zmazať všetky politiky
DROP POLICY IF EXISTS "Users can view their own prompts" ON "user_prompts";
DROP POLICY IF EXISTS "Users can create their own prompts" ON "user_prompts";
DROP POLICY IF EXISTS "Users can update their own prompts" ON "user_prompts";
DROP POLICY IF EXISTS "Users can delete their own prompts" ON "user_prompts";

-- Vypnúť RLS
ALTER TABLE "user_prompts" DISABLE ROW LEVEL SECURITY;
```

---

## Poznámky

- **`auth.uid()`** - Funkcia Supabase ktorá vracia UUID aktuálne prihláseného používateľa
- **`TO authenticated`** - Politika sa aplikuje len na autentifikovaných používateľov
- **`USING`** - Podmienka pre čítanie/úpravu existujúcich riadkov
- **`WITH CHECK`** - Podmienka pre vkladanie/úpravu nových hodnôt
- Anonymní používatelia (nie sú prihlásení) **nebudú môcť pristupovať** k žiadnym dátam v tabuľke

## Bezpečnosť

RLS zabezpečí:
1. ✅ Používateľ vidí len svoje prompty
2. ✅ Používateľ nemôže čítať cudzie prompty
3. ✅ Používateľ nemôže upravovať cudzie prompty
4. ✅ Používateľ nemôže zmazať cudzie prompty
5. ✅ Používateľ nemôže vytvoriť prompt pre iného používateľa
6. ✅ Anonymní používatelia nemajú prístup k tabuľke
