# PostHog Event Tracking Implementation

## Goal
Add comprehensive PostHog analytics tracking for all key user interactions in Vertex Compliance: search, video playback, lesson engagement, progress tracking, and server-side events. Follow PostHog Next.js best practices (snake_case events, no PII in capture properties, server-side via posthog-node, client-side via posthog-js).

## Current State
- PostHog client-side SDK (`posthog-js`) initialized in `instrumentation-client.ts`
- `lib/posthog-client.ts` wraps `capturePostHogEvent()`, `identifyPostHogUser()`, `resetPostHog()`
- 13 events already tracked (search_submitted, search_completed, lesson_viewed, lesson_completed, etc.)
- **No `posthog-node` installed** — server routes have zero tracking
- **Video player has `onFirstPlay` and `onTimeUpdate` callbacks but nothing wired to PostHog**
- **Search result cards have no click tracking**
- **No server-side events** on /api/search or /api/progress

## Events to Add

### Client-Side Events

| Event Name | Properties | File | Trigger |
|---|---|---|---|
| `video_played` | `lesson_id`, `video_url`, `position_seconds`, `duration` | `components/lesson/video-player.tsx` | First play via `onFirstPlay` callback |
| `video_watch_depth` | `lesson_id`, `current_seconds`, `duration`, `percent_watched` | `components/lesson/video-player.tsx` | Every 30s via `onTimeUpdate` (throttled) |
| `search_result_clicked` | `result_type` ("video"\|"lesson"), `lesson_slug`, `matched_second`, `position` | `components/search/video-result-card.tsx`, `components/search/lesson-result-card.tsx` | Click on result card Link |
| `search_suggestion_clicked` | `suggestion_text` | `components/search/search-suggestions.tsx` | Click on suggestion button |
| `search_sort_changed` | `sort_option` | `components/search/search-results.tsx` | Sort dropdown change |
| `search_filter_changed` | `filter_tab` | `components/search/search-results.tsx` | Filter tab click |
| `lesson_tab_changed` | `tab_name` | `components/lesson/lesson-tabs.tsx` | Tab trigger click |
| `resource_link_clicked` | `resource_title`, `resource_type` | `components/lesson/lesson-tabs.tsx` | Click on resource external link |
| `training_program_viewed` | `program_id`, `program_slug`, `category` | `app/catalog/[slug]/page.tsx` (via client wrapper) | Page load |
| `catalog_viewed` | `program_count` | `app/catalog/page.tsx` (via client wrapper) | Page load |
| `resume_used` | `lesson_id`, `resume_seconds` | `app/lessons/[slug]/lesson-page-client.tsx` | When resumeSeconds > 0 on lesson view |

### Server-Side Events (posthog-node)

| Event Name | Properties | File | Trigger |
|---|---|---|---|
| `search_api_performed` | `query`, `result_count`, `has_llm_results`, `latency_ms` | `app/api/search/route.ts` | After search completes |
| `progress_saved` | `lesson_id`, `completed`, `position_seconds` | `app/api/progress/route.ts` | After progress saved |

## Implementation Steps

### Step 1: Install posthog-node
```bash
npm install posthog-node
```

### Step 2: Create server-side PostHog helper
Create `lib/posthog-server.ts`:
- Import `PostHog` from `posthog-node`
- Singleton client with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`
- `flushAt: 1`, `flushInterval: 0` for short-lived handlers
- Export `captureServerEvent()` that captures and flushes
- Guard behind env vars, no-op in production if not configured

### Step 3: Wire video player tracking
File: `components/lesson/video-player.tsx`
- Accept new props: `lessonId`, `duration`
- In the existing `onFirstPlay` callback path (line 66-68): add `capturePostHogEvent("video_played", { lesson_id, video_url, position_seconds, duration })`
- Add throttled `video_watch_depth` capture in the `handleTimeUpdate` callback (every 30s, tracked via ref)
- Wire these from `app/lessons/[slug]/page.tsx` which already renders `<VideoPlayer>`

### Step 4: Wire search result click tracking
Files: `components/search/video-result-card.tsx`, `components/search/lesson-result-card.tsx`
- Both are `"use client"` components with `<Link>` wrapping buttons
- Add `onClick` handlers to the `<Link>` elements that call `capturePostHogEvent("search_result_clicked", { result_type, lesson_slug, matched_second, position })`
- Position = index in the results list (pass as prop from search-results.tsx)

### Step 5: Wire search interaction tracking
Files: `components/search/search-suggestions.tsx`, `components/search/search-results.tsx`
- `search-suggestions.tsx`: Add `capturePostHogEvent("search_suggestion_clicked", { suggestion_text })` in onClick
- `search-results.tsx`: Add `capturePostHogEvent("search_sort_changed", { sort_option })` in handleSortChange
- `search-results.tsx`: Add `capturePostHogEvent("search_filter_changed", { filter_tab })` in handleFilterChange

### Step 6: Wire lesson tab and resource tracking
File: `components/lesson/lesson-tabs.tsx`
- Use the Tabs `onValueChange` callback to capture `lesson_tab_changed` with `tab_name`
- Add `capturePostHogEvent("resource_link_clicked", { resource_title, resource_type })` on resource link clicks

### Step 7: Add server-side tracking
File: `app/api/search/route.ts`
- Import `captureServerEvent` from `lib/posthog-server`
- After search completes (line ~303): capture `search_api_performed` with query, result_count, has_llm_results, latency_ms (measure time from start of handler)
- Flush before returning

File: `app/api/progress/route.ts`
- Import `captureServerEvent` from `lib/posthog-server`
- After saveProgress succeeds (line ~36): capture `progress_saved` with lesson_id, completed, position_seconds using userId as distinctId
- Flush before returning

### Step 8: Add page view tracking for catalog and training program
Create lightweight client wrapper components:
- `components/analytics/page-tracker.tsx` — a `"use client"` component that captures a named page view event on mount
- Use in `app/catalog/page.tsx` and `app/catalog/[slug]/page.tsx` by rendering `<PageTracker event="catalog_viewed" properties={{ program_count }} />` etc.

### Step 9: Add resume tracking
File: `app/lessons/[slug]/lesson-page-client.tsx`
- In the existing `useEffect` that captures `lesson_viewed`, also check if resumeSeconds was provided and capture `resume_used` with lesson_id and resume_seconds

## Files to Modify
1. `lib/posthog-server.ts` (new)
2. `components/analytics/page-tracker.tsx` (new)
3. `components/lesson/video-player.tsx` (add props, wire tracking)
4. `components/search/video-result-card.tsx` (add click tracking)
5. `components/search/lesson-result-card.tsx` (add click tracking)
6. `components/search/search-suggestions.tsx` (add click tracking)
7. `components/search/search-sort-control.tsx` (no change needed — tracking in parent)
8. `components/search/search-filter-tabs.tsx` (no change needed — tracking in parent)
9. `app/search/search-results.tsx` (add sort/filter tracking, pass position to result cards)
10. `components/lesson/lesson-tabs.tsx` (add tab change + resource click tracking)
11. `app/api/search/route.ts` (add server-side event)
12. `app/api/progress/route.ts` (add server-side event)
13. `app/lessons/[slug]/page.tsx` (pass lessonId/duration to VideoPlayer)
14. `app/lessons/[slug]/lesson-page-client.tsx` (add resume_used tracking)
15. `app/catalog/page.tsx` (add PageTracker)
16. `app/catalog/[slug]/page.tsx` (add PageTracker)
17. `package.json` (add posthog-node)

## Security Considerations
- No PII in any `capturePostHogEvent()` or `captureServerEvent()` calls — only Clerk user ID via distinctId
- Server-side PostHog key stays on server (uses same NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN which is already public)
- All existing env var guards preserved
- `posthog-server.ts` follows same guard pattern as `posthog-client.ts`

## Acceptance Criteria
- `npm run build` passes with no type errors
- `npm run lint` passes
- All new events use snake_case naming
- Server events flush before response returns
- No PII in capture properties
- Video tracking fires on first play and every 30s during playback
- Search result clicks track result type, slug, and matched position
- Server events fire for search API and progress save

## Checks to Run
1. `npm run lint` from repo root
2. `npx tsc --noEmit` from repo root
3. `npm run build` from repo root
