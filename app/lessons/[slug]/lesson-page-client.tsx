"use client"

import { useState, useCallback, useEffect } from "react"
import { LessonHeader } from "@/components/lesson/lesson-header"
import { LessonTabs } from "@/components/lesson/lesson-tabs"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { PortableTextBlock, LessonResource, VideoChunk } from "@/lib/types"

interface LessonPageClientProps {
  lessonId: string
  lessonTitle: string
  moduleNumber: number
  lessonNumber: number
  duration?: number
  employeeCount?: number
  requiredBy?: string
  isCompleted: boolean
  resumeSeconds?: number
  keyPoints?: string[]
  notes?: PortableTextBlock[]
  proTip?: string
  resources?: LessonResource[]
  chunks?: VideoChunk[]
}

export function LessonPageClient({
  lessonId,
  lessonTitle,
  moduleNumber,
  lessonNumber,
  duration,
  employeeCount,
  requiredBy,
  isCompleted: initialCompleted,
  resumeSeconds,
  keyPoints,
  notes,
  proTip,
  resources,
  chunks,
}: LessonPageClientProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)

  useEffect(() => {
    capturePostHogEvent("lesson_viewed", { lesson_id: lessonId })
  }, [lessonId])

  useEffect(() => {
    if (resumeSeconds && resumeSeconds > 0) {
      capturePostHogEvent("resume_used", {
        lesson_id: lessonId,
        resume_seconds: Math.round(resumeSeconds),
      })
    }
  }, [lessonId, resumeSeconds])

  const handleComplete = useCallback(async () => {
    setIsCompleted(true)
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      })
    } catch {
      setIsCompleted(false)
    }
  }, [lessonId])

  return (
    <>
      <LessonHeader
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        moduleNumber={moduleNumber}
        lessonNumber={lessonNumber}
        duration={duration}
        employeeCount={employeeCount}
        requiredBy={requiredBy}
        isCompleted={isCompleted}
        onComplete={handleComplete}
      />
      <LessonTabs
        keyPoints={keyPoints}
        notes={notes}
        proTip={proTip}
        resources={resources}
        chunks={chunks}
      />
    </>
  )
}
