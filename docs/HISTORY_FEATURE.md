# Transformation History Feature

User transformation history in a slide-in drawer (Android-like).

## Features

- Slide-in drawer from right side (Sheet component)
- View last 50 transformations
- Click any item to reload it in dashboard
- Minimalist, database-inspired design
- Relative timestamps (e.g., "2h ago", "3d ago")
- Mobile-first responsive layout

## User Flow

1. User clicks **"History"** button in dashboard header
2. Drawer slides in from right side
3. Sees list of past transformations sorted by most recent
4. Each item shows:
   - Transformation type with icon
   - Relative timestamp
   - Preview of input text (truncated to 100 chars)
   - Preview of output text (truncated to 100 chars)
5. Click any item to load it back into dashboard
6. Drawer closes automatically
7. Dashboard auto-fills input, output, and transformation type

## Technical Implementation

### API Endpoint

**`GET /api/history`**

Location: [app/api/history/route.ts](../app/api/history/route.ts)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "originalText": "input text",
      "transformedText": "output text",
      "transformationType": "grammar",
      "createdAt": "2025-01-06T12:00:00Z"
    }
  ]
}
```

**Security:**
- Requires authenticated user
- Only returns user's own transformations
- Limited to 50 most recent items

### UI Component

**`HistoryDrawer`**

Location: [components/HistoryDrawer.tsx](../components/HistoryDrawer.tsx)

**Features:**
- Sheet component (shadcn/ui) for slide-in drawer
- Fetches data from API when opened
- Relative time formatting
- Empty state with icon
- Loading and error states
- Scroll-able list of transformations

### Dashboard Integration

Location: [app/dashboard/page.tsx](../app/dashboard/page.tsx)

**Changes:**
1. Added `HistoryDrawer` component with callback prop
2. Added `handleLoadTransformation` function to update state
3. Removed navigation to `/history` page

**Data Flow:**
```
HistoryDrawer → onLoadTransformation callback → Dashboard state update
```

When user clicks history item:
1. Drawer calls `onLoadTransformation(input, output, type)`
2. Dashboard updates state directly
3. Drawer closes automatically
4. Input, output, and transformation type are filled

## Design Aesthetic

**Concept:** Ultra-minimal database interface

**Typography:**
- Monospace font for text previews (creates archive/log aesthetic)
- Labels in uppercase (IN/OUT) for clarity
- Tight line-height for density

**Layout:**
- Single-column list with tight spacing
- Each item is clickable card with hover state
- Border between items (space-y-px for 1px gaps)
- Brutally efficient - no wasted pixels

**Colors:**
- Indigo #6366f1 for transformation type labels
- Slate grays for text hierarchy
- Subtle hover states
- Consistent with dashboard design

**Interactions:**
- Instant navigation (no confirmations)
- Hover state on entire card
- Click anywhere on card to load

## Database

Uses existing `transformations` table:

```prisma
model Transformation {
  id                String    @id @default(uuid())
  userId            String?   @map("user_id")
  originalText      String    @map("original_text") @db.Text
  transformedText   String?   @map("transformed_text") @db.Text
  transformationType String   @map("transformation_type")
  createdAt         DateTime  @default(now()) @map("created_at")

  @@index([userId, createdAt(sort: Desc)])
}
```

The index on `[userId, createdAt]` ensures fast queries for user history.

## Future Enhancements

Potential improvements:

- Search/filter by transformation type
- Date range filters
- Pagination for >50 items
- Delete individual history items
- Export history to CSV/JSON
- Copy input/output text directly from history
- Show token usage and cost per transformation
- Star/favorite transformations
