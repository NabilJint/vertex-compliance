import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { saveProgress } from "@/lib/sanity"
import { captureServerEvent, flushServerEvents } from "@/lib/posthog-server"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { lessonId, positionSeconds, completed } = body as {
    lessonId?: string
    positionSeconds?: number
    completed?: boolean
  }

  if (lessonId !== undefined && (typeof lessonId !== "string" || lessonId.length === 0)) {
    return NextResponse.json({ error: "lessonId must be a non-empty string" }, { status: 400 })
  }
  if (positionSeconds !== undefined && typeof positionSeconds !== "number") {
    return NextResponse.json({ error: "positionSeconds must be a number" }, { status: 400 })
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return NextResponse.json({ error: "completed must be a boolean" }, { status: 400 })
  }

  try {
    await saveProgress(userId, { lessonId, positionSeconds, completed })

    captureServerEvent({
      event: "progress_saved",
      distinctId: userId,
      properties: {
        lesson_id: lessonId ?? null,
        completed: completed ?? null,
        position_seconds: positionSeconds ?? null,
      },
    })
    await flushServerEvents()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to save progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
