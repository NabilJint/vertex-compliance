"use client"

import Link from "next/link"
import { BookOpen, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LessonResult } from "@/lib/search-types"

interface LessonResultCardProps {
  result: LessonResult
}

export function LessonResultCard({ result }: LessonResultCardProps) {
  return (
    <Card elevated className="overflow-hidden transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "#EEF2FF" }}>
            <BookOpen className="h-5 w-5" style={{ color: "#3B82F6" }} />
          </div>
          <div>
            <Badge variant="in-progress" className="mb-1 text-[11px]">
              {result.trainingProgram.name}
            </Badge>
            <p className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              {result.lessonLabel} in {result.moduleLabel}
            </p>
          </div>
        </div>
        <h3 className="mb-3 text-[16px] leading-[22px] font-semibold" style={{ color: "#111827" }}>
          {result.description}
        </h3>
        {result.keyPoints.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {result.keyPoints.slice(0, 4).map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] leading-[18px]" style={{ color: "#475569" }}>
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: "#3B82F6" }} />
                {point}
              </li>
            ))}
          </ul>
        )}
        <Link href={`/lessons/${result.lessonSlug}`}>
          <Button size="sm" variant="secondary" className="w-full rounded-xl">
            <BookOpen className="h-4 w-4" />
            Open Lesson
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
