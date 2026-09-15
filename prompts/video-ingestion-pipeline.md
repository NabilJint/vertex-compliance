# Video Ingestion Pipeline — Implementation Prompt

## Goal

Build an offline CLI tool that fetches real YouTube transcripts and chapter markers, then creates/updates `video` documents in Sanity with properly chunked timestamped transcript data.

## What Exists Today

- **Video schema** (`studio/schemaTypes/video.ts`): `videoId`, `videoUrl`, `chapters[{startSeconds, label}]`, `chunks[{startSeconds, text}]`
- **Seed script** (`studio/migration/seed.ts`): generates placeholder video data (fake "Section N" chapters every 120s, fake "Transcript chunk..." every 30s)
- **YouTube utils** (`lib/youtube.ts`): `getYouTubeVideoId()`, `getYouTubeEmbedUrl()`
- **Search API** (`app/api/search/route.ts`): matches `chapters[].label` and `chunks[].text` via GROQ wildcard queries
- **Video player** (`components/lesson/video-player.tsx`): YouTube-only embed, supports `positionInSeconds` for start-at
- **Sanity clients** (`sanity/lib/client.ts`): `client` (CDN), `readClient` (token read), `writeClient` (token write)
- **Lesson seed data** (`studio/migration/seed.ts`): 25 lessons with YouTube URLs across 10 training programs
- **Query** (`sanity/lib/queries.ts`): `VIDEO_BY_URL_QUERY` fetches video by URL with chapters + chunks

**Key gap**: No real transcript or chapter data exists. All video documents are placeholder stubs.

## Design Decisions

1. **YouTube only for now** — the project currently supports only YouTube embeds (video-player.tsx uses `getYouTubeEmbedUrl`). Do not build Vimeo or Bunny ingestion yet.
2. **Transcript via `youtube-transcript` npm package** — fetches auto-generated or manual captions from YouTube's timedtext API. No API key needed.
3. **Chapters via `youtube-chapters` npm package** — fetches chapter markers from YouTube's playerOverlays. No API key needed.
4. **Chunk size: ~120 seconds** — each chunk holds ~2 minutes of transcript text, matching the chapter granularity the search system expects. Shorter chunks create noise; longer chunks lose timestamp precision.
5. **CLI tool lives at `studio/migration/ingest-videos.ts`** — same location as the existing seed script, runs standalone via `npx tsx`.
6. **Deduplication by videoId** — if a video document already exists in Sanity with the same `videoId`, overwrite its chapters and chunks (idempotent).
7. **Lesson lookup by videoUrl** — after creating/updating a video document, the tool also finds the matching lesson and ensures the lesson's `videoUrl` field points to the YouTube URL, linking video documents to lessons.

## Implementation

### Step 1: Install dependencies

```bash
npm install youtube-transcript youtube-chapters
npm install -D @types/youtube-chapters
```

- `youtube-transcript` — fetches YouTube captions/subtitles as `[{text, offset, duration}]`
- `youtube-chapters` — fetches YouTube chapter markers as `[{title, startTimeSeconds}]`

### Step 2: Create `studio/migration/ingest-videos.ts`

This is the main ingestion script. Structure:

```
studio/migration/ingest-videos.ts
```

#### Core functions:

**`fetchYouTubeTranscript(videoId: string): Promise<TranscriptEntry[]>`**
- Uses `youtube-transcript` to fetch captions
- Returns `[{text: string, offset: number, duration: number}]` (offset in ms, duration in ms)
- Handles missing transcripts gracefully (return empty array, log warning)

**`fetchYouTubeChapters(videoId: string): Promise<ChapterEntry[]>`**
- Uses `youtube-chapters` to fetch chapter markers
- Returns `[{title: string, startTimeSeconds: number}]`
- Handles videos with no chapters gracefully (return empty array)

**`chunkTranscript(entries: TranscriptEntry[], chunkDurationSeconds: number = 120): ChunkEntry[]`**
- Groups transcript entries into chunks of ~`chunkDurationSeconds` seconds
- Each chunk has `startSeconds` (chunk start time) and `text` (concatenated transcript text)
- Chunk boundaries: 0-120s, 120-240s, 240-360s, etc.
- Trim whitespace from each chunk's text

**`normalizeChapters(rawChapters: ChapterEntry[], videoDurationSeconds?: number): ChapterEntry[]`**
- Converts chapter data to `[{startSeconds: number, label: string}]`
- Sorts by start time
- If no chapters exist, create synthetic chapters every 300s (5 min) from the transcript or video duration
- Filter out chapters with empty or meaningless labels

**`deriveVideoId(url: string): string`**
- Extracts the YouTube video ID from the URL using `getYouTubeVideoId()` from `lib/youtube.ts`
- Sanitize the ID for use as Sanity document ID (strip any chars Sanity rejects)

**`createOrUpdateVideoDoc(sanityClient, videoId, videoUrl, chapters, chunks): Promise<string>`**
- Uses `sanityClient.createOrPatch(videoId)` pattern
- If document with `_id: videoId` exists: set `chapters` and `chunks`, set `videoUrl`
- If not: create `{_id: videoId, _type: "video", videoId, videoUrl, chapters, chunks}`
- Return the document ID

**`findLessonByVideoUrl(sanityClient, videoUrl): Promise<string | null>`**
- Query: `*[_type == "lesson" && videoUrl == $videoUrl][0]._id`
- Returns the lesson ID if found

**`main()` — CLI entry point**
- Parse CLI args: `--dry-run` (preview without writing), `--video-url <url>` (ingest a single video), `--all` (ingest all lessons), `--limit <n>` (limit number of videos)
- When `--all`: fetch all lessons from Sanity, extract unique video URLs, process each
- When `--video-url`: process just that one video
- For each video URL:
  1. Extract videoId
  2. Fetch transcript + chapters in parallel
  3. If no transcript and no chapters: log warning and skip
  4. Chunk transcript, normalize chapters
  5. Create/update video document in Sanity
  6. Log progress (video ID, chapters found, chunks created)
- Summary at end: X videos processed, Y skipped, Z errors

#### CLI interface:

```bash
# Ingest all lesson videos
npx tsx studio/migration/ingest-videos.ts --all

# Ingest a single video
npx tsx studio/migration/ingest-videos.ts --video-url "https://www.youtube.com/watch?v=JukEQq4XeCc"

# Dry run (preview without writing)
npx tsx studio/migration/ingest-videos.ts --all --dry-run

# Limit number of videos
npx tsx studio/migration/ingest-videos.ts --all --limit 5
```

### Step 3: Add npm script

In root `package.json`, add:

```json
"ingest:videos": "cd studio && npx tsx migration/ingest-videos.ts --all"
```

### Step 4: Environment variables

The script uses the same Sanity credentials as the rest of the project:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — dataset name (defaults to "production")
- `SANITY_API_TOKEN` — write token (needed to create/update video documents)

Read from `../env.ts` (studio's env module) or from process.env directly. Follow the pattern in `studio/migration/seed.ts` which reads env vars directly.

### Step 5: Type definitions

Define these types at the top of the ingestion script (do not add to shared `lib/types.ts` since these are ingestion-only):

```typescript
interface TranscriptEntry {
  text: string
  offset: number   // ms
  duration: number // ms
}

interface RawChapter {
  title: string
  startTimeSeconds: number
}

interface IngestedChapter {
  startSeconds: number
  label: string
}

interface IngestedChunk {
  startSeconds: number
  text: string
}
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `studio/migration/ingest-videos.ts` | Create | Main ingestion CLI script |
| `package.json` | Edit | Add `ingest:videos` script |
| `.env.example` | Edit | Add note about `SANITY_API_TOKEN` being needed for ingestion |

## Security Considerations

- The script runs offline, never in a request path
- `SANITY_API_TOKEN` (write token) is only used server-side in the script
- No tokens are exposed to the browser
- The script does not log token values
- Use `createOrPatch` (upsert) to avoid duplicate documents

## Acceptance Criteria

1. `npx tsx studio/migration/ingest-videos.ts --all` processes all 25 lesson videos
2. Each video document in Sanity has real transcript chunks (not placeholder text)
3. Each video document has chapter markers (or synthetic chapters if none exist)
4. Chunks are ~120 seconds each with properly concatenated transcript text
5. Chapters are sorted by start time with correct labels
6. Running the script again is idempotent (same result, no duplicates)
7. `--dry-run` shows what would happen without writing
8. `--video-url` works for single video ingestion
9. The search API can find content within the ingested transcript chunks
10. TypeScript compiles without errors, lint passes

## Manual Test Steps

1. **Type check**: `cd studio && npx tsc --noEmit`
2. **Dry run**: `npx tsx studio/migration/ingest-videos.ts --all --dry-run` — should list all videos with transcript/chapter counts
3. **Single video**: `npx tsx studio/migration/ingest-videos.ts --video-url "https://www.youtube.com/watch?v=JukEQq4XeCc"` — should create a video document with real data
4. **Full run**: `npx tsx studio/migration/ingest-videos.ts --all` — should process all 25 videos
5. **Verify in Sanity Studio**: Open Studio, navigate to Videos, confirm documents have chapters and chunks
6. **Search test**: Search for a topic that appears in a real transcript, verify video results appear with correct timestamps
7. **Idempotency**: Run `--all` again, verify no duplicates and same document IDs

## Dependencies to Install

```bash
# In root project directory
npm install youtube-transcript youtube-chapters
```

- `youtube-transcript` — no API key needed, fetches auto/manual captions
- `youtube-chapters` — no API key needed, fetches chapter markers from playerOverlays
