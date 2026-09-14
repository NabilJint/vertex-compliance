"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Play, CheckCircle2, Circle, Video, FileCheck, Award, Smartphone, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn, formatDuration } from "@/lib/utils"
import type { LessonStatus } from "@/lib/types"

export interface CurriculumLesson {
  id: string
  slug: string
  title: string
  duration: number
  isFreePreview: boolean
  status: LessonStatus
  resumeSeconds?: number
}

export interface CurriculumModule {
  key: string
  title: string
  summary?: string
  lessons: CurriculumLesson[]
}

interface CurriculumProps {
  modules: CurriculumModule[]
  totalLessons: number
  totalDurationSeconds: number
  completedCount: number
  percent: number
  resumeHref: string
  ctaLabel: string
}

function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return <CheckCircle2 className="h-5 w-5" style={{ color: "#10B981" }} />
  }
  if (status === "in-progress") {
    return (
      <span className="relative flex h-5 w-5 items-center justify-center">
        <svg width={20} height={20} className="-rotate-90">
          <circle cx={10} cy={10} r={8} fill="none" stroke="#DBEAFE" strokeWidth={2.5} />
          <circle
            cx={10}
            cy={10}
            r={8}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={2.5}
            strokeDasharray={2 * Math.PI * 8}
            strokeDashoffset={2 * Math.PI * 8 * 0.5}
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }
  return <Circle className="h-5 w-5" style={{ color: "#E5E7EB" }} />
}

function ModuleAccordion({
  module,
  moduleNumber,
  isOpen,
  onToggle,
}: {
  module: CurriculumModule
  moduleNumber: number
  isOpen: boolean
  onToggle: () => void
}) {
  const totalSeconds = module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)

  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronUp className="h-4 w-4" style={{ color: "#94A3B8" }} /> : <ChevronDown className="h-4 w-4" style={{ color: "#94A3B8" }} />}
          <span className="text-[13px] font-medium" style={{ color: "#94A3B8" }}>Module {moduleNumber}</span>
          <span className="text-[15px] font-semibold" style={{ color: "#111827" }}>{module.title}</span>
        </div>
        <span className="text-[13px]" style={{ color: "#94A3B8" }}>
          {module.lessons.length} lessons &middot; {formatDuration(totalSeconds)}
        </span>
      </button>

      {isOpen && (
        <div className="border-t" style={{ borderColor: "#F1F5F9" }}>
          {module.lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={lesson.resumeSeconds ? `/lessons/${lesson.slug}?t=${lesson.resumeSeconds}` : `/lessons/${lesson.slug}`}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50"
              style={{ borderTop: index === 0 ? undefined : "1px solid #F8FAFC" }}
            >
              <div className="flex items-center gap-3">
                <Play className="h-4 w-4 shrink-0" style={{ color: "#CBD5E1" }} />
                <span className="text-[13px] font-medium" style={{ color: "#94A3B8" }}>
                  {moduleNumber}.{index + 1}
                </span>
                <span className="text-[14px]" style={{ color: "#111827" }}>{lesson.title}</span>
                {lesson.isFreePreview && <Badge variant="free-preview">Preview</Badge>}
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-[13px]" style={{ color: "#94A3B8" }}>{formatDuration(lesson.duration)}</span>
                <StatusIcon status={lesson.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}

const includes = [
  { icon: Video, label: (totalLessons: number) => `${totalLessons} video lessons` },
  { icon: FileCheck, label: () => "Progress tracked automatically" },
  { icon: Award, label: () => "Certificate on completion" },
  { icon: Smartphone, label: () => "Available on desktop and mobile" },
]

export function Curriculum({ modules, totalLessons, totalDurationSeconds, completedCount, percent, resumeHref, ctaLabel }: CurriculumProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(modules.length > 0 ? [modules[0].key] : []))
  const allOpen = modules.length > 0 && modules.every((module) => openKeys.has(module.key))

  function toggleModule(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleAll() {
    setOpenKeys(allOpen ? new Set() : new Set(modules.map((module) => module.key)))
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-[24px] font-bold" style={{ color: "#111827" }}>Curriculum</h2>
              <button
                onClick={toggleAll}
                className={cn("flex items-center gap-1 text-[14px] font-medium transition-colors")}
                style={{ color: "#3B82F6" }}
              >
                {allOpen ? "Collapse all" : "Expand all"} <ChevronDown className={cn("h-4 w-4 transition-transform", allOpen && "rotate-180")} />
              </button>
            </div>
            <p className="mb-6 text-[14px]" style={{ color: "#94A3B8" }}>
              {modules.length} modules &middot; {totalLessons} lessons &middot; {formatDuration(totalDurationSeconds)}
            </p>

            <div className="flex flex-col gap-3">
              {modules.map((module, index) => (
                <ModuleAccordion
                  key={module.key}
                  module={module}
                  moduleNumber={index + 1}
                  isOpen={openKeys.has(module.key)}
                  onToggle={() => toggleModule(module.key)}
                />
              ))}
            </div>
          </div>

          <div>
            <Card className="sticky top-20 p-5">
              <h3 className="mb-4 text-[15px] font-semibold" style={{ color: "#111827" }}>This training includes</h3>
              <ul className="mb-5 flex flex-col gap-3">
                {includes.map(({ icon: Icon, label }) => (
                  <li key={label(totalLessons)} className="flex items-center gap-2.5 text-[13px]" style={{ color: "#475569" }}>
                    <Icon className="h-4 w-4" style={{ color: "#94A3B8" }} />
                    {label(totalLessons)}
                  </li>
                ))}
              </ul>

              <div className="border-t pt-5" style={{ borderColor: "#F1F5F9" }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-medium" style={{ color: "#111827" }}>Progress</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>{percent}%</span>
                </div>
                <Progress value={percent} size="sm" />
                <p className="mb-4 mt-2 text-[12px]" style={{ color: "#94A3B8" }}>
                  {completedCount} of {totalLessons} lessons completed
                </p>
                <Link href={resumeHref}>
                  <Button className="w-full">{ctaLabel}</Button>
                </Link>
                <p className="mt-3 flex items-center justify-center gap-1 text-center text-[11px]" style={{ color: "#94A3B8" }}>
                  <RefreshCw className="h-3 w-3" /> Your progress is saved automatically
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
