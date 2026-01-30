# TODO: Implementácia Mistral AI modelu

## Prehľad
Pridanie podpory pre Mistral AI ako alternatívneho LLM providera popri existujúcom OpenAI.

---

## Úlohy

### 1. Vytvorenie Mistral klienta
- [ ] Vytvoriť `lib/llm/mistral.ts` - konfigurácia Mistral klienta
- [ ] Pridať environment premennú `MISTRAL_API_KEY` do `.env.local`
- [ ] Definovať dostupné Mistral modely a ich pricing

### 2. Abstrakcia LLM providera
- [ ] Vytvoriť `lib/llm/provider.ts` - spoločné rozhranie pre všetkých LLM providerov
- [ ] Definovať typy: `LLMProvider`, `LLMResponse`, `LLMConfig`
- [ ] Implementovať factory pattern pre výber providera

### 3. Aktualizácia Transform API
- [ ] Upraviť `app/api/transform/route.ts` - pridať parameter pre výber modelu/providera
- [ ] Aktualizovať validation schema v `lib/utils/validation.ts`
- [ ] Pridať fallback logiku ak jeden provider zlyhá

### 4. Aktualizácia databázy
- [ ] Rozšíriť pole `modelUsed` v tabuľke `Transformation` pre Mistral modely
- [ ] Pridať tracking pre provider (openai/mistral)

### 5. Frontend integrácia
- [ ] Pridať výber modelu do UI (voliteľné)
- [ ] Zobraziť informácie o použitom modeli v odpovedi

---

## Mistral modely a pricing

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| mistral-small-latest | $0.20 | $0.60 |
| mistral-medium-latest | $2.70 | $8.10 |
| mistral-large-latest | $3.00 | $9.00 |

---

## Štruktúra súborov

```
lib/llm/
├── openai.ts          # existujúci OpenAI klient
├── mistral.ts         # nový Mistral klient
├── provider.ts        # abstrakcia providera
├── prompts.ts         # existujúce prompty
└── user-prompt-builder.ts
```

---

## Príklad použitia

```typescript
// lib/llm/provider.ts
import { openai } from './openai'
import { mistral } from './mistral'

export type Provider = 'openai' | 'mistral'

export async function callLLM(
  provider: Provider,
  systemPrompt: string,
  userPrompt: string,
  options?: LLMOptions
): Promise<LLMResponse> {
  switch (provider) {
    case 'mistral':
      return callMistral(systemPrompt, userPrompt, options)
    case 'openai':
    default:
      return callOpenAI(systemPrompt, userPrompt, options)
  }
}
```

---

## Environment premenné

Pridať do `.env.local`:
```
MISTRAL_API_KEY=your_mistral_api_key_here
DEFAULT_LLM_PROVIDER=openai  # alebo 'mistral'
```

---

# TODO: Správa histórie a čistenie starých dát

## Prehľad
Implementácia limitov pre históriu transformácií na používateľa a automatické mazanie starých záznamov.

---

## Úlohy

### 1. Limity histórie na používateľa
- [x] Definovať limity podľa subscription tier v `lib/constants/history-limits.ts`
- [x] Implementovať kontrolu limitu pri vytváraní novej transformácie
- [x] Automaticky zmazať najstaršie záznamy keď sa dosiahne limit

### 2. Automatické čistenie starých dát
- [x] Vytvoriť `lib/jobs/cleanup-history.ts` - cleanup job
- [x] Nastaviť Vercel Cron Job pre pravidelné spúšťanie
- [x] Definovať retenčnú politiku (napr. 30/90/365 dní podľa tier)

### 3. API endpoint pre správu histórie
- [x] Pridať DELETE endpoint do `app/api/history/route.ts`
- [x] Umožniť používateľovi manuálne zmazať svoju históriu
- [x] Pridať bulk delete pre staré záznamy

### 4. Databázové optimalizácie
- [x] Pridať index na `createdAt` v tabuľke `Transformation`
- [x] Pridať index na kombináciu `userId` + `createdAt`

---

## Limity podľa subscription tier

| Tier | Max záznamov | Retencia (dni) |
|------|--------------|----------------|
| anonymous | 0 (neukladá sa) | - |
| free | 50 | 30 |
| pro | 500 | 90 |
| enterprise | neobmedzené | 365 |

---

## Implementácia

### Konfigurácia limitov

```typescript
// lib/constants/history-limits.ts
export const HISTORY_LIMITS = {
  anonymous: {
    maxRecords: 0,
    retentionDays: 0,
  },
  free: {
    maxRecords: 50,
    retentionDays: 30,
  },
  pro: {
    maxRecords: 500,
    retentionDays: 90,
  },
  enterprise: {
    maxRecords: null, // unlimited
    retentionDays: 365,
  },
} as const
```

### Cleanup Job

```typescript
// lib/jobs/cleanup-history.ts
import { prisma } from '@/lib/db/prisma'
import { HISTORY_LIMITS } from '@/lib/constants/history-limits'

export async function cleanupOldTransformations() {
  const now = new Date()

  for (const [tier, limits] of Object.entries(HISTORY_LIMITS)) {
    if (limits.retentionDays === 0) continue

    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - limits.retentionDays)

    // Zmazať záznamy staršie ako retencia
    await prisma.transformation.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        user: {
          subscriptionTier: tier,
        },
      },
    })
  }
}

export async function enforceUserHistoryLimit(userId: string, tier: string) {
  const limit = HISTORY_LIMITS[tier as keyof typeof HISTORY_LIMITS]?.maxRecords
  if (!limit) return // unlimited

  const count = await prisma.transformation.count({
    where: { userId },
  })

  if (count >= limit) {
    // Zmazať najstaršie záznamy
    const toDelete = count - limit + 1
    const oldestRecords = await prisma.transformation.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: toDelete,
      select: { id: true },
    })

    await prisma.transformation.deleteMany({
      where: {
        id: { in: oldestRecords.map(r => r.id) },
      },
    })
  }
}
```

### Vercel Cron Job

```typescript
// app/api/cron/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cleanupOldTransformations } from '@/lib/jobs/cleanup-history'

export async function GET(request: NextRequest) {
  // Overenie že request je od Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await cleanupOldTransformations()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cleanup job failed:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}
```

### vercel.json konfigurácia

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## Environment premenné pre cleanup

```
CRON_SECRET=your_cron_secret_here
```

---

# TODO: Human-like prompty

## Prehľad
Upraviť systémové prompty tak, aby výstup pôsobil prirodzene a ľudsky, nie ako text generovaný AI.

---

## Úlohy

### 1. Audit existujúcich promptov
- [x] Prejsť všetky prompty v `lib/constants/transformations.ts`
- [x] Identifikovať "AI-like" vzory vo výstupoch
- [x] Otestovať výstupy na AI detektoroch (GPTZero, Originality.ai)

### 2. Úprava systémových promptov
- [x] Pridať inštrukcie pre prirodzený štýl písania
- [x] Odstrániť typické AI vzory (nadmerné používanie "however", "furthermore", atď.)
- [x] Pridať variabilitu do výstupov

### 3. Konfigurovateľná "human-likeness"
- [x] Pridať parameter `humanize: boolean` do API
- [x] Vytvoriť humanizačné pravidlá v `lib/constants/humanize-rules.ts`

---

## Typické AI vzory na odstránenie

| AI vzor | Prirodzená alternatíva |
|---------|------------------------|
| "However, it is important to note that..." | Priame tvrdenie |
| "In conclusion..." | Vynechať alebo prirodzený prechod |
| "Furthermore..." | "Tiež", "A ešte", alebo vynechať |
| "It's worth mentioning that..." | Priamo spomenúť |
| "Delve into" | "Pozrieť sa na", "Preskúmať" |
| Nadmerné používanie pasívu | Aktívny hlas |
| Príliš dokonalá štruktúra | Prirodzenejší tok |

---

## Implementácia

### Humanizačné pravidlá

```typescript
// lib/constants/humanize-rules.ts
export const HUMANIZE_INSTRUCTIONS = `
DÔLEŽITÉ PRAVIDLÁ PRE PRIRODZENÝ ŠTÝL:

1. VYHNI SA typickým AI frázam:
   - Nepoužívaj: "however", "furthermore", "moreover", "in conclusion"
   - Nepoužívaj: "it's important to note", "it's worth mentioning"
   - Nepoužívaj: "delve into", "dive deep", "unpack"

2. PIŠ PRIRODZENE:
   - Používaj krátke a dlhé vety striedavo
   - Občas začni vetu spojkou (A, Ale, Takže)
   - Použi hovorové výrazy kde je to vhodné
   - Nie každý odsek musí mať dokonalú štruktúru

3. VARIABILITA:
   - Nepoužívaj rovnaké slová opakovane
   - Striedaj štýl - niekedy formálnejší, niekedy uvoľnenejší
   - Pridaj občas krátku poznámku alebo vsuvku

4. NEDOKONALOSTI (prirodzené):
   - Občasná kratšia veta. Ako táto.
   - Myšlienka nemusí byť vždy "perfectly wrapped up"
   - Vyhni sa príliš symetrickým štruktúram

5. AUTENTICITA:
   - Píš ako by to písal skúsený človek, nie robot
   - Menej je viac - nepreháňaj s vysvetľovaním
   - Drž sa témy, neodbiehaj do všeobecností
`

export const HUMANIZE_SUFFIX = `

Pamätaj: Tvoj výstup by mal prejsť AI detektormi ako GPTZero.
Píš tak, ako by to napísal vzdelaný človek - prirodzene, s osobitým štýlom.
`
```

### Upravený prompt builder

```typescript
// lib/llm/prompts.ts
import { HUMANIZE_INSTRUCTIONS, HUMANIZE_SUFFIX } from '@/lib/constants/humanize-rules'

export function getSystemPrompt(
  type: TransformationType,
  targetLanguage?: string,
  humanize: boolean = true
): string {
  let prompt = getTransformationPrompt(type, targetLanguage)

  if (humanize) {
    prompt = HUMANIZE_INSTRUCTIONS + '\n\n' + prompt + HUMANIZE_SUFFIX
  }

  return prompt
}
```

### API parameter

```typescript
// V validation schema pridať:
humanize: z.boolean().optional().default(true)

// V route.ts použiť:
const systemPrompt = getSystemPrompt(
  transformationType,
  targetLanguage,
  validationResult.data.humanize
)
```

---

## Testovanie

### Manuálne testovanie
1. Vygenerovať 10 vzorových textov
2. Otestovať na GPTZero, Originality.ai, ZeroGPT
3. Cieľ: < 20% AI detection score

### A/B testovanie
- [ ] Porovnať výstupy s/bez humanizácie
- [ ] Zbierať feedback od používateľov
- [ ] Sledovať metriky kvality

---

# TODO: Marketingová analýza a kľúčové slová

## Prehľad
Identifikovať kľúčové slová a trhové príležitosti kde môže Stylo bodovať oproti konkurencii.

---

## Úlohy

### 1. Keyword research
- [ ] Analyzovať search volume pre cieľové kľúčové slová
- [ ] Identifikovať long-tail keywords s nižšou konkurenciou
- [ ] Zmapovať keywords podľa user intent (informational, transactional)

### 2. Konkurenčná analýza
- [ ] Identifikovať hlavných konkurentov (Grammarly, QuillBot, Wordtune, Copy.ai)
- [ ] Analyzovať ich keyword stratégiu
- [ ] Nájsť medzery na trhu (gaps)

### 3. Lokálne trhy (SK/CZ)
- [ ] Výskum slovenských a českých kľúčových slov
- [ ] Analyzovať lokálnu konkurenciu
- [ ] Prispôsobiť messaging pre lokálny trh

### 4. SEO implementácia
- [ ] Optimalizovať landing pages pre cieľové keywords
- [ ] Vytvoriť content strategy (blog, guides)
- [ ] Nastaviť tracking (Google Search Console, Analytics)

---

## Potenciálne kľúčové slová

### Hlavné kategórie

| Kategória | Príklady keywords | Potenciál |
|-----------|-------------------|-----------|
| AI writing | "ai text editor", "ai writing assistant", "ai copywriting tool" | Vysoký |
| Text transformation | "rewrite text online", "paraphrase tool", "text improver" | Vysoký |
| Grammar/Style | "grammar checker", "style checker", "tone changer" | Stredný |
| Specific use cases | "email rewriter", "essay improver", "social media caption generator" | Vysoký |
| Localized | "ai pisanie textov", "prepisovač textov", "úprava textu online" | Nízka konkurencia |

### Long-tail keywords (nižšia konkurencia)

**Anglické:**
- "make my text sound more professional"
- "rewrite text to sound human"
- "change tone of text from casual to formal"
- "simplify complex text online"
- "expand short text to longer"
- "make email sound friendlier"
- "fix awkward sentences"
- "improve my writing style free"

**Slovenské/České:**
- "prepísať text inak"
- "vylepšiť text zadarmo"
- "zmeniť štýl písania"
- "formálny text generátor"
- "ako písať profesionálne emaily"
- "úprava textu AI"
- "prepisovanie textov online"

---

## Konkurenčná analýza

### Hlavní konkurenti

| Konkurent | Silné stránky | Slabé stránky | Príležitosť pre Stylo |
|-----------|---------------|---------------|------------------------|
| **Grammarly** | Brand awareness, integrácie | Drahý, komplexný | Jednoduchší UX, nižšia cena |
| **QuillBot** | Paraphrasing, freemium | Generický výstup | Lepšia kvalita, human-like |
| **Wordtune** | Rýchly, intuitívny | Limitované funkcie | Viac transformácií |
| **Copy.ai** | Marketing copy | Nie pre bežné texty | Širší záber použitia |
| **ChatGPT** | Univerzálny | Nie špecializovaný | Špecifické use cases |

### Medzery na trhu (opportunities)

1. **Lokálny trh SK/CZ** - žiadna kvalitná lokálna alternatíva
2. **Human-like output** - väčšina nástrojov produkuje "AI-like" text
3. **Jednoduché use cases** - rýchla úprava bez komplexného UI
4. **Mobilná aplikácia** - málo kvalitných mobile-first riešení
5. **Cenová dostupnosť** - priestor pre freemium/nízkonákladové riešenie

---

## User intent mapping

### Informational (blog content)
- "ako vylepšiť písanie"
- "tipy na profesionálne emaily"
- "rozdiel medzi formálnym a neformálnym štýlom"

### Transactional (landing pages)
- "text rewriter online free"
- "paraphrase tool"
- "ai writing assistant"

### Navigational (brand)
- "stylo app"
- "stylo text editor"

---

## Content stratégia

### Blog témy (SEO)
- [ ] "10 spôsobov ako vylepšiť svoje emaily"
- [ ] "Ako písať tak, aby to neznelo ako AI"
- [ ] "Formálny vs. neformálny štýl - kedy použiť ktorý"
- [ ] "Najčastejšie chyby v písaní a ako ich opraviť"
- [ ] "AI nástroje na písanie - porovnanie 2024"

### Landing pages
- [ ] /rewrite-text - "Prepíš text online zadarmo"
- [ ] /email-improver - "Vylepši svoje emaily"
- [ ] /tone-changer - "Zmeň tón textu"
- [ ] /sk - Slovenská landing page
- [ ] /cz - Česká landing page

---

## Nástroje na analýzu

| Nástroj | Účel | Poznámka |
|---------|------|----------|
| Google Keyword Planner | Search volume, CPC | Zadarmo s Google Ads účtom |
| Ubersuggest | Keyword ideas, konkurencia | Freemium |
| Ahrefs | Backlinks, keyword difficulty | Platený |
| SEMrush | Kompletná analýza | Platený |
| AnswerThePublic | Otázky ľudí | Freemium |
| Google Trends | Trendy | Zadarmo |

---

## Metriky na sledovanie

- [ ] Organic search traffic
- [ ] Keyword rankings (top 10, top 3)
- [ ] Click-through rate (CTR)
- [ ] Bounce rate na landing pages
- [ ] Conversion rate (visitor → signup)
- [ ] Cost per acquisition (ak PPC)
