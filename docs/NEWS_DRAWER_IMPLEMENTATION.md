# News Drawer Implementation

## Overview

The News Drawer is a sidebar component that displays news and changelog items to users in the dashboard. It follows the same pattern as the History Drawer and implements Web Interface Guidelines best practices.

## Components

### NewsDrawer Component

**Location:** [components/NewsDrawer.tsx](../components/NewsDrawer.tsx)

**Features:**
- Right-side slide-out drawer using Sheet component
- Displays news items with type badges, icons, and dates
- Available to both authenticated and anonymous users
- Responsive design (mobile and desktop)
- Proper accessibility (ARIA labels, keyboard navigation, focus states)
- Internationalized using next-intl

**Props:**
```typescript
interface NewsDrawerProps {
  onNewsClick?: (item: NewsItem) => void  // Optional callback when news clicked
}
```

## Visual Design

### Type Badges & Icons

Each news type has a distinct visual appearance:

| Type | Icon | Color |
|------|------|-------|
| Feature | ✨ Sparkles | Indigo |
| Fix | 🐛 Bug | Red |
| Improvement | ⚡ Zap | Amber |
| Announcement | 🔔 Bell | Blue |

### Layout Structure

```
┌─────────────────────────────────┐
│ 📣 News & Updates               │ ← Header
│ 5 updates                       │ ← Description
├─────────────────────────────────┤
│                                 │
│ [✨ Feature]      Today         │ ← Badge + Date
│ New Humanize Toggle             │ ← Title
│ Added ability to toggle...      │ ← Description
│ [v1.2.0]                        │ ← Version (optional)
│                                 │
├─────────────────────────────────┤
│ [🐛 Fix]          Yesterday     │
│ Fixed rate limit bug            │
│ Resolved issue with...          │
│                                 │
├─────────────────────────────────┤
│ [⚡ Improvement]  2 days ago    │
│ Performance improvements        │
│ Optimized database queries...   │
│                                 │
└─────────────────────────────────┘
│ [View All Updates]              │ ← Footer button
└─────────────────────────────────┘
```

## Integration

### Dashboard Integration

**Location:** [app/[locale]/dashboard/page.tsx](../app/[locale]/dashboard/page.tsx)

The NewsDrawer is placed in the dashboard header, before the History drawer:

```tsx
<div className="flex items-center gap-2">
  {/* News drawer - available for everyone */}
  <NewsDrawer />

  {/* History drawer - authenticated users only */}
  {!isAnonymous && (
    <HistoryDrawer onLoadTransformation={handleLoadTransformation} />
  )}

  {/* ... rest of header ... */}
</div>
```

**Position:** Top-right header area, between Blog/News links and user actions

## API Endpoint

**Location:** [app/api/news/route.ts](../app/api/news/route.ts)

**Endpoint:** `GET /api/news`

**Query Parameters:**
- `locale` - Language code (en, sk, cs, de, es) - default: 'en'
- `limit` - Maximum number of items - default: 50
- `type` - Filter by type (feature, fix, improvement, announcement) - optional

**Example Request:**
```bash
GET /api/news?locale=en&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "2024-02-04-seo-improvements",
      "type": "improvement",
      "title": "SEO & Analytics Improvements",
      "description": "Enhanced SEO with breadcrumbs, structured data...",
      "date": "2024-02-04",
      "version": "1.3.0",
      "link": "https://stylo.app/blog/seo-improvements"
    }
  ],
  "total": 1,
  "locale": "en"
}
```

## Translations

All translations are stored in language-specific JSON files.

**Location:** `messages/{locale}.json`

**Translation Key:** `newsDrawer`

**Structure:**
```json
{
  "newsDrawer": {
    "title": "News & Updates",
    "description": "Latest features and improvements",
    "noNews": "No news available",
    "failedToLoad": "Failed to load news",
    "viewAll": "View All Updates",
    "tryAgain": "Try Again",
    "types": {
      "feature": "Feature",
      "fix": "Fix",
      "improvement": "Improvement",
      "announcement": "Announcement"
    }
  }
}
```

**Supported Languages:**
- ✅ English (en)
- ✅ Slovak (sk)
- ✅ Czech (cs)
- ✅ German (de)
- ✅ Spanish (es)

## Accessibility Features

### Semantic HTML
- Uses `<button>` for interactive elements
- Uses `<article>` for news items
- Uses `<time>` with `dateTime` attribute for dates
- Proper heading hierarchy

### ARIA Labels
```tsx
<Button aria-label="View news and updates">
<Loader2 aria-label="Loading news" />
<div role="alert" aria-live="polite">Error message</div>
```

### Keyboard Navigation
- All items are keyboard accessible (Tab, Enter, Space)
- Proper focus states using `focus-visible:ring-*`
- onKeyDown handlers for button-like elements

### Visual Indicators
- Icons marked with `aria-hidden="true"` (decorative)
- Color-blind friendly (uses icons + text, not just color)
- Sufficient color contrast ratios

## Internationalization

### Date Formatting
Uses `Intl.DateTimeFormat` for proper date localization:

```typescript
new Intl.DateTimeFormat(locale, {
  month: 'short',
  day: 'numeric',
  year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
}).format(date)
```

**Examples:**
- Today → "Today"
- Yesterday → "Yesterday"
- 5 days ago → "5 days ago"
- Older → "Feb 4" or "Feb 4, 2024"

### Relative Time
- Today
- Yesterday
- 2-6 days ago → "N days ago"
- 7+ days ago → Formatted date

## User Experience

### For Anonymous Users
- ✅ Can view all news items
- ✅ Can click to view full news page
- ✅ No authentication required

### For Authenticated Users
- ✅ Can view all news items
- ✅ Can click to view full news page
- ✅ News drawer appears next to History drawer

### Click Behavior
1. If news item has a `link` → Opens in new tab
2. Otherwise → Just closes the drawer
3. "View All Updates" button → Navigates to `/news` page

## Data Flow

```
User clicks News button
       ↓
NewsDrawer opens
       ↓
Fetches from /api/news?locale={locale}
       ↓
API reads from content/news/{locale}/*.json
       ↓
Returns sorted news items (newest first)
       ↓
Displays in drawer with proper formatting
```

## File Structure

```
components/
  └── NewsDrawer.tsx              ← Main component

app/
  ├── [locale]/
  │   └── dashboard/
  │       └── page.tsx            ← Integration point
  └── api/
      └── news/
          └── route.ts            ← API endpoint

lib/
  └── news/
      ├── loader.ts               ← Data loading functions
      ├── types.ts                ← TypeScript types
      └── utils.ts                ← Utility functions

content/
  └── news/
      ├── en/*.json               ← English news items
      ├── sk/*.json               ← Slovak news items
      ├── cs/*.json               ← Czech news items
      ├── de/*.json               ← German news items
      └── es/*.json               ← Spanish news items

messages/
  ├── en.json                     ← English translations
  ├── sk.json                     ← Slovak translations
  ├── cs.json                     ← Czech translations
  ├── de.json                     ← German translations
  └── es.json                     ← Spanish translations
```

## Web Interface Guidelines Compliance

### ✅ Semantic HTML
- Proper use of `<button>`, `<article>`, `<time>`
- No `<div onClick>` antipatterns

### ✅ Accessibility
- `aria-label` on icon-only buttons
- `aria-hidden="true"` on decorative icons
- `aria-live="polite"` on error messages
- `role="alert"` on error states

### ✅ Keyboard Support
- All elements keyboard accessible
- `onKeyDown` handlers for custom buttons
- Visible focus states with `:focus-visible`

### ✅ Internationalization
- Uses `Intl.DateTimeFormat` for dates
- Proper curly quotes and ellipsis (…)
- No hardcoded date/time formats

### ✅ Performance
- Lazy loads data only when drawer opens
- Efficient re-renders
- Proper loading states

### ✅ Content
- Uses ellipsis character (…) not three dots (...)
- Proper text truncation with `line-clamp-2`
- Clear, concise labels

## Testing Checklist

- [ ] Drawer opens and closes smoothly
- [ ] News items load correctly
- [ ] Date formatting works in all locales
- [ ] Type badges display correct colors and icons
- [ ] Loading state shows spinner
- [ ] Error state shows retry button
- [ ] Empty state shows appropriate message
- [ ] "View All Updates" navigates to /news page
- [ ] Links open in new tabs with noopener
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states are visible
- [ ] Screen reader announces content properly
- [ ] Works in both light and dark mode
- [ ] Responsive on mobile and desktop
- [ ] Works for anonymous and authenticated users

## Future Enhancements

1. **Read/Unread Status** - Mark news items as read
2. **Push Notifications** - Notify users of new updates
3. **In-App Badges** - Show unread count on News button
4. **Filtering** - Filter by news type
5. **Search** - Search through news items
6. **Reactions** - Allow users to react to news
7. **Preferences** - Allow users to customize news feed

## Related Documentation

- [Navigation & Linking Guide](./NAVIGATION_AND_LINKING.md)
- [SEO Optimization](./SEO_OPTIMIZATION.md)
- [News Content System](./NEWS_CONTENT.md)
