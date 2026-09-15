import { PostHog } from "posthog-node"

let client: PostHog | null = null

function getPostHogClient(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "PostHog server-side tracking skipped: NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN or NEXT_PUBLIC_POSTHOG_HOST not configured"
      )
    }
    return null
  }

  if (!client) {
    client = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return client
}

export function captureServerEvent({
  event,
  distinctId,
  properties,
}: {
  event: string
  distinctId: string
  properties?: Record<string, unknown>
}) {
  const ph = getPostHogClient()
  if (!ph) return

  ph.capture({
    distinctId,
    event,
    properties: properties ?? {},
  })
}

export async function flushServerEvents() {
  if (client) {
    await client.flush()
  }
}
