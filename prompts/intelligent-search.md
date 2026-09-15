# Implementation Prompt: Intelligent Search

## Goal

Build the intelligent search feature: a server-side search API that connects to the Sanity Context MCP, uses an LLM to query the content, and returns structured video and lesson results. Plus a full results page that renders ranked cards.

## What We're Building

1. **Search API route** (`/api/search`) — server-side, connects to Sanity Context MCP, sends user query to LLM, gets structured results back
2. **Search results page** (`/search`) — full-page results with video moment cards and lesson cards, result count, sort control
3. **Search form wiring** — hero search form and header search icon navigate to `/search`
4. **Search types** — shared types for video and lesson results
5. **Agent context** — system prompt + instructions for the search agent

## Architecture

```
Browser → /search?q=query → Server API route → Sanity Context MCP → LLM → Structured results → UI
```

- **Server-only**: MCP connection, LLM call, Sanity token — never exposed to client
- **Client-only**: Renders structured result cards from API response
- **No chat**: Full results page, not a chatbox

## Dependencies to Install

```bash
npm install ai @ai-sdk/openai @ai-sdk/mcp react-markdown zod
```

Check versions with `npm info <package> version` before installing.

## Environment Variables

Add to `.env.local`:

```bash
SANITY_CONTEXT_MCP_URL=https://api.sanity.io/v2026-03-03/context/mcp/:projectId/:dataset
OPENAI_API_KEY=your-nvidia-api-key
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
```

Update `.env.example` with these (without values).

**Security note:** The NVIDIA API key must stay server-only. Never expose it to the browser.

## Files to Create/Modify

### New Files
1. `app/api/search/route.ts` — Search API endpoint
2. `app/search/page.tsx` — Search results page (server component wrapper)
3. `app/search/search-results.tsx` — Client component with search UI
4. `components/search/video-result-card.tsx` — Video moment result card
5. `components/search/lesson-result-card.tsx` — Lesson result card
6. `components/search/search-empty-state.tsx` — Empty state when no results
7. `components/search/search-sort-control.tsx` — Sort dropdown
8. `lib/search-types.ts` — Shared search result types
9. `lib/search-prompts.ts` — System prompt and instructions for the search agent

### Modified Files
1. `package.json` — Add dependencies
2. `.env.local` — Add MCP URL, OpenAI API key, and base URL
3. `.env.example` — Add new env vars
4. `proxy.ts` — Add `/search` to public routes
5. `components/home/hero.tsx` — Wire search form to navigate to `/search`
6. `components/home/header.tsx` — Wire search icon to `/search`

## Search Result Types

```typescript
// lib/search-types.ts

interface VideoResult {
  type: "video"
  trainingProgram: { name: string; slug: string }
  moduleLabel: string      // e.g. "Module 5"
  lessonLabel: string      // e.g. "Lesson 5.1"
  lessonSlug: string
  thumbnail?: string       // image URL
  clipLength: string       // e.g. "2:30"
  description: string      // short description of the matched moment
  matchedSecond: number    // timestamp to start playback
}

interface LessonResult {
  type: "lesson"
  trainingProgram: { name: string; slug: string }
  moduleLabel: string
  lessonLabel: string
  lessonSlug: string
  keyPoints: string[]
  description: string      // short description
}

type SearchResult = VideoResult | LessonResult

interface SearchResponse {
  query: string
  totalCount: number
  results: SearchResult[]
}
```

## Search API Route Design

`POST /api/search` with body `{ query: string }`

1. Validate query (non-empty string, max 500 chars)
2. Create MCP client → HTTP transport to `SANITY_CONTEXT_MCP_URL` with Bearer token
3. Fetch initial context from MCP (cache it, 5min TTL)
4. Get MCP tools, exclude `initial_context` (already in system prompt)
5. Call `generateObject` from AI SDK with:
   - Model: `openai("openai/gpt-oss-20b")` via NVIDIA endpoint (baseURL from env)
   - System prompt: search agent instructions
   - Tools: MCP tools (groq_query, schema_explorer)
   - Schema: Zod schema matching `SearchResponse`
   - Prompt: the user's search query with instructions on what to return
6. Return the structured result as JSON

### System Prompt for Search Agent

The system prompt instructs the LLM to:
- Search for both video moments and lessons matching the query
- For video moments: match chapters first, then transcript chunks
- For lessons: match on title and notes (plain text projection)
- Return ALL relevant results, ranked best first
- Never invent training programs, lessons, or timestamps
- Ground every result in real data from the MCP tools
- Use wildcard text matching for keywords
- Rank by specificity (exact title match > broad keyword)

## Search Results Page Design

### Layout
- Full-width page with max-w-7xl container
- Search bar at top (pre-filled with query, editable)
- Result count: "Found 28 results across 8 training programs"
- Sort control: "Most Relevant" / "Newest" / "A-Z"
- Results grid: video results and lesson results as cards

### Video Result Card
- Thumbnail image (from lesson's posterImage)
- "NOW PLAYING" badge or timestamp badge
- Training program name + icon
- Module and lesson label (e.g. "Lesson 5.1 in Data Handling")
- Short description
- Clip length
- "Watch from [timestamp]" button → navigates to `/lessons/[slug]?t=[seconds]`

### Lesson Result Card
- Training program name
- Module and lesson label
- Key points list (3-4 items)
- Short description
- "Open Lesson" button → navigates to `/lessons/[slug]`

### Empty State
- Illustration or icon
- "No results found for [query]"
- "Try different keywords or browse the full catalog"
- Link to `/catalog`

## Search Form Wiring

### Hero Component
- On form submit: `router.push(/search?q=${encodeURIComponent(query)})`
- Track PostHog event `search_submitted`

### Header Search Icon
- onClick: `router.push(/search)` (opens empty search page)

## Key Decisions

1. **LLM generates GROQ via MCP tools** — the LLM uses `groq_query` tool to query Sanity, then structures results. This grounds search in real data.
2. **Structured output via Zod** — `generateObject` ensures the LLM returns typed results, not freeform text.
3. **Two result types** — video moments (matched at timestamp) and lessons (matched on topic). Both link to the lesson page.
4. **No chat UI** — full results page with cards, count, and sort. Not a conversational interface.
5. **Server-only MCP** — browser never sees the MCP URL, Sanity token, or OpenAI key.
6. **Initial context caching** — fetch schema context once, reuse for 5min to avoid latency on every request.

## Security Considerations

- `SANITY_API_TOKEN` and `OPENAI_API_KEY` stay server-only
- MCP connection is server-side only
- Query validation: non-empty, max 500 chars, sanitize
- No user content from query reaches third parties beyond the LLM provider
- Rate limiting should be considered for production (not in scope now)

## Acceptance Criteria

1. `/search?q=data+breach` returns structured results with video and lesson cards
2. Video result cards show thumbnail, labels, description, timestamp, and "Watch" button
3. Lesson result cards show labels, key points, description, and "Open" button
4. Result count displays correctly
5. Sort control filters/orders results
6. Empty state shows when no results found
7. Hero search form navigates to `/search` with query param
8. Header search icon navigates to `/search`
9. `/search` is a public route (no auth required to search)
10. Type check passes (`npx tsc --noEmit`)
11. Lint passes

## Checks to Run

1. `npx tsc --noEmit` — type check
2. `npm run lint` — lint
3. `npm run build` — production build (routes changed)
4. Manual test: navigate to `/search?q=data+breach` and verify results render
