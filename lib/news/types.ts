// Typ news položky
export type NewsType = 'feature' | 'fix' | 'improvement' | 'announcement';

// Podporované jazyky
export type Locale = 'en' | 'sk' | 'cs' | 'de' | 'es';

// Metadata pre jednu news položku
export interface NewsItem {
  id: string;                    // Unique ID (napr. "2024-02-03-humanize-toggle")
  type: NewsType;                // Typ: feature, fix, improvement, announcement
  title: string;                 // Nadpis
  description: string;           // Krátky popis (1-3 vety)
  date: string;                  // ISO dátum (2024-02-03)
  version?: string;              // Voliteľná verzia (napr. "1.2.0")
  link?: string;                 // Voliteľný link na viac info
}

// News zoskupené podľa mesiaca (pre timeline)
export interface NewsGroup {
  month: string;                 // "Február 2024"
  items: NewsItem[];
}

// API response
export interface NewsApiResponse {
  success: boolean;
  data: NewsItem[];
  total: number;
  locale: Locale;
}
