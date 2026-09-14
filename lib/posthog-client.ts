import posthog from "posthog-js"

const posthogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST
)

export function capturePostHogEvent(event: string, properties?: Record<string, unknown>) {
  if (!posthogConfigured) return
  posthog.capture(event, properties)
}

export function identifyPostHogUser(distinctId: string, properties?: Record<string, unknown>) {
  if (!posthogConfigured) return
  posthog.identify(distinctId, properties)
}

export function resetPostHog() {
  if (!posthogConfigured) return
  posthog.reset()
}
