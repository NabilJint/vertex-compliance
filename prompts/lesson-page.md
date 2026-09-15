# Lesson page

## Goal
Build the lesson page (`/lessons/[slug]`) from the attached desktop reference (`design/image copy 3.png`): video player, lesson header, tabbed content (Overview / Notes / Resources / Transcript), a sticky course sidebar with module list and progress, and prev/next lesson navigation — wired to seeded Sanity content, with the lesson's YouTube video actually playing on the page. Responsive down to mobile (stack the sidebar below content, collapse to a single column).

## Skills read
- `sanity-best-practices` — GROQ projection patterns, reverse references, TypeGen conventions.
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` — Route Handler conventions for the new progress-write endpoint (async `params`/`ctx`, POST not cached).

## Code inspected
- `studio/schemaTypes/lesson.ts`, `trainingProgram.ts`, `progress.ts` — field shapes. Lessons don't store their parent program (need reverse reference). `progress` doc has `completedLessons[]` refs + one `lastPosition {lesson, positionSeconds}`.
- `sanity/lib/queries.ts`, `lib/sanity.ts`, `lib/types.ts` — existing query/fetch/type conventions (`defineQuery`, `readClient`, typed fetch wrappers).
- `sanity/lib/client.ts` — `readClient` (CDN, read token) and `client` (public). No write client exists yet.
- `app/catalog/[slug]/page.tsx` — establishes the `/lessons/${slug}?t=${seconds}` URL convention, the `statusFor()`/completed-set/resume logic, and the async `params: Promise<...>` pattern (Next 16).
- `components/training/curriculum.tsx` — module accordion, `StatusIcon` (completed/in-progress/not-started), `formatDuration`, `capturePostHogEvent`, sticky sidebar card pattern to mirror in the lesson sidebar.
- `components/training/hero.tsx` — breadcrumb, badge/color usage (`getCategoryColor`), `urlFor` image usage.
- `components/ui/{button,card,badge,progress,tabs,avatar,toast}.tsx` — primitives to reuse; no raw `<button>`/`<div>` cards.
- `components/home/header.tsx` — nav already includes Catalog/My Training/Search/Dashboard, bell, `UserButton`; nothing to change here.
- `lib/utils.ts` (`cn`, `formatDuration`, `formatFullDate`), `lib/posthog-client.ts` (`capturePostHogEvent`), `lib/category-colors.ts`, `lib/learning-outcome-icons.ts` (icon-by-string-key pattern to mirror for resource types).
- `proxy.ts` — Clerk middleware; public routes are `/`, `/sign-in`, `/sign-up`, `/design-system-showcase`, `/catalog`. `/lessons` is **not** public, so it's already gated by `auth.protect()` — no middleware change needed, and it's the right behavior since progress tracking requires a signed-in user.
- `studio/migration/seed.ndjson` — every seeded lesson's `videoUrl` is a YouTube watch URL; 34 `video` docs exist with `chapters`/`chunks` (chunk text is placeholder ingestion data, e.g. `"[Transcript chunk for ... at 30s]"` — real text, just not real captions yet).
- `package.json` — `@portabletext/react` is **not** installed yet despite being in the AGENTS.md stack; needs adding.

## Decisions & assumptions (flag if wrong)
1. **Video playback**: YouTube provider only (matches 100% of seeded data). Embed via the YouTube IFrame Player API (official JS API, not a custom player UI) so we can seek to the `?t=` query param, poll `getCurrentTime()` to save resume position, and detect play/pause for analytics. This does not violate "no custom player" — all transport controls are YouTube's own chrome (`controls: 1`).
2. **"Required annually" badge**: the schema has no recertification-cadence field, only `trainingProgram.requiredBy` (a date). Rather than invent copy, I'll render `Required by {date}` from real data when `requiredBy` exists, and omit the badge otherwise.
3. **Notes tab**: per AGENTS.md §15 this is presentational-only with no backend. I'll render a plain textarea for personal scratch notes, persisted only to `localStorage` (per-lesson key) — never sent to a server. Purely a client convenience.
4. **Bookmark icon** (top-right of lesson header, next to Mark complete): no schema field backs it. Local UI toggle only, not persisted, matching the "presentational surfaces" pattern.
5. **Transcript tab**: renders the lesson's `video` doc `chunks[]` (via `videoUrl`) as a clickable timestamp list that seeks the player. This is internal-lookup data being shown to the signed-in employee on the lesson page itself (not as a search result), which AGENTS.md restricts — search results — not lesson-page transcript display, so this is in bounds. Chunk text will show the seeded placeholder strings until real ingestion runs; that's expected with current seed data.
6. **Reverse reference**: one GROQ query fetches the lesson plus `"program": *[_type == "trainingProgram" && references(^._id)][0]{...}` projecting modules/lessons so I can derive module/lesson numbering ("Module 1 · Lesson 1.1"), the sidebar module list, and prev/next lesson — no separate round trip.
7. **Mark complete**: manual button only (matches design — lesson is 34% watched but not auto-completed). No auto-complete-at-90% behavior; that's not shown in the reference and would be inventing UX.
8. **`StatusIcon`** (completed/in-progress/not-started dot) is currently private to `curriculum.tsx` but the lesson sidebar needs the identical icon. I'll extract it to `components/ui/status-icon.tsx` and import it in both places (first-duplication-use promotion, per AGENTS.md reusability rule).

## Files expected to touch
- `sanity/lib/queries.ts` — add `LESSON_PAGE_QUERY` (lesson + reverse-referenced program/modules).
- `sanity/lib/client.ts` — add `writeClient` (server-only, `SANITY_API_TOKEN`, `useCdn: false`) for progress writes.
- `lib/sanity.ts` — add `getLessonPageBySlug`, `saveProgress` (writeClient patch/createIfNotExists).
- `lib/types.ts` — add `LessonPageData`, `LessonPageModule`, `VideoDoc` types.
- `lib/utils.ts` — add `formatTimestamp(seconds)` → `"8:12"` / `"1:02:56"` (video timer + transcript stamps).
- `lib/youtube.ts` — new: `getYouTubeVideoId(url)`, `getYouTubeEmbedUrl(url, startSeconds)`.
- `components/ui/status-icon.tsx` — new, extracted from `curriculum.tsx`.
- `components/training/curriculum.tsx` — swap inline `StatusIcon` for the shared one.
- `components/lesson/video-player.tsx` — new, client component, YouTube IFrame API integration, "Now playing" + "N of M in this module" badges, watched-% bar.
- `components/lesson/lesson-header.tsx` — new: title, Module/Lesson label, meta row (duration, views, required-by), Mark complete + bookmark buttons.
- `components/lesson/lesson-tabs.tsx` — new: Overview (key points + Portable Text notes + pro tip), Notes (local textarea), Resources, Transcript.
- `components/lesson/lesson-sidebar.tsx` — new: program mini-card, course progress, module accordions (current lesson highlighted "Now playing"), Next lesson CTA.
- `components/lesson/lesson-navigation.tsx` — new: previous/next lesson footer bar.
- `app/lessons/[slug]/page.tsx` — new server component page, composes the above.
- `app/api/progress/route.ts` — new POST route: `{ lessonId, positionSeconds?, completed? }`, authenticated via Clerk `auth()`, writes via `writeClient`.
- `package.json` — add `@portabletext/react`.

## Requirements
- Match the reference image exactly at desktop width; adapt responsively below (sidebar moves under main content, video stays full-width, tabs remain horizontally scrollable if needed).
- Reuse `Card`, `Badge`, `Button`, `Progress`, `Tabs`, `Avatar` — no raw elements where a component exists.
- Video actually plays in place via the YouTube embed; `?t=<seconds>` in the URL seeks on load; resume position autosaves (throttled, e.g. every ~10s while playing and on pause/unload) via `POST /api/progress`.
- Mark complete calls the progress route, optimistically updates the button + sidebar checkmark, and fires a `lesson_completed` PostHog event.
- Instrument `lesson_viewed` (page load), `video_played` (first play), and `lesson_completed`, consistent with existing `capturePostHogEvent` usage elsewhere.
- Module/lesson numbering ("Module 1 · Lesson 1.1") and the "1 of 3 in this module" badge are derived from array order, never stored.
- Ground everything in real Sanity data; no invented copy (see decision #2).
- Prev/next lesson nav computed from the flattened, ordered lesson list of the parent program.

## Security considerations
- `/lessons/*` stays behind Clerk's existing `auth.protect()` (already the default — not in `proxy.ts`'s public list). No middleware change.
- `SANITY_API_TOKEN` (write) only ever touches `sanity/lib/client.ts`'s new `writeClient`, used only inside `app/api/progress/route.ts` — never imported into a client component.
- The progress route derives `userId` from `auth()` server-side, never from the request body — one user cannot write or read another's progress.
- Progress route validates `lessonId` is a non-empty string and `positionSeconds`/`completed` are the right primitive types before writing; malformed requests get `400`.
- YouTube iframe uses the standard `allow` attribute set and `allowFullScreen`; no `sandbox` bypass, no eval'd remote content beyond YouTube's own trusted embed/IFrame API script.

## Acceptance criteria
- Visiting `/lessons/[slug]` while signed out redirects to sign-in (existing middleware behavior); signed in, the page renders.
- Video plays in place; navigating from the sidebar/prev-next to a different lesson swaps the video and resets state.
- `?t=176` seeks the player to 2:56 on load (matches the mockup's "2:56 / 8:12").
- Sidebar shows real module/lesson titles, durations, and completion state from Sanity + the signed-in user's progress doc; percentages match `completed / total`.
- Mark complete persists (reload shows the lesson as completed) and updates `completedLessons` in the `progress` doc for that Clerk user only.
- Overview tab renders `keyPoints`, Portable Text `notes`, and `proTip` from the actual lesson document (not hardcoded copy).
- Resources tab lists `lesson.resources`; empty state if none.
- Transcript tab lists the matching `video` doc's `chunks`, each seeking the player on click; graceful empty state if no `video` doc matches the `videoUrl`.
- Page is usable at ~400px width with no horizontal scroll on the body.

## Checks to run
- `npx tsc --noEmit` (type check)
- `npm run lint`
- `npm run build` (route + server code added)
- `npm run dev` and manually exercise the flow below

## Manual test steps
1. `npm run dev`, sign in, go to a training program in the catalog, click a lesson to land on `/lessons/<slug>`.
2. Confirm the YouTube video loads and plays; pause/seek using the player's own controls.
3. Copy the URL, append `?t=60`, reload — confirm playback starts at 0:60.
4. Click "Mark complete" — button updates, sidebar checkmark for that lesson turns green; reload the page and confirm it's still marked complete.
5. Let the video play ~15s, navigate away and back (or reopen the program page) — confirm the lesson shows a resume position / "in progress" state.
6. Click through Overview / Notes / Resources / Transcript tabs; in Transcript, click a timestamp and confirm the player seeks there.
7. Click "Next lesson" in the sidebar and in the bottom nav bar; confirm it moves to the correct next lesson (or is disabled/hidden on the last lesson).
8. Resize the browser to ~390px width — confirm the sidebar stacks below the main content and nothing overflows horizontally.
