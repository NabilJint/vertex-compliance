"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { identifyPostHogUser, resetPostHog } from "@/lib/posthog-client"

export function PostHogIdentity() {
  const { isLoaded, user } = useUser()
  const identifiedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      if (identifiedUserId.current && identifiedUserId.current !== user.id) {
        resetPostHog()
      }

      identifyPostHogUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      })
      identifiedUserId.current = user.id
      return
    }

    if (identifiedUserId.current) {
      resetPostHog()
      identifiedUserId.current = null
    }
  }, [isLoaded, user])

  return null
}
