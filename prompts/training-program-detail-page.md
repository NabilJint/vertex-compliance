# Training Program Detail Page

## Goal
Build the training program detail page shown in `design/image copy 2.png` (Security Awareness Training layout), wired to real, already-seeded Sanity content — not mock data. Route: `/catalog/[slug]`.

## Skills Read
- sanity-best-practices (GROQ query shape, image URL builder usage)
- AGENTS.md sections 3 (UI), 5 (structure/boundaries), 7 (progress tracking decisions), 8 (data model), 13 (checks)

## Existing Code Inspected
- `sanity/lib/queries.ts` — `TRAINING_PROGRAM_BY_SLUG_QUERY` already resolves `modules[].lessons[]->`, `trainer->`, `category->`. Missing `_updatedAt`.
- `lib/sanity.ts` — server-only fetch helpers (`getTrainingProgramBySlug`, `getProgressByUser`), no related-programs helper yet.
- `sanity/lib/client.ts` — `readClient` (token, no CDN) for private-dataset server reads; `client` (CDN, no token) unused here.
- `studio/schemaTypes/*` — confirms field names/shapes (lesson has `isFreePreview`, `duration` in seconds, no quiz/certificate fields; trainingProgram has no `videoUrl` of its own).
- `components/ui/*` — Button, Card, Badge (`free-preview` variant exists), Avatar, Progress (linear + circular) already built to spec; reused as-is, no new primitives needed.
- `components/home/header.tsx` / `footer.tsx` — reused verbatim; pages compose `Header`/`Footer` themselves (no shared layout wrapper).
- Confirmed live in Sanity (via readClient, not mocked): 10 trainingProgram docs, 34 lessons, 6 trainers. `cybersecurity-awareness` is the closest live match to the "Security Awareness Training" reference (2 modules / 4 lessons — real counts will differ from the mock's "3 modules · 9 lessons", which is expected since we render actual data, not the design's placeholder numbers).
- No `progress` documents exist yet for any user (0 in dataset), so the progress card will legitimately show 0% / not-started until an employee completes lessons.
- No middleware.ts exists — page stays public per section 5 ("keep browsing public"); progress is read only when a Clerk session exists.

## Decisions & Assumptions
1. **Route**: `/catalog/[slug]` (matches the design's breadcrumb "Catalog > Program" and the existing `/catalog` nav link/href already used by `FeaturedTraining`'s "View all").
2. **No quiz/certificate schema exists.** The design's "3 knowledge checks" line is fabricated data we don't have — omit it rather than invent a number. Keep only descriptors backed by real fields or universally-true product facts (lesson count, certificate on completion, desktop/mobile availability) — no fabricated counts.
3. **"Required annually" pill** → schema only has `requiredBy` (a date), no recurrence. Render "Required by {date}" from real data instead of inventing "annually".
4. **"Last updated"** → derived from the document's real `_updatedAt`, formatted as "Month YYYY".
5. **Hero visual** → use `program.coverImage` (real, populated in seed) with a play-button overlay that links to the first free-preview lesson (falls back to the first lesson of module 1 if none is marked preview). No fabricated "certificate" video.
6. **Module/lesson numbering** (Module 1, Lesson 1.1, etc.) is derived from array order, never stored — per section 8.
7. **Progress wiring** (per section 7, in scope for this page):
   - Server-reads Clerk `userId` via `auth()`. If signed in, fetch `getProgressByUser(userId)`.
   - Per lesson: `completed` if its `_id` is in `completedLessons`; `in-progress` if it's `lastPosition.lesson._id` and not completed; otherwise not-started.
   - Overall percent = completed lessons in *this* program ÷ total lessons in this program.
   - "Resume training" targets `lastPosition.lesson` (if it belongs to this program) → else first not-completed lesson → else first lesson. Query param `?t={positionSeconds}` carries the resume second.
   - Signed-out or no progress doc: everything renders not-started, 0%, primary CTA reads "Start training" (no resume state). This is a real, ungated read — no write path is touched from this page.
8. **Lesson/trainer link targets**: lesson rows and CTAs link to `/lessons/[slug]` (not yet built — separate task per AGENTS.md workflow); trainer "View full profile" links to `/trainers/[slug]` (not yet built). These will 404 until those pages exist — flagged in the final report, not blocking this page.
9. **Related training**: new query fetches up to 3 other programs in the same category (falls back to filling from any other program if the category has fewer than 3), excluding the current program — real data, no placeholders.
10. **Expand/collapse curriculum** ("Expand all" + per-module chevrons) is local UI state only (client component) — no persistence, matches "presentational" nature of this interaction.

## Files to Touch
1. `sanity/lib/queries.ts` — add `_updatedAt` to `TRAINING_PROGRAM_BY_SLUG_QUERY`; add `RELATED_TRAINING_PROGRAMS_QUERY`.
2. `lib/sanity.ts` — add `getRelatedTrainingPrograms(categoryId, excludeId)`.
3. `lib/utils.ts` — add `formatDuration(seconds)` (→ "1h 18m") and `formatMonthYear(dateString)` helpers (reusable across future pages).
4. `app/catalog/[slug]/page.tsx` — new server component page: fetches program (404 via `notFound()` if missing), Clerk `userId`, progress; computes per-lesson/overall status; renders sections in order.
5. `components/training/hero.tsx` — badges (category, Popular), title, summary, trainer mini-row, duration/lesson-count/required-by meta, cover image with play overlay + duration/certificate pills, Start/Preview/Resume CTAs, "Last updated" line.
6. `components/training/what-you-learn.tsx` — 2x2 grid from `learningOutcomes[]` (icon, title, description) — renders nothing if empty.
7. `components/training/curriculum.tsx` — client component: module accordion (title, summary, lesson rows with number, title, duration, status icon, Preview badge), "Expand all" toggle, plus the "This training includes" + progress sidebar card (Resume/Start button).
8. `components/training/instructor.tsx` — trainer photo, name, expertise pills (split from `expertise` string or shown as one pill — schema stores a single string, not an array, so render as a single pill instead of fabricating three), bio, "View full profile" link.
9. `components/training/related-training.tsx` — 3 related-program cards (thumbnail, category badge, title, trainer, duration, lesson count, 0%/actual progress ring), "View all" link to `/catalog`.

## Requirements
- Server-fetch everything through `readClient`/`lib/sanity.ts` — no client-side Sanity calls, no token in the browser.
- Use `components/ui/*` primitives (Button, Card, Badge, Avatar, Progress) — no raw `<button>`/`<span>` for these roles.
- Use `urlFor()` for all Sanity images, `next/image` for rendering.
- Responsive down to mobile: hero grid stacks, curriculum sidebar moves below the module list, related-training grid collapses to 1 column.
- Reuse `Header`/`Footer` from `components/home/`.
- No fabricated counts/labels — every number on the page must trace to a real Sanity field or a derived count (module/lesson index, lesson total, completed count).

## Security Considerations
- Read token (`SANITY_API_READ_TOKEN`) stays server-side inside `lib/sanity.ts`/`readClient` — page is a server component, never ships the token to the client.
- Clerk `userId` read via `auth()` server-side only; no progress write happens on this page (read-only per section 5 — writes are a separate server route, out of scope here).
- No user-supplied input is interpolated into GROQ (slug comes from the route param and is passed as a query parameter, not concatenated).

## Acceptance Criteria
1. Visiting `/catalog/cybersecurity-awareness` renders real seeded data end-to-end: title, summary, trainer, category, all real modules/lessons, real durations, real learning outcomes.
2. Progress section reflects actual state: 0%/not-started for a signed-out visitor or a signed-in user with no `progress` doc.
3. Curriculum lesson numbering and totals are computed from the real array lengths, not hardcoded.
4. Related training shows real programs from Sanity, never the current program.
5. An unknown slug (`/catalog/does-not-exist`) renders Next's `notFound()` 404.
6. `npx tsc --noEmit` passes.
7. `npm run lint` passes.
8. `npm run build` passes.

## Checks to Run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `npm run dev` → manual test below

## Manual Test Steps
1. Start dev server (do not kill any already-running instance — use a new port if needed).
2. Visit `/catalog/cybersecurity-awareness` — confirm hero (title "Cybersecurity Awareness", trainer Priya Sharma, category Cybersecurity), what-you'll-learn grid (4 real outcomes), curriculum (2 real modules / 4 real lessons with correct numbering 1.1–2.2), instructor section (Priya Sharma bio), related training (3 other real programs).
3. Click "Expand all" — all modules open; click a module chevron — it collapses individually.
4. Click a lesson row / "Preview first lesson" / "Start training" — confirm it navigates to `/lessons/[slug]` (will 404 until the lesson page is built — expected).
5. Visit `/catalog/does-not-exist` — confirm a 404 page renders.
6. Resize to mobile width — confirm hero stacks, sidebar moves under curriculum, related-training cards go to 1 column.
7. Sign in with Clerk, manually create a `progress` document in Studio for your Clerk user id referencing one lesson in this program, reload — confirm the checkmark, in-progress ring, and percentage update to reflect it.
