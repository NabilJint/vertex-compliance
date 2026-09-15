"use client"

import { useState } from "react"
import { Clock, Eye, ShieldCheck, Bookmark, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDuration, formatFullDate } from "@/lib/utils"
import { capturePostHogEvent } from "@/lib/posthog-client"

interface LessonHeaderProps {
  lessonId: string
  lessonTitle: string
  moduleNumber: number
  lessonNumber: number
  duration?: number
  employeeCount?: number
  requiredBy?: string
  isCompleted: boolean
  onComplete: () => void
}

export function LessonHeader({
  lessonId,
  lessonTitle,
  moduleNumber,
  lessonNumber,
  duration,
  employeeCount,
  requiredBy,
  isCompleted,
  onComplete,
}: LessonHeaderProps) {
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="mb-6">
      <p className="mb-1 text-[13px]" style={{ color: "#94A3B8" }}>
        Module {moduleNumber} &middot; Lesson {moduleNumber}.{lessonNumber}
      </p>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[28px] font-bold leading-tight sm:text-[32px]" style={{ color: "#111827" }}>
          {lessonTitle}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant={isCompleted ? "secondary" : "primary"}
            size="sm"
            onClick={() => {
              onComplete()
              capturePostHogEvent("lesson_completed", { lesson_id: lessonId })
            }}
            className="gap-1.5"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" style={{ color: "#10B981" }} />
                Completed
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Mark complete
              </>
            )}
          </Button>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border transition-colors"
            style={{
              borderColor: "#E5E7EB",
              backgroundColor: bookmarked ? "#EFF6FF" : "#FFFFFF",
            }}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
          >
            <Bookmark
              className="h-4 w-4"
              style={{ color: bookmarked ? "#3B82F6" : "#94A3B8" }}
              fill={bookmarked ? "#3B82F6" : "none"}
            />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-5">
        {duration && (
          <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
            <Clock className="h-4 w-4" style={{ color: "#94A3B8" }} />
            <span>{formatDuration(duration)}</span>
          </div>
        )}
        {employeeCount !== undefined && (
          <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
            <Eye className="h-4 w-4" style={{ color: "#94A3B8" }} />
            <span>{employeeCount.toLocaleString()} views</span>
          </div>
        )}
        {requiredBy && (
          <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
            <ShieldCheck className="h-4 w-4" style={{ color: "#94A3B8" }} />
            <span>Required by {formatFullDate(requiredBy)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
