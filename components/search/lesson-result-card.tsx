"use client"

import Link from "next/link"
import { BookOpen, CheckCircle, Clock, Eye, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { LessonResult } from "@/lib/search-types"

interface LessonResultCardProps {
  result: LessonResult & { duration?: number; employeeCount?: number; updatedAt?: string }
  position: number
}

export function LessonResultCard({ result, position }: LessonResultCardProps) {
  function handleClick() {
    capturePostHogEvent("search_result_clicked", {
      result_type: "lesson",
      lesson_slug: result.lessonSlug,
      matched_second: 0,
      position,
    })
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:flex-row" style={{ borderColor: "#E5E7EB" }}>
      <div className="flex items-center justify-center px-5 py-5 sm:px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "#EEF2FF" }}>
          <BookOpen className="h-6 w-6" style={{ color: "#3B82F6" }} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-0 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="in-progress" className="text-[11px]">
            {result.trainingProgram.name}
          </Badge>
          <Badge variant="default" className="text-[11px]">
            Required annually
          </Badge>
        </div>

        <h3 className="mb-1 text-[16px] leading-[22px] font-semibold" style={{ color: "#111827" }}>
          {result.description}
        </h3>

        <p className="mb-3 text-[13px]" style={{ color: "#6B7280" }}>
          {result.moduleLabel} · {result.lessonLabel}
        </p>

        {result.keyPoints.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5">
            {result.keyPoints.slice(0, 4).map((point, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[13px]" style={{ color: "#475569" }}>
                <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
                {point}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-4 text-[12px]" style={{ color: "#94A3B8" }}>
          {result.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(result.duration)}
            </span>
          )}
          {result.employeeCount && (
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {result.employeeCount.toLocaleString()} views
            </span>
          )}
          {result.updatedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Updated {new Date(result.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-4">
          <Link href={`/lessons/${result.lessonSlug}`} onClick={handleClick}>
            <Button size="sm" className="rounded-xl" style={{ backgroundColor: "#1E1B4B", color: "#FFFFFF" }}>
              Open lesson
            </Button>
          </Link>
          <Link
            href={`/lessons/${result.lessonSlug}`}
            onClick={handleClick}
            className="text-[13px] font-medium transition-colors hover:underline"
            style={{ color: "#3B82F6" }}
          >
            Preview →
          </Link>
        </div>
      </div>
    </div>
  )
}
