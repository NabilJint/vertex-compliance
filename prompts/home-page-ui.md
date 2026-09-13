# Home Page UI Implementation

## Goal
Reproduce the Vertex Compliance home page from the design reference at `design/image copy.png`. This is a static, presentational home page with 10 sections. No backend, no data fetching, no auth — pure UI.

## Sections to Build (top to bottom)
1. **Header** — Logo ("Vertex Compliance" with V icon), nav links (Catalog, My Training, Search, Dashboard), search icon, notification bell, user avatar with name "Jintoro Yusuf"
2. **Hero** — Badge "AI-POWERED COMPLIANCE TRAINING", heading "Find the exact moment. Stay compliant.", subtitle, search bar with Search button, suggested search pills (Data handling rules, Incident reporting, Annual security training)
3. **Trust Strip** — "TRUSTED BY COMPLIANCE TEAMS AT" label + company logo placeholders (Microsoft, Google, Amazon, Meta, J.P.Morgan, Spotify)
4. **Featured Training** — 4 training cards in a grid. Each card has: thumbnail image, category badge, optional "Popular" badge, title, trainer name + role, metadata row (duration, lesson count, progress ring)
5. **How It Works** — 3 steps with icons: Search in plain language, Jump to the exact moment, Prove compliance
6. **Stats Band** — Dark background, 4 stats: 12,000+ training videos indexed, 94% on-time completion rate, 3 sec average time to answer, SOC 2 audit-ready by default
7. **Browse by Category** — 6 category cards in 2 rows of 3. Each has icon, name, video count, chevron
8. **Compliance Callout** — Split layout: left side has badge, heading, bullet list with checkmarks, CTA button; right side has a dashboard preview card with compliance stats and team table
9. **Testimonial** — Centered quote with attribution (Priya Nair, Head of Compliance, Acme Corp)
10. **Footer** — Dark background, logo + tagline, 4 link columns (Product, Company, Resources, Legal), newsletter signup, social icons, copyright

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 (already configured in `globals.css` with `@import "tailwindcss"` and `@theme inline`)
- Existing UI components in `components/ui/` (Button, Card, Badge, Input, Avatar, Progress)
- lucide-react for icons (already a dependency)
- `@/*` path alias maps to repo root

## Existing Design Tokens (from globals.css)
- Primary: `#1E1B4B` (dark indigo)
- Accent: `#3B82F6` (blue)
- Success: `#10B981`, Warning: `#F59E0B`, Danger: `#EF4444`
- Gray scale: 50-900 defined
- Surface/Background/Border tokens defined
- Font: Geist Sans (via `--font-geist-sans`)

## Design Decisions
- Use existing `components/ui/` primitives where they match (Button, Card, Badge, Avatar)
- Build section components as separate files in `components/home/` for maintainability
- All components are server-compatible (no "use client" unless needed)
- Use lucide-react for all icons (Search, ChevronRight, Clock, BookOpen, Play, CheckCircle, etc.)
- Company logos in trust strip: use styled text placeholders (no SVG files available)
- Training card thumbnails: use colored gradient placeholders
- Dashboard preview in compliance callout: build as a styled card mockup
- Stats band: dark `#1E1B4B` background, white text
- Footer: dark `#1E1B4B` background
- Responsive: the design is desktop-first; add responsive breakpoints (stack columns on mobile)

## Files to Create
- `components/home/header.tsx`
- `components/home/hero.tsx`
- `components/home/trust-strip.tsx`
- `components/home/featured-training.tsx`
- `components/home/how-it-works.tsx`
- `components/home/stats-band.tsx`
- `components/home/browse-category.tsx`
- `components/home/compliance-callout.tsx`
- `components/home/testimonial.tsx`
- `components/home/footer.tsx`

## Files to Edit
- `app/page.tsx` — replace default content with home page sections

## Requirements
- Pixel-perfect reproduction of layout, spacing, typography, and colors from the design
- Each section is its own component file
- Use existing UI components from `components/ui/` where applicable
- All icons from lucide-react
- Responsive down to mobile (stack columns, collapse grids)
- No external images — use gradients, colors, and icons as placeholders
- No interactivity beyond hover states (this is a static page)

## Acceptance Criteria
- All 10 sections render correctly on the home page
- Visual match to the design reference within reasonable fidelity
- TypeScript compiles without errors
- Lint passes
- Production build succeeds
