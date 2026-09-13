# Design System Implementation Prompt

## Goal
Implement the Vertex Compliance design system: CSS custom properties, Tailwind v4 theme tokens, a reusable component library, and a `/design-system-showcase` page that renders every token and component for visual verification.

## Dependencies to Install
```bash
npm install lucide-react clsx tailwind-merge
```

## What to Build

### 1. Design Tokens (globals.css)
All tokens from the reference image as CSS custom properties, mapped to Tailwind v4 via `@theme inline`.

### 2. Component Library (`components/ui/`)
Utility-first components using `clsx` + `tailwind-merge` for className merging. Each component accepts variant props and renders with design token classes.

| Component | Variants | File |
|-----------|----------|------|
| Button | primary, secondary, ghost, destructive × default/hover/disabled/loading | `components/ui/button.tsx` |
| Input | text, search, textarea, select | `components/ui/input.tsx` |
| Badge | completed, in-progress, recertification-due, free-preview | `components/ui/badge.tsx` |
| Card | default (shadow-card), elevated (shadow-modal) | `components/ui/card.tsx` |
| Toast | success, warning, error | `components/ui/toast.tsx` |
| Progress | circular (%), linear (bar) | `components/ui/progress.tsx` |
| Avatar | image + fallback initials | `components/ui/avatar.tsx` |
| Tabs | overview, notes, resources, transcript | `components/ui/tabs.tsx` |
| Dialog | modal with cancel/complete actions | `components/ui/dialog.tsx` |

### 3. Utility Function (`lib/utils.ts`)
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

### 4. Showcase Page (`app/design-system-showcase/page.tsx`)
A server component that renders every section from the design system image:
- 01. Color Palette (swatches with hex + label)
- 02. Typography (all type scale samples)
- 03. Spacing, Radius & Shadows (visual samples)
- 04. Components (Button variants, Inputs, Badges, Toast, Progress, Avatar, Tabs, Dialog)
- 05. Iconography (lucide-react icon grid)
- 06. Layout Patterns (wireframe placeholders)
- 07. Grid & Container (12-col demo)
- 08. States & Motion (focus ring, hover elevation, transition demos)

## Files to Touch
1. `app/globals.css` — design tokens (already partially done, extend)
2. `app/layout.tsx` — metadata (already done)
3. `lib/utils.ts` — cn() utility (new)
4. `components/ui/button.tsx` — Button component (new)
5. `components/ui/input.tsx` — Input/Textarea/Select (new)
6. `components/ui/badge.tsx` — Badge component (new)
7. `components/ui/card.tsx` — Card component (new)
8. `components/ui/toast.tsx` — Toast component (new)
9. `components/ui/progress.tsx` — Progress component (new)
10. `components/ui/avatar.tsx` — Avatar component (new)
11. `components/ui/tabs.tsx` — Tabs component (new)
12. `components/ui/dialog.tsx` — Dialog component (new)
13. `app/design-system-showcase/page.tsx` — showcase page (new)

## Design Token Spec (from reference image)

### Colors
- Primary: `#1E1B4B` (Deep Indigo)
- Primary Accent: `#3B82F6` (Electric Blue)
- Success: `#10B981` (Muted Green)
- Warning: `#F59E0B` (Amber)
- Danger: `#EF4444` (Soft Red)
- Neutrals: Gray 50 `#F9FAFB` → Gray 900 `#111827`
- Surface: White `#FFFFFF`, Off-white `#F8FAFC`

### Typography (Geist = Inter equivalent)
- Display/H1: 48/56 Bold
- H2: 32/40 Semibold
- H3: 24/32 Semibold
- H4: 20/28 Medium
- Body Large: 18/28 Regular
- Body: 16/24 Regular
- Body Small: 14/20 Regular
- Caption: 12/16 Regular

### Spacing: 4, 8, 12, 16, 24, 32, 48, 64px
### Radius: sm 6px, md 10px, lg 16px, full 9999px
### Shadows: card `0 1px 2px rgba(0,0,0,0.05)`, modal `0 10px 30px rgba(0,0,0,0.08)`, focus `0 0 0 3px rgba(59,130,246,0.3)`
### Motion: 150ms cards, 200ms buttons/modals, ease-out

## Acceptance Criteria
1. All color/typography/spacing/radius/shadow/motion tokens defined
2. `lib/utils.ts` exports `cn()` using clsx + tailwind-merge
3. All 9 components built with variant props and proper token usage
4. `/design-system-showcase` renders all 8 sections from the image
5. `npm run lint` passes (0 errors in app code)
6. `npm run build` passes (0 errors in app code)

## Checks to Run
1. `npm run lint`
2. `npm run build`
3. `npm run dev` → visit `/design-system-showcase` to visually verify
