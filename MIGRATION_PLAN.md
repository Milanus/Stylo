# API-Driven Transformation Types - Migration Plan

## Status Legend
- ⬜ TODO
- 🔄 IN PROGRESS
- ✅ HOTOVO

---

## Fáza 1: Databáza

### 1.1 Prisma Schema Update ✅ HOTOVO
**Súbor:** `prisma/schema.prisma`

Pridať model `TransformationType`:
```prisma
model TransformationType {
  id          String   @id @default(uuid())
  slug        String   @unique
  label       String
  description String
  icon        String
  prompt      String   @db.Text
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  transformations Transformation[]

  @@map("transformation_types")
}
```

Pridať reláciu do `Transformation`:
```prisma
transformationTypeRef TransformationType? @relation(fields: [transformationType], references: [slug])
```

### 1.2 Run Migration ✅ HOTOVO
**Súbory vytvorené:**
- `prisma/migrations/add_transformation_types.sql` - CREATE TABLE
- `prisma/seed-transformation-types.sql` - INSERT data

**Spustiť manuálne:**
```bash
# 1. Migration
psql $DATABASE_URL -f prisma/migrations/add_transformation_types.sql

# 2. Seed
psql $DATABASE_URL -f prisma/seed-transformation-types.sql
```

### 1.3 Seed Script ✅ HOTOVO
**Súbor:** `prisma/seed-transformation-types.sql`

- Obsahuje všetkých 10 typov transformácií s promptami
- UUID generované cez gen_random_uuid()

### 1.4 Run Seed ⬜
Poznámka: Užívateľ spustí manuálne cez psql (DATABASE_URL z .env)

---

## Fáza 2: Backend API

### 2.1 Caching Layer ✅ HOTOVO
**Nový súbor:** `lib/cache/transformation-types.ts`

Funkcie:
- `getCachedTransformationTypes()` - public typy bez promptov, cache 5 min
- `getCachedTransformationPrompt(slug)` - prompt pre server-side
- `getCachedTransformationType(slug)` - full detail server-side
- `invalidateCache()` - vymazanie cache
- `getActiveTransformationSlugs()` - pre validáciu

### 2.2 API Endpoint - GET Types ✅ HOTOVO
**Nový súbor:** `app/api/transformation-types/route.ts`

```typescript
GET /api/transformation-types
// Vracia: { data: [{ slug, label, description, icon, sortOrder }] }
// BEZ promptov!
```

### 2.3 Update Transform API ✅ HOTOVO
**Súbor:** `app/api/transform/route.ts`

Zmeny:
- Nahradené `getSystemPrompt()` → `getCachedTransformationPrompt()`
- Prompt sa načítava z DB server-side
- Language modifications aplikované na prompt
- Odstránený GET endpoint (presunul sa do `/api/transformation-types`)

### 2.4 Dynamic Validation ⬜
**Súbor:** `lib/utils/validation.ts`

Zmeniť z hardcoded enum na dynamickú validáciu voči DB.

---

## Fáza 3: Frontend

### 3.1 Hook useTransformationTypes ✅ HOTOVO
**Nový súbor:** `hooks/useTransformationTypes.ts`

```typescript
export function useTransformationTypes() {
  // Fetch z /api/transformation-types
  // Return: { types, isLoading, error }
}
```

### 3.2 TypeScript Types ✅ HOTOVO
**Nový súbor:** `types/transformation.ts`

```typescript
export interface TransformationType {
  slug: string
  label: string
  description: string
  icon: string
  sortOrder: number
}
```

### 3.3 Update Dashboard ✅ HOTOVO
**Súbor:** `app/[locale]/dashboard/page.tsx`

- Použiť `useTransformationTypes()` namiesto `TRANSFORMATION_TYPES`
- Pridať loading state

### 3.4 Update FeaturesSection ✅ HOTOVO
**Súbor:** `components/landing/FeaturesSection.tsx`

- Server-side fetch typov
- Alebo použiť hook s SSR

### 3.5 Update HistoryDrawer ✅ HOTOVO
**Súbor:** `components/HistoryDrawer.tsx`

- Lookup typov z API/cache

---

## Fáza 4: Cleanup

### 4.1 Deprecate Old Constants ⬜
**Súbor:** `lib/constants/transformations.ts`

- Pridať JSDoc deprecation warning
- Zachovať pre backward compatibility

### 4.2 Update Translations ⬜
**Súbory:** `messages/*.json`

- Preklady typov budú načítavané z DB alebo ponechať v JSON?

### 4.3 Remove Unused Imports ⬜
- Odstrániť importy `TRANSFORMATION_TYPES` kde nie sú potrebné

---

## Fáza 5: Verifikácia

### 5.1 API Tests ⬜
```bash
# Test GET types
curl http://localhost:3000/api/transformation-types

# Test transform
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"text": "hello", "transformationType": "grammar"}'

# Test invalid type
curl -X POST http://localhost:3000/api/transform \
  -d '{"text": "hello", "transformationType": "invalid"}'
```

### 5.2 Build Test ⬜
```bash
npm run build
```

### 5.3 E2E Test ⬜
- Dashboard zobrazuje typy z API
- Transformácia funguje
- History zobrazuje správne ikony/labels

---

## Súhrn súborov

| Súbor | Akcia | Status |
|-------|-------|--------|
| `prisma/schema.prisma` | Update | ✅ |
| `prisma/seed-transformation-types.sql` | Nový | ✅ |
| `lib/cache/transformation-types.ts` | Nový | ✅ |
| `app/api/transformation-types/route.ts` | Nový | ✅ |
| `app/api/transform/route.ts` | Update | ✅ |
| `lib/utils/validation.ts` | Update | ⬜ |
| `hooks/useTransformationTypes.ts` | Nový | ✅ |
| `types/transformation.ts` | Nový | ✅ |
| `app/[locale]/dashboard/page.tsx` | Update | ✅ |
| `components/landing/FeaturesSection.tsx` | Update | ✅ |
| `components/HistoryDrawer.tsx` | Update | ✅ |
| `lib/constants/transformations.ts` | Deprecate | ⬜ |

---

## Poznámky pre pokračovanie

### ✅ HOTOVO - Čo je dokončené:

1. **Databáza**
   - ✅ Prisma schema s TransformationType modelom
   - ✅ SQL migrácia súbor vytvorený
   - ✅ Seed SQL súbor s 10 transformation types
   - ⚠️ **USER ACTION NEEDED**: Spustite seed script manuálne pomocou psql

2. **Backend API**
   - ✅ Caching layer s in-memory cache (5min TTL)
   - ✅ GET /api/transformation-types endpoint
   - ✅ Transform API upravené na DB lookup
   - ✅ Prisma Client regenerovaný

3. **Frontend**
   - ✅ useTransformationTypes React hook
   - ✅ TypeScript types (TransformationType interface)
   - ✅ Dashboard page updatovaný s loading states
   - ✅ FeaturesSection updatovaný
   - ✅ HistoryDrawer updatovaný

4. **Preklady**
   - ✅ Pridaný `dashboard.errors.loadingTypes` do všetkých jazykov (en, cs, sk, es, de)

5. **Build**
   - ✅ TypeScript type-check úspešný
   - ✅ Next.js production build úspešný

### ⬜ TODO - Čo ostáva:

1. **Seed Database** (USER ACTION)
   ```bash
   psql "$DATABASE_URL" -f prisma/seed-transformation-types.sql
   ```

2. **Testovanie**
   - Otestujte API endpoint: `curl http://localhost:3000/api/transformation-types`
   - Otestujte frontend v prehliadači
   - Overte celý transformation flow

3. **Cleanup** (Voliteľné)
   - Deprecate `lib/constants/transformations.ts`
   - Odstrániť nepoužité importy
   - Update validation.ts na dynamic validation

### 🚀 Ako pokračovať:

1. Najprv spustite seed script (viď vyššie)
2. Spustite dev server: `npm run dev`
3. Otvorte dashboard a overte, že transformation types sa načítajú z API
4. Otestujte transformácie s rôznymi typmi
5. Skontrolujte, či všetko funguje správne
