# Sanity Content Model, Studio Structure & Server Data Layer

## Goal
Implement the full Sanity content model for Vertex Compliance (training programs, modules, lessons, trainers, categories, video documents, agent context, progress), configure the Studio structure, and build the server-side read client and data-fetching layer.

## Skills Referenced
- sanity-best-practices: schema design, defineType/defineField/defineArrayMember, Studio structure, GROQ patterns
- AGENTS.md: section 8 (data model), section 5 (app structure boundaries)

## Existing Code Inspected
- `sanity.config.ts`: Studio config at `/studio` basePath, uses structureTool + visionTool
- `sanity/env.ts`: apiVersion, dataset, projectId exports
- `sanity/schemaTypes/index.ts`: empty types array
- `sanity/structure.ts`: default list showing all document types
- `sanity/lib/client.ts`: basic `createClient` with CDN enabled, no token
- `sanity/lib/image.ts`: `urlFor` image builder
- `sanity/lib/live.ts`: `sanityFetch` and `SanityLive` using defineLive
- `app/layout.tsx`: ClerkProvider wrapping html
- `.env.local`: SANITY_DATASET=production, SANITY_PROJECT_ID=eeee8ze4 (no read token yet)
- `package.json`: sanity v5, next-sanity v13, next v16

## Decisions & Assumptions

### Content Model (section 8 from AGENTS.md)
1. **trainingProgram** — document. Fields: title, slug, summary, coverImage, level, requiredBy, isPopular, employeeCount, learningOutcomes[] (icon, title, description), trainer (reference→trainer), category (reference→category), modules[] (embedded objects with title, summary, lessons[] references to lesson).
2. **module** — embedded object inside trainingProgram, NOT its own document. Has title, summary, lessons[] (references to lesson).
3. **lesson** — document. Fields: title, slug, videoUrl, posterImage, duration, isFreePreview, employeeCount, notes (Portable Text), keyPoints[] (string), proTip (text), resources[] (type, title, description, url). Does NOT store parent trainingProgram (derive via reverse reference).
4. **trainer** — document. Fields: name, slug, photo, expertise, bio (Portable Text).
5. **category** — document. Fields: title, slug, description.
6. **video** — document (built by offline pipeline). Fields: videoId, videoUrl, chapters[] (startSeconds, label), chunks[] (startSeconds, text).
7. **agentContext** — document (singleton-ish). Fields: contentScope (text), instructions (text).
8. **progress** — document. Fields: userId (string), completedLessons[] (references to lesson), lastPosition (object: lessonRef, positionSeconds). Keyed by Clerk user id, written only through server route.

### Studio Structure
- Singleton pattern for agentContext (single document, create if not exists)
- List: Training Programs, Lessons, Trainers, Categories, Videos, Agent Context
- Modules edited inline within trainingProgram (not a separate list)

### Server Data Layer
- `sanity/lib/client.ts`: add a `readClient` with `token` for private dataset reads
- `sanity/lib/queries.ts`: all GROQ queries with typed responses
- `lib/sanity.ts`: server-only data fetching functions using readClient

### Files to Create/Modify
1. `sanity/schemaTypes/trainingProgram.ts` — trainingProgram + module object
2. `sanity/schemaTypes/lesson.ts` — lesson document
3. `sanity/schemaTypes/trainer.ts` — trainer document
4. `sanity/schemaTypes/category.ts` — category document
5. `sanity/schemaTypes/video.ts` — video document
6. `sanity/schemaTypes/agentContext.ts` — agentContext document
7. `sanity/schemaTypes/progress.ts` — progress document
8. `sanity/schemaTypes/index.ts` — register all schemas
9. `sanity/structure.ts` — custom desk structure
10. `sanity/lib/client.ts` — add readClient with token
11. `sanity/lib/queries.ts` — GROQ queries
12. `lib/sanity.ts` — server data fetching functions
13. `.env.local` — add SANITY_API_READ_TOKEN placeholder

## Requirements
- Use defineType, defineField, defineArrayMember everywhere
- Import icons from `@sanity/icons/<IconName>` (not root)
- Modules are embedded objects inside trainingProgram, not standalone documents
- Lessons link to videos by videoUrl string (not reference), because videos are internal lookup docs
- Progress uses Clerk userId, not a reference to a user document
- All reads go through server-side client with token
- Browser never holds the read token
- GROQ queries use `defineQuery` for type safety
- Slug fields use validation for uniqueness

## Security Considerations
- Read token stays server-only (no NEXT_PUBLIC prefix)
- No token exposed to browser bundle
- Progress writes go through server routes only (not implemented here, but schema supports it)
- agentContext document not exposed to public queries

## Acceptance Criteria
1. All 7 schemas defined with proper types, validation, and icons
2. Studio structure shows organized list with singleton for agentContext
3. `sanity/lib/client.ts` exports both `client` (CDN) and `readClient` (token)
4. `sanity/lib/queries.ts` exports typed GROQ queries for: all training programs, single program by slug (with modules→lessons), single lesson by slug, all trainers, single trainer by slug, all categories, video by videoUrl
5. `lib/sanity.ts` exports async data functions using readClient
6. `.env.local` has SANITY_API_READ_TOKEN entry
7. TypeScript compiles cleanly (no type errors)

## Checks to Run
1. `npx tsc --noEmit` from project root — must pass
2. `npm run lint` from project root — must pass
3. Studio deploys: `npx sanity deploy` (requires studio app in Sanity management)
