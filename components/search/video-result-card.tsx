"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatTimestamp } from "@/lib/utils"
import { capturePostHogEvent } from "@/lib/posthog-client"
import type { VideoResult } from "@/lib/search-types"

interface VideoResultCardProps {
  result: VideoResult
  position: number
}

export function VideoResultCard({ result, position }: VideoResultCardProps) {
  function handleClick() {
    capturePostHogEvent("search_result_clicked", {
      result_type: "video",
      lesson_slug: result.lessonSlug,
      matched_second: result.matchedSecond,
      position,
    })
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:flex-row" style={{ borderColor: "#E5E7EB" }}>
      <div className="relative flex-shrink-0 bg-gray-900 sm:w-[280px]">
        {result.thumbnail ? (
          <Image
            src={result.thumbnail}
            alt={result.lessonLabel}
            fill
            sizes="280px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center">
            <Play className="h-12 w-12 text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Play className="h-6 w-6 text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[12px] font-medium text-white">
          <Clock className="h-3 w-3" />
          {result.clipLength}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="in-progress" className="text-[11px]">
            {result.trainingProgram.name}
          </Badge>
        </div>

        <h3 className="mb-1 text-[16px] leading-[22px] font-semibold" style={{ color: "#111827" }}>
          {result.description}
        </h3>

        <p className="mb-2 text-[13px]" style={{ color: "#6B7280" }}>
          {result.moduleLabel} · {result.lessonLabel}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-[12px]" style={{ color: "#94A3B8" }}>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Matched at {formatTimestamp(result.matchedSecond)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Clip length {result.clipLength}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-4">
          <Link href={`/lessons/${result.lessonSlug}?t=${result.matchedSecond}`} onClick={handleClick}>
            <Button size="sm" className="rounded-xl" style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}>
              Watch from {formatTimestamp(result.matchedSecond)}
            </Button>
          </Link>
          <Link
            href={`/lessons/${result.lessonSlug}`}
            onClick={handleClick}
            className="text-[13px] font-medium transition-colors hover:underline"
            style={{ color: "#3B82F6" }}
          >
            Open lesson →
          </Link>
        </div>
      </div>
    </div>
  )
}
