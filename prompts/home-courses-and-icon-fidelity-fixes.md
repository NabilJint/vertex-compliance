# Home Page Course Data + Icon/Badge Fidelity Fixes

## Goal
1. Replace the hardcoded mock array in `FeaturedTraining` with real, seeded Sanity training programs.
2. Fix a design-fidelity regression found by comparing the live `/catalog/[slug]` page against `design/image copy 2.png` with Playwright: learning-outcome icons render as raw multicolor emoji glyphs (pulled straight from the Sanity `icon` string field) instead of the clean monochrome line icons the reference design uses.
3. Fix two smaller fidelity gaps the same comparison surfaced: category badges are a single flat blue everywhere (design/home page color-code by category) and a trainer's single `expertise` string renders as one long pill instead of several short ones like the reference.

## Skills Read
- AGENTS.md sections 3 (UI must match reference, reuse components), 5 (server-only data access), 7 (grounded content), 15 (keep it small)

## Existing Code Inspected
- `components/home/featured-training.tsx` — `trainings` is a hardcoded array of 4 fake programs with `picsum.photos` thumbnails; not wired to Sanity at all.
- Confirmed live in Sanity: 4 of the 10 `trainingProgram` docs have `isPopular: true` (`data-privacy-fundamentals`, `workplace-safety-essentials`, `financial-compliance-aml`, `preventing-workplace-harassment`) — an exact match for a 4-card "Featured Training" section, no new flag needed.
- `components/training/what-you-learn.tsx` (built in the previous task) renders `outcome.icon` directly as text. Sanity seed data stores that field as a raw emoji per outcome (confirmed via seed inspection: 🎣 🔑 📁 🚨 etc., ~38 distinct emoji across all programs) — a content-authoring convenience, not a design system icon.
- Playwright screenshot of `/catalog/cybersecurity-awareness` at 1440px vs. `design/image copy 2.png`: confirms 4 "What you'll learn" cards render mismatched multicolor emoji (headphones, key, folder, siren) inside the light-blue icon squares instead of the reference's consistent single-tone icon glyphs — the siren emoji's own red color even bleeds through, making that one card look like it has a different background.
- Same comparison: the reference and the home page (`FeaturedTraining`) color-code category badges (blue/purple/green/amber per category); my `/catalog/[slug]` hero and related-training cards render every category badge with the same flat blue (`Badge variant="in-progress"`).
- Same comparison: reference instructor panel shows 3 short expertise pills ("Security", "Incident Response", "ISO 27001"); schema only has one `expertise` string per trainer (e.g. "Cybersecurity & Information Security"), so my `Instructor` component renders one long pill.
- `lib/sanity.ts` / `sanity/lib/queries.ts` — existing helpers/patterns to follow for a new `getFeaturedTrainingPrograms()` query.

## Decisions & Assumptions
1. **Featured Training query**: `*[_type == "trainingProgram" && isPopular == true] | order(requiredBy asc) [0...4]` with trainer/category refs, lesson count, and summed lesson duration — mirrors the shape already used for related training. If fewer than 4 programs are ever marked popular, top up from the remaining programs ordered by `requiredBy asc` (same fallback pattern as `getRelatedTrainingPrograms`), so the section never looks broken as content changes.
2. **Icon fix**: build a small emoji→lucide-icon lookup (`lib/learning-outcome-icons.ts`) covering every emoji value present in the seed data, with a generic fallback icon (`Sparkles`) for any future/unmapped value. Icons render in `currentColor` (a fixed blue) inside the existing light-blue square, matching the reference's consistent single-tone treatment. This is a display mapping only — the underlying Sanity content and its meaning are untouched.
3. **Category color fix**: add `lib/category-colors.ts` — a slug→hex map for the 5 real categories (cybersecurity blue, data-privacy-protection green, workplace-safety amber, financial-compliance violet, ethics-conduct pink), with a neutral slate fallback for anything unmapped. Used by `TrainingHero`, `RelatedTraining`, and rewritten into `FeaturedTraining` (replacing its hardcoded per-card `badgeColor`) so category coloring is consistent and driven by the same source everywhere instead of duplicated/hardcoded per component.
4. **Expertise pills**: split the trainer's `expertise` string on `&`, `,`, or `/` into up to 3 trimmed pills (falls back to one pill if it doesn't contain a separator) — still 100% derived from the real field, just presented the way the reference groups short tags instead of one long sentence-like pill.
5. Thumbnails: `FeaturedTraining` switches from `picsum.photos` placeholders to each program's real `coverImage` via `urlFor`.

## Files to Touch
1. `sanity/lib/queries.ts` — add `FEATURED_TRAINING_PROGRAMS_QUERY` (+ reuse `OTHER_TRAINING_PROGRAMS_QUERY` shape for fallback top-up, or add a small dedicated fallback query).
2. `lib/sanity.ts` — add `getFeaturedTrainingPrograms()`.
3. `components/home/featured-training.tsx` — becomes an async server component fetching real data; card renders real title/trainer/category/duration/lesson count/cover image; progress ring stays 0% (no signed-in user context on the home page in scope here).
4. `lib/learning-outcome-icons.ts` — new emoji→lucide icon map + fallback.
5. `components/training/what-you-learn.tsx` — render the mapped icon component instead of the raw emoji string.
6. `lib/category-colors.ts` — new slug→hex map + fallback.
7. `components/training/hero.tsx`, `components/training/related-training.tsx` — use the category color map instead of a flat `Badge variant="in-progress"`.
8. `components/training/instructor.tsx` — split `expertise` into multiple pills.

## Requirements
- All home-page course data server-fetched through `lib/sanity.ts` (no client-side Sanity calls).
- No fabricated counts — featured programs, durations, lesson counts all come from real fields/derived counts.
- Reuse `components/ui/*` (Card, Badge, Avatar, Progress) — no new primitives.
- lucide-react only for icons — no emoji left in rendered UI.

## Security Considerations
- No change to token handling; `getFeaturedTrainingPrograms()` follows the same `readClient` server-only pattern as every other data-layer function.

## Acceptance Criteria
1. Home page "Featured Training" shows the 4 real `isPopular` programs with real titles, trainers, categories, durations, lesson counts, and cover images — never the old hardcoded array.
2. `/catalog/[slug]` "What you'll learn" renders a lucide icon per outcome, never a raw emoji character, for every one of the ~38 emoji values seeded across all 10 programs.
3. Category badges on `/catalog/[slug]` (hero + related training) and on the home page use the same color per category slug.
4. Instructor panel shows expertise as multiple short pills when the source string contains a separator.
5. `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.

## Checks to Run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. Playwright: re-screenshot `/` and `/catalog/cybersecurity-awareness` at 1440px and diff against `design/image copy 2.png` again to confirm the icon/badge fixes.

## Manual Test Steps
1. Visit `/` — confirm "Featured Training" shows 4 real programs (Data Privacy Fundamentals, Workplace Safety Essentials, Financial Compliance and AML, Preventing Workplace Harassment) with real cover photos, trainers, durations, lesson counts.
2. Visit `/catalog/cybersecurity-awareness` — confirm all 4 "What you'll learn" icons are clean monochrome lucide icons in matching blue squares, no emoji.
3. Visit `/catalog/data-privacy-fundamentals` (a different category) — confirm its category badge renders a different, consistent color than cybersecurity's.
4. Confirm the trainer's expertise renders as separate pills where the source string has a separator.
