# Catalog Page

## Goal
Add a simple `/catalog` page listing all training programs from Sanity — the landing point every "Catalog" link/breadcrumb on the site already points to but that doesn't exist yet. No filters, no search, no pagination — just a header, a title, and a grid of real programs. Keep it small.

## Skills Read
- AGENTS.md sections 3 (reuse components, no overbuild), 5 (server-only data), 15 (keep it small)

## Existing Code Inspected
- `components/training/related-training.tsx` already has the exact card markup this page needs (thumbnail, category badge in the category's color, title, trainer, duration, lesson count) — extracting it into a shared component avoids duplicating that JSX a third time (home page's `FeaturedTraining` has its own distinct card style already shipped and approved; not touching it).
- `sanity/lib/queries.ts` `ALL_TRAINING_PROGRAMS_QUERY` exists but isn't used anywhere yet and doesn't return `lessonDurations` (only a `lessonCount` via `count()`) — will reshape it to match the same card-data shape already used by the related/featured queries, since nothing depends on its current shape.
- `lib/types.ts` `RelatedTrainingProgram` is exactly the data shape a catalog card needs.

## Decisions & Assumptions
1. Extract `components/training/related-training.tsx`'s card into `components/training/program-card.tsx` (a `ProgramCard` component); both `RelatedTraining` and the new catalog page use it. `FeaturedTraining`'s card stays separate (different, already-approved visual style for the home page).
2. Reshape `ALL_TRAINING_PROGRAMS_QUERY` to the same fields as `RELATED_TRAINING_PROGRAMS_QUERY` (drop unused `summary`/`learningOutcomes`/`isPopular`/`employeeCount`, add `lessonDurations`) since it has no current callers.
3. Page: `Header`, a plain "Catalog" title, a responsive grid (1/2/3 columns) of all programs sorted alphabetically (existing query order), `Footer`. No category filter, no search bar, no pagination — genuinely simple, matching what was asked.

## Files to Touch
1. `sanity/lib/queries.ts` — reshape `ALL_TRAINING_PROGRAMS_QUERY`.
2. `lib/sanity.ts` — retype `getAllTrainingPrograms()` to `RelatedTrainingProgram[]`.
3. `components/training/program-card.tsx` — new, extracted from `related-training.tsx`.
4. `components/training/related-training.tsx` — use the extracted `ProgramCard`.
5. `app/catalog/page.tsx` — new server component page.

## Requirements
- Server-fetched via `lib/sanity.ts`, no client Sanity calls.
- Reuse `components/ui/*` and the new `ProgramCard` — no new one-off card markup.
- Responsive down to mobile (grid collapses to 1 column).

## Acceptance Criteria
1. `/catalog` lists all 10 real seeded training programs with real titles, trainers, categories (colored per the existing category map), durations, lesson counts.
2. The existing "Catalog" breadcrumb link (training program page) and nav link now resolve instead of relying on a page that didn't exist.
3. `npx tsc --noEmit`, `npm run lint`, `npm run build` pass.

## Checks to Run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. Manual: visit `/catalog`, click a card through to its `/catalog/[slug]` page.
