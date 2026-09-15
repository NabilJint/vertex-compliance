# Search Page UI Update

## Goal
Redesign the search page UI to match the provided reference screenshot. The current implementation uses a grid layout for results; the reference shows a list layout with distinct video and lesson card designs, suggested search terms, filter tabs, and a "show more" affordance.

## Skills Used
- sanity-best-practices (for Sanity data fetching patterns)
- create-agent-with-sanity-context (for search API understanding)
- frontend-engineer (for UI implementation)

## Code Inspected
- `app/search/page.tsx` - Server wrapper, minimal changes needed
- `app/search/search-results.tsx` - Main client component, needs full rewrite
- `components/search/video-result-card.tsx` - Needs redesign to list layout
- `components/search/lesson-result-card.tsx` - Needs redesign to list layout
- `components/search/search-sort-control.tsx` - Needs update for new layout
- `components/search/search-empty-state.tsx` - Needs update to match reference
- `lib/search-types.ts` - May need minor additions
- `app/api/search/route.ts` - No changes needed
- `components/home/header.tsx` - No changes needed
- `components/home/footer.tsx` - No changes needed
- `components/ui/button.tsx` - Existing, use as-is
- `components/ui/badge.tsx` - Existing, use as-is
- `components/ui/card.tsx` - Existing, use as-is

## Decisions & Assumptions
1. The search API already returns structured results - no backend changes needed
2. The existing `SearchResult` types are sufficient
3. Suggested search terms are static strings (hardcoded in the component)
4. The "Programs" filter tab is UI-only for now (no program results in the API)
5. The "Show more results" button paginates client-side (shows 3 video + 3 lesson initially)
6. The empty state preview section appears when there are no search results
7. View toggle (list/grid) is UI-only - always list layout per reference
8. Use existing UI components (Button, Badge, Card) from `components/ui/`

## Files to Touch
1. `app/search/search-results.tsx` - Full rewrite for new layout
2. `components/search/video-result-card.tsx` - Redesign to horizontal list card
3. `components/search/lesson-result-card.tsx` - Redesign to horizontal list card
4. `components/search/search-sort-control.tsx` - Update for new header layout
5. `components/search/search-empty-state.tsx` - Update to match reference
6. `components/search/search-filter-tabs.tsx` - NEW: filter tab component
7. `components/search/search-suggestions.tsx` - NEW: suggested search terms

## Requirements

### Search Bar (top)
- Large rounded input with search icon on left
- Blue "Search" button on right side of input
- Suggested search terms as pill buttons below the input: "Incident reporting timeline", "Who to notify", "What counts as a breach"
- Suggested terms are clickable and populate the search input

### Results Header
- Title: "Results for '{query}'" in bold
- Subtitle: "Found {count} results across {programs} training programs"
- Sort control dropdown on right: "Sort: Most relevant"
- View toggle icons (list/grid) - list is active
- Filters button with badge showing active filter count

### Filter Tabs
- Horizontal pill tabs: "All results", "Video moments", "Lessons", "Programs"
- "All results" is default active (dark background)
- Inactive tabs have light background
- Clicking a tab filters the results to that type

### Video Moments Section
- Section header: "VIDEO MOMENTS" in uppercase, "Jump straight to the exact moment in a training video." subtitle
- Cards in LIST layout (full width, stacked vertically)
- Each card:
  - Left: Video thumbnail (aspect-video) with play button overlay and duration badge
  - Right content area:
    - Category badges (e.g., "Incident Reporting", "Security") with colored backgrounds
    - Title in bold
    - Module/lesson label (e.g., "Module 2 · Lesson 2.1")
    - Description text
    - Matched time and clip length info with icons
    - "Watch from {timestamp}" button (blue)
    - "Open lesson →" link below button

### Lessons Section
- Section header: "LESSONS" in uppercase, "Full lessons that match your question." subtitle
- Cards in LIST layout (full width, stacked vertically)
- Each card:
  - Left: Book icon in colored circle
  - Right content area:
    - Category badges (e.g., "Incident Reporting", "Required annually")
    - Title in bold
    - Module/lesson label
    - Description text
    - Key points with green checkmark icons
    - Duration, views, and updated date info
    - "Open lesson" button (dark)
    - "Preview →" link below button

### Show More Results
- "Show {n} more results" button centered
- Subtitle: "Results ranked by relevance to your question"

### Empty State
- Search icon in gray circle
- "No results for that question" heading
- "Try rephrasing, or browse the full catalog." description
- "Browse catalog" button (dark)

## Security Considerations
- No new API routes or server actions
- No new tokens or secrets exposed
- Client-side filtering only for tabs/pagination

## Acceptance Criteria
1. Search page matches the reference screenshot layout
2. Search bar with suggested terms works (clicking populates input)
3. Filter tabs switch between All/Video/Lessons/Programs
4. Video result cards show thumbnail on left, content on right
5. Lesson result cards show icon on left, content on right
6. "Show more results" button reveals additional results
7. Empty state shows when no results found
8. All existing search functionality (API calls, PostHog events) preserved
9. Responsive: works on mobile (cards stack vertically)
10. Uses existing UI components from `components/ui/`

## Checks to Run
1. `npm run typecheck` - from web workspace
2. `npm run lint` - from web workspace
3. `npm run build` - verify no build errors
4. Manual test: navigate to `/search`, enter a query, verify results display
5. Manual test: click filter tabs, verify filtering works
6. Manual test: click suggested terms, verify search triggers
7. Manual test: click "Show more results", verify additional results appear
8. Manual test: verify empty state shows for no-match queries

## Manual Test Steps
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/search`
3. Type "data breach" in search box and click Search
4. Verify results appear in list layout with video and lesson sections
5. Click "Video moments" tab - verify only video results show
6. Click "Lessons" tab - verify only lesson results show
7. Click "All results" tab - verify all results show
8. Click "Incident reporting timeline" suggested term - verify search triggers
9. Click "Show more results" button - verify additional results load
10. Search for "xyznonexistent" - verify empty state appears
11. Click "Browse catalog" in empty state - verify navigation to /catalog
