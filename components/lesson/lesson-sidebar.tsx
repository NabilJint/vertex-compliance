"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronRight, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StatusIcon } from "@/components/ui/status-icon"
import { Button } from "@/components/ui/button"
import { urlFor } from "@/sanity/lib/image"
import { formatDuration, cn } from "@/lib/utils"
import { getCategoryColor } from "@/lib/category-colors"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { LessonStatus, LessonPageProgram } from "@/lib/types"

interface LessonSidebarProps {
  program: LessonPageProgram
  currentLessonId: string
  completedIds: Set<string>
  lastPositionLessonId?: string
  percent: number
  completedCount: number
  totalLessons: number
}

function getLessonStatus(lessonId: string, completedIds: Set<string>, lastPositionLessonId?: string): LessonStatus {
  if (completedIds.has(lessonId)) return "completed"
  if (lessonId === lastPositionLessonId) return "in-progress"
  return "not-started"
}

export function LessonSidebar({
  program,
  currentLessonId,
  completedIds,
  lastPositionLessonId,
  percent,
  completedCount,
  totalLessons,
}: LessonSidebarProps) {
  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    for (const mod of program.modules) {
      const hasCurrent = mod.lessons.some((l) => l._id === currentLessonId)
      if (hasCurrent) initial.add(mod._key)
    }
    if (initial.size === 0 && program.modules.length > 0) {
      initial.add(program.modules[0]._key)
    }
    return initial
  })

  const categoryColor = getCategoryColor(program.category.slug?.current)

  function toggleModule(key: string) {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const allLessons = program.modules.flatMap((m) => m.lessons)
  const currentIdx = allLessons.findIndex((l) => l._id === currentLessonId)
  const nextLesson = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  return (
    <div className="sticky top-20 flex flex-col gap-4">
      <Card className="p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-gray-100">
            {program.modules[0]?.lessons[0]?.posterImage && (
              <Image
                src={urlFor(program.modules[0].lessons[0].posterImage).width(64).height(64).url()}
                alt={program.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <Badge
              variant="default"
              className="mb-1 border-0 text-[10px]"
              style={{ backgroundColor: `${categoryColor}1A`, color: categoryColor }}
            >
              {program.category.title.toUpperCase()}
            </Badge>
            <h3 className="truncate text-[15px] font-semibold" style={{ color: "#111827" }}>
              {program.title}
            </h3>
            <p className="text-[12px]" style={{ color: "#94A3B8" }}>
              {program.modules.length} modules &middot; {totalLessons} lessons
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-medium" style={{ color: "#111827" }}>Course progress</span>
            <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>{percent}%</span>
          </div>
          <Progress value={percent} size="sm" />
          <p className="mt-1.5 text-[12px]" style={{ color: "#94A3B8" }}>
            {completedCount} of {totalLessons} lessons completed
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {program.modules.map((module, moduleIdx) => {
            const isOpen = openModules.has(module._key)
            const moduleLessons = module.lessons
            const moduleTotalSeconds = moduleLessons.reduce((sum, l) => sum + (l.duration || 0), 0)

            return (
              <div key={module._key} className="rounded-lg">
                <button
                  onClick={() => toggleModule(module._key)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                    )}
                    <span className="text-[12px] font-medium" style={{ color: "#94A3B8" }}>
                      Module {moduleIdx + 1}
                    </span>
                    <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>
                      {module.title}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: "#94A3B8" }}>
                    {moduleLessons.length} lessons &middot; {formatDuration(moduleTotalSeconds)}
                  </span>
                </button>

                {isOpen && (
                  <div className="ml-4 flex flex-col gap-0.5 pb-2">
                    {moduleLessons.map((lesson, lessonIdx) => {
                      const status = getLessonStatus(lesson._id, completedIds, lastPositionLessonId)
                      const isCurrent = lesson._id === currentLessonId
                      return (
                        <Link
                          key={lesson._id}
                          href={`/lessons/${lesson.slug.current}`}
                          onClick={() =>
                            capturePostHogEvent("lesson_selected", {
                              lesson_id: lesson._id,
                              lesson_slug: lesson.slug.current,
                              module_key: module._key,
                              lesson_status: status,
                            })
                          }
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                            isCurrent ? "bg-blue-50" : "hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <StatusIcon status={status} />
                            <span className="text-[12px] font-medium" style={{ color: "#94A3B8" }}>
                              {moduleIdx + 1}.{lessonIdx + 1}
                            </span>
                            <span className="truncate text-[13px]" style={{ color: isCurrent ? "#3B82F6" : "#111827" }}>
                              {lesson.title}
                            </span>
                            {isCurrent && (
                              <Badge variant="in-progress" className="shrink-0 text-[10px]">
                                Now playing
                              </Badge>
                            )}
                          </div>
                          <span className="shrink-0 text-[11px]" style={{ color: "#94A3B8" }}>
                            {formatDuration(lesson.duration || 0)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {nextLesson && (
        <Link
          href={`/lessons/${nextLesson.slug.current}`}
          onClick={() => capturePostHogEvent("next_lesson_clicked", { lesson_id: nextLesson._id })}
        >
          <Button className="w-full gap-2">
            Next lesson <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}

      <p className="text-center text-[12px]" style={{ color: "#94A3B8" }}>
        Your progress is saved automatically
      </p>
    </div>
  )
}
