# PostHog browser analytics install

## Goal

Install the PostHog browser SDK in the web app. Before this change the project
records no pageviews, no session replay, and no error events, because the SDK
was never added. This change starts the data flow so the team can see how the
catalog, the training program pages, and search are used.

## Skills read

- `instrument-product-analytics` (bundled), plus its `next-js.md` reference and
  `COMMANDMENTS.md`.

## Code inspected

- `package.json`: no `posthog-js` dependency.
- `app/layout.tsx`: wraps the tree in `ClerkProvider` only.
- `lib/sanity.ts` and `sanity/lib/client.ts`: the env-var read pattern.
- `proxy.ts`: Clerk middleware. This app is Next 16, so middleware lives in
  `proxy.ts`, not `middleware.ts`.
- `.gitignore`: `.env*` is ignored.

## Decisions

- Initialize PostHog in a `"use client"` provider, mounted next to
  `ClerkProvider` in `app/layout.tsx`. This keeps the key on the browser and
  the init on the client, as the SDK needs.
- Use `defaults: "2026-05-30"` so pageviews, pageleaves, and session replay
  turn on with current defaults. No custom capture calls in this change.
- Env vars: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`. The host
  default is the EU cloud endpoint, because this project is on EU cloud.
- A missing key must not break the app. In development the provider fails loud;
  in production it stays a no-op. This follows the skill commandment.
- Add a `.env.example` as the canonical env list, and allow it past
  `.gitignore` with a negation rule.

## Files touched

- `package.json` / `package-lock.json`: add `posthog-js`.
- `components/posthog-provider.tsx`: new provider.
- `app/layout.tsx`: mount the provider.
- `.env.example`: new canonical env list.
- `.gitignore`: allow `.env.example`.

## Requirements

- No token or write path in the browser beyond the public PostHog key.
- Do not add per-page capture calls. That is separate scoped work.

## Security

- The PostHog project key is public by design, so it may reach the browser.
- The Clerk secret key and the Sanity tokens stay server only. `.env.example`
  uses placeholders, never real secrets.

## Acceptance criteria

- The app builds, type checks, and lints.
- With a valid key set, the browser sends a `$pageview` on first load.

## Checks

- `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## Manual test

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_POSTHOG_KEY`.
2. Run `npm run dev` and open the site.
3. Confirm a `$pageview` arrives in PostHog activity.
