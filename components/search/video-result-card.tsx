"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatTimestamp } from "@/lib/utils"
import type { VideoResult } from "@/lib/search-types"

interface VideoResultCardProps {
  result: VideoResult
}

export function VideoResultCard({ result }: VideoResultCardProps) {
  return (
    <Card elevated className="overflow-hidden transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <div className="relative aspect-video bg-gray-900">
        {result.thumbnail ? (
          <Image
            src={result.thumbnail}
            alt={result.lessonLabel}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-12 w-12 text-white/40" />
          </div>
        )}
        <Badge
          variant="default"
          className="absolute left-3 top-3 border-0 bg-black/70 text-white"
        >
          <Play className="h-3 w-3" />
          VIDEO MOMENT
        </Badge>
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[12px] font-medium text-white">
          <Clock className="h-3 w-3" />
          {result.clipLength}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="in-progress" className="text-[11px]">
            {result.trainingProgram.name}
          </Badge>
        </div>
        <p className="mb-1 text-[13px] font-medium" style={{ color: "#6B7280" }}>
          {result.lessonLabel} in {result.moduleLabel}
        </p>
        <h3 className="mb-2 text-[16px] leading-[22px] font-semibold" style={{ color: "#111827" }}>
          {result.description}
        </h3>
        <p className="mb-4 text-[13px]" style={{ color: "#94A3B8" }}>
          Matched at {formatTimestamp(result.matchedSecond)}
        </p>
        <Link href={`/lessons/${result.lessonSlug}?t=${result.matchedSecond}`}>
          <Button size="sm" className="w-full rounded-xl" style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}>
            <Play className="h-4 w-4" />
            Watch from {formatTimestamp(result.matchedSecond)}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
