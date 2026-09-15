"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { LessonPageProgram } from "@/lib/types"

interface LessonNavigationProps {
  program: LessonPageProgram
  currentLessonId: string
}

export function LessonNavigation({ program, currentLessonId }: LessonNavigationProps) {
  const allLessons = program.modules.flatMap((m) => m.lessons)
  const currentIdx = allLessons.findIndex((l) => l._id === currentLessonId)

  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  return (
    <div className="flex items-stretch gap-4 border-t py-6" style={{ borderColor: "#E5E7EB" }}>
      {prevLesson ? (
        <Link
          href={`/lessons/${prevLesson.slug.current}`}
          onClick={() => capturePostHogEvent("prev_lesson_clicked", { lesson_id: prevLesson._id })}
          className="group flex flex-1 items-center gap-3 rounded-[12px] border px-5 py-4 transition-colors hover:bg-gray-50"
          style={{ borderColor: "#E5E7EB" }}
        >
          <ChevronLeft className="h-5 w-5 shrink-0 transition-colors group-hover:text-[#3B82F6]" style={{ color: "#CBD5E1" }} />
          <div className="min-w-0 text-left">
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#94A3B8" }}>
              Previous lesson
            </p>
            <p className="truncate text-[14px] font-semibold" style={{ color: "#111827" }}>
              {prevLesson.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextLesson ? (
        <Link
          href={`/lessons/${nextLesson.slug.current}`}
          onClick={() => capturePostHogEvent("next_lesson_clicked", { lesson_id: nextLesson._id })}
          className="group flex flex-1 items-center justify-end gap-3 rounded-[12px] border px-5 py-4 transition-colors hover:bg-gray-50"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div className="min-w-0 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#94A3B8" }}>
              Next lesson
            </p>
            <p className="truncate text-[14px] font-semibold" style={{ color: "#111827" }}>
              {nextLesson.title}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 transition-colors group-hover:text-[#3B82F6]" style={{ color: "#CBD5E1" }} />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
