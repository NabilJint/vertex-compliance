"use client"

import { useEffect } from "react"
import { capturePostHogEvent } from "@/lib/posthog-client"

interface PageTrackerProps {
  event: string
  properties?: Record<string, unknown>
}

export function PageTracker({ event, properties }: PageTrackerProps) {
  useEffect(() => {
    capturePostHogEvent(event, properties)
  }, [event, properties])

  return null
}
