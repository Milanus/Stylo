// Humanization rules to make LLM output sound natural and pass AI detectors

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
