# Blog Guide - Návod na vytváranie blog postov

## Rýchly prehľad

Blog posty sa vytvárajú ako **MDX súbory** (Markdown + JSX) v priečinku `content/blog/{locale}/`.

---

## 1. Štruktúra priečinkov

```
content/
└── blog/
    ├── en/                              # Anglické články
    │   ├── ai-tools-for-writing.mdx
    │   ├── how-to-improve-grammar.mdx
    │   └── formal-vs-informal-writing.mdx
    ├── sk/                              # Slovenské články
    │   └── ... (rovnaké názvy súborov)
    ├── cs/                              # České články
    ├── de/                              # Nemecké články
    └── es/                              # Španielske články
```

---

## 2. Vytvorenie nového blog postu

### Krok 1: Vytvor MDX súbor

Názov súboru = slug URL (použij kebab-case):
- ✅ `how-to-write-better-emails.mdx` → `/blog/how-to-write-better-emails`
- ❌ `How To Write Better Emails.mdx`

### Krok 2: Pridaj frontmatter (metadata)

Každý MDX súbor MUSÍ začínať frontmatter blokom:

```mdx
---
title: "How to Write Better Emails"
slug: "how-to-write-better-emails"
description: "Learn practical tips for writing professional and effective emails that get results."
category: "productivity"
tags: ["email", "writing tips", "professional communication"]
author: "Stylo Team"
publishedAt: "2024-02-05"
updatedAt: "2024-02-05"
locale: "en"
featured: false
coverImage: "/blog/covers/email-writing.webp"
---

Tvoj obsah článku začína tu...
```

### Krok 3: Napíš obsah

Po frontmatter bloku píš normálny Markdown:

```mdx
---
... frontmatter ...
---

Writing effective emails is a crucial skill in today's digital world.

## Why Email Writing Matters

Good email communication can...

### Tip 1: Keep It Short

Nobody wants to read a novel in their inbox.

### Tip 2: Use Clear Subject Lines

The subject line is your first impression.

## Conclusion

Start implementing these tips today and watch your email game improve!

Ready to polish your emails? [Try Stylo](/dashboard) for free!
```

---

## 3. Frontmatter - Povinné polia

| Pole | Typ | Popis | Príklad |
|------|-----|-------|---------|
| `title` | string | Nadpis (max 120 znakov) | `"How to Write Better"` |
| `slug` | string | URL slug (kebab-case) | `"how-to-write-better"` |
| `description` | string | Popis (max 160 znakov, SEO) | `"Learn tips for..."` |
| `category` | string | Kategória | `"productivity"` |
| `tags` | string[] | Tagy (max 10) | `["email", "tips"]` |
| `author` | string | Autor | `"Stylo Team"` |
| `publishedAt` | string | Dátum publikovania (ISO) | `"2024-02-05"` |
| `updatedAt` | string | Dátum aktualizácie (ISO) | `"2024-02-05"` |
| `locale` | string | Jazyk | `"en"` |
| `featured` | boolean | Zvýraznený článok | `true` alebo `false` |
| `coverImage` | string | Cesta k obrázku | `"/blog/covers/xyz.webp"` |

---

## 4. Kategórie

Dostupné kategórie (musia byť presne tieto):

| Kategória | Popis |
|-----------|-------|
| `ai-writing` | Články o AI písaní |
| `grammar-tips` | Gramatické tipy |
| `productivity` | Produktivita a efektivita |
| `tutorials` | Návody a tutoriály |
| `product-updates` | Novinky o produkte |

---

## 5. Cover obrázky

### Požiadavky:
- **Formát**: WebP (odporúčané), JPG, PNG
- **Veľkosť**: 1200x630px (OG image formát)
- **Umiestnenie**: `public/blog/covers/`
- **Názov**: rovnaký ako slug, napr. `email-writing.webp`

### Ako pridať obrázok:
1. Vytvor/nájdi obrázok 1200x630px
2. Optimalizuj na WebP (https://squoosh.app)
3. Ulož do `public/blog/covers/`
4. Použi v frontmatter: `coverImage: "/blog/covers/email-writing.webp"`

---

## 6. Markdown formátovanie

### Nadpisy
```mdx
# H1 - Nepoužívaj (title je automaticky H1)
## H2 - Hlavné sekcie
### H3 - Podsekcie
#### H4 - Detaily
```

### Text
```mdx
Normálny text.

**Tučný text**

*Kurzíva*

~~Prečiarknutý~~
```

### Zoznamy
```mdx
- Nečíslovaný bod
- Ďalší bod

1. Číslovaný bod
2. Ďalší bod
```

### Citáty
```mdx
> Toto je citát alebo dôležitá poznámka.
```

### Kód
```mdx
Inline `kód` v texte.

```javascript
// Blok kódu
const greeting = "Hello World";
```
```

### Linky
```mdx
[Externý link](https://example.com)

[Interný link](/dashboard)

[Link na blog post](/blog/how-to-improve-grammar)
```

### Obrázky v článku
```mdx
![Alt text](/blog/images/screenshot.webp)
```

---

## 7. Špeciálne komponenty

### CTA Box (Call to Action)

V článku môžeš použiť BlogCTA komponent (automaticky pridaný na konci každého článku).

Pre extra CTA v texte:
```mdx
Ready to improve your writing? [Try Stylo Free](/dashboard) and see the difference!
```

---

## 8. Lokalizácia (preklady)

### Pre každý článok vytvor verziu v každom jazyku:

```
content/blog/
├── en/how-to-write-better-emails.mdx  ← Originál
├── sk/how-to-write-better-emails.mdx  ← Slovenský preklad
├── cs/how-to-write-better-emails.mdx  ← Český preklad
├── de/how-to-write-better-emails.mdx  ← Nemecký preklad
└── es/how-to-write-better-emails.mdx  ← Španielsky preklad
```

### Čo preložiť:
- ✅ `title` - preložiť
- ✅ `description` - preložiť
- ❌ `slug` - NECHAŤ ROVNAKÝ (pre správne alternate links)
- ✅ `tags` - preložiť
- ✅ `locale` - zmeniť na správny jazyk
- ✅ Obsah článku - preložiť

### Príklad SK verzie:

```mdx
---
title: "Ako písať lepšie emaily"
slug: "how-to-write-better-emails"  ← ROVNAKÝ SLUG!
description: "Naučte sa praktické tipy na písanie profesionálnych a efektívnych emailov."
category: "productivity"
tags: ["email", "tipy na písanie", "profesionálna komunikácia"]
author: "Stylo Team"
publishedAt: "2024-02-05"
updatedAt: "2024-02-05"
locale: "sk"  ← ZMENIŤ!
featured: false
coverImage: "/blog/covers/email-writing.webp"  ← ROVNAKÝ OBRÁZOK
---

Písanie efektívnych emailov je kľúčová zručnosť v dnešnom digitálnom svete.

## Prečo záleží na písaní emailov

Dobrá emailová komunikácia môže...
```

---

## 9. Checklist pred publikovaním

### Obsah
- [ ] Článok má aspoň 500 slov
- [ ] Má jasný úvod, obsah a záver
- [ ] Obsahuje aspoň 2-3 sekcie (H2)
- [ ] Má CTA na konci (link na /dashboard)
- [ ] Gramaticky správny

### Frontmatter
- [ ] `title` - max 120 znakov
- [ ] `description` - max 160 znakov (SEO!)
- [ ] `slug` - kebab-case, bez diakritiky
- [ ] `category` - jedna z povolených
- [ ] `tags` - 3-5 relevantných tagov
- [ ] `coverImage` - existuje v public/blog/covers/

### Obrázky
- [ ] Cover image je 1200x630px
- [ ] Cover image je optimalizovaný (< 100KB)
- [ ] Alt texty pre všetky obrázky v článku

### Preklady
- [ ] Článok existuje vo všetkých 5 jazykoch
- [ ] Slug je ROVNAKÝ vo všetkých verziách
- [ ] Locale je správne nastavené

---

## 10. Kompletný príklad

### `content/blog/en/how-to-write-better-emails.mdx`

```mdx
---
title: "How to Write Better Emails: 7 Proven Tips"
slug: "how-to-write-better-emails"
description: "Master the art of email writing with these 7 practical tips that will make your messages clearer, more professional, and more effective."
category: "productivity"
tags: ["email", "writing tips", "professional communication", "business writing"]
author: "Stylo Team"
publishedAt: "2024-02-05"
updatedAt: "2024-02-05"
locale: "en"
featured: true
coverImage: "/blog/covers/email-writing.webp"
---

In today's fast-paced digital world, email remains one of the most important forms of professional communication. Yet many people struggle to write emails that are clear, concise, and effective.

## Why Email Writing Skills Matter

Whether you're reaching out to a potential client, communicating with your team, or following up after a meeting, how you write your emails can significantly impact your professional relationships.

### The Cost of Poor Email Communication

Studies show that professionals spend an average of 28% of their workday reading and responding to emails. Poorly written emails lead to:

- Misunderstandings and confusion
- Multiple back-and-forth messages
- Wasted time for both sender and recipient
- Damaged professional relationships

## 7 Tips for Better Emails

### 1. Start with a Clear Subject Line

Your subject line is the first thing recipients see. Make it specific and action-oriented:

- ❌ "Meeting"
- ✅ "Request: 30-min call to discuss Q2 marketing budget"

### 2. Keep It Short and Focused

The ideal email is under 200 words. Get to the point quickly:

> If your email requires scrolling, consider whether it should be a meeting instead.

### 3. Use the Pyramid Structure

Start with your main point or request, then provide supporting details:

1. **Lead with your ask** - What do you need?
2. **Provide context** - Why do you need it?
3. **Include details** - Any relevant background

### 4. Make Action Items Crystal Clear

If you need the recipient to do something, make it obvious:

- Use bullet points for multiple actions
- Include deadlines
- Specify who is responsible for what

### 5. Proofread Before Sending

Grammar mistakes and typos undermine your credibility. Always:

- Read your email aloud
- Use grammar checking tools
- Double-check names and attachments

### 6. Choose the Right Tone

Match your tone to your audience and purpose:

- **Formal**: External clients, executives, first contact
- **Professional**: Colleagues, regular business communication
- **Casual**: Close team members, informal updates

### 7. End with a Clear Next Step

Don't leave your recipient wondering what happens next:

- ❌ "Let me know what you think."
- ✅ "Please reply by Friday if you can attend the meeting."

## Putting It All Together

Great email writing is a skill that improves with practice. Start by implementing one or two of these tips in your next email, then gradually incorporate more.

## Level Up Your Writing with AI

Want to take your email writing to the next level? [Try Stylo](/dashboard) - our AI-powered writing assistant can help you:

- Fix grammar and spelling errors instantly
- Transform casual drafts into professional messages
- Adjust tone from formal to friendly and back

[Start writing better emails today →](/dashboard)
```

---

## 11. Užitočné nástroje

### Generovanie obrázkov
- [Unsplash](https://unsplash.com) - Bezplatné stock fotky
- [DALL-E](https://openai.com/dall-e-3) - AI generované obrázky
- [Canva](https://canva.com) - Dizajn cover obrázkov

### Optimalizácia obrázkov
- [Squoosh](https://squoosh.app) - Kompresia a konverzia na WebP
- [TinyPNG](https://tinypng.com) - Kompresia PNG/JPG

### Písanie
- [Hemingway Editor](https://hemingwayapp.com) - Čitateľnosť textu
- [Grammarly](https://grammarly.com) - Gramatika
- **Stylo** - AI transformácie textu 😉

### SEO
- [Google Search Console](https://search.google.com/search-console) - Sledovanie výkonu
- [Ahrefs Free Tools](https://ahrefs.com/free-seo-tools) - Keyword research

---

## 12. FAQ

### Ako pridám nový článok?

1. Vytvor MDX súbor v `content/blog/en/`
2. Pridaj frontmatter s metadata
3. Napíš obsah
4. Pridaj cover image do `public/blog/covers/`
5. Vytvor preklady pre ostatné jazyky
6. Commit a push

### Ako upravím existujúci článok?

1. Nájdi súbor v `content/blog/{locale}/`
2. Uprav obsah
3. Aktualizuj `updatedAt` dátum
4. Nezabudni aktualizovať aj preklady

### Ako odstránim článok?

1. Vymaž MDX súbor zo VŠETKÝCH jazykových priečinkov
2. Vymaž cover image (ak nie je použitý inde)

### Prečo sa článok nezobrazuje?

Skontroluj:
- [ ] Frontmatter je správne naformátovaný (YAML)
- [ ] `slug` neobsahuje špeciálne znaky
- [ ] `locale` je správne
- [ ] `coverImage` cesta existuje
- [ ] Dev server bol reštartovaný

---

## Zhrnutie

1. **Vytvor súbor**: `content/blog/{locale}/{slug}.mdx`
2. **Pridaj frontmatter**: title, slug, description, category, tags, author, dátumy, locale, coverImage
3. **Napíš obsah**: Markdown s H2/H3 sekciami
4. **Pridaj obrázok**: `public/blog/covers/{slug}.webp`
5. **Preloš**: Vytvor verzie pre všetkých 5 jazykov
6. **Publikuj**: git commit & push

Happy blogging! 🚀
