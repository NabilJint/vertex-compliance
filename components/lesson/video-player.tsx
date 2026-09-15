"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Play, Pause } from "lucide-react"
import { urlFor } from "@/sanity/lib/image"
import { getYouTubeEmbedUrl } from "@/lib/youtube"
import { formatTimestamp } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface VideoPlayerProps {
  videoUrl: string
  posterImage?: { _type: "image"; asset: { _ref: string; _type: "reference" } }
  title: string
  duration?: number
  moduleLessonLabel: string
  positionInSeconds?: number
  onTimeUpdate?: (seconds: number) => void
  onFirstPlay?: () => void
}

export function VideoPlayer({
  videoUrl,
  posterImage,
  title,
  duration,
  moduleLessonLabel,
  positionInSeconds,
  onTimeUpdate,
  onFirstPlay,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const posterUrl = posterImage ? urlFor(posterImage).width(960).height(540).url() : undefined
  const embedUrl = getYouTubeEmbedUrl(videoUrl, positionInSeconds)

  const handleTimeUpdate = useCallback(() => {
    if (!iframeRef.current) return
    try {
      const data = JSON.parse(
        iframeRef.current.getAttribute("data-last-state") || '{"state":0,"time":0}'
      )
      onTimeUpdate?.(data.time ?? 0)
    } catch {
      // ignore parse errors
    }
  }, [onTimeUpdate])

  useEffect(() => {
    if (!embedUrl) return

    let interval: ReturnType<typeof setInterval> | null = null

    function onMessage(event: MessageEvent) {
      if (!iframeRef.current) return
      if (typeof event.data !== "string") return

      try {
        const data = JSON.parse(event.data)
        if (data.event === "onStateChange") {
          const state = data.info
          if (state === 1) {
            setIsPlaying(true)
            if (!hasPlayed) {
              setHasPlayed(true)
              onFirstPlay?.()
            }
            interval = setInterval(handleTimeUpdate, 10000)
          } else {
            setIsPlaying(false)
            if (interval) clearInterval(interval)
          }
        } else if (data.event === "infoDelivery") {
          iframeRef.current.setAttribute(
            "data-last-state",
            JSON.stringify({ state: data.info?.playerState, time: data.info?.currentTime })
          )
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener("message", onMessage)
    return () => {
      window.removeEventListener("message", onMessage)
      if (interval) clearInterval(interval)
    }
  }, [embedUrl, hasPlayed, onFirstPlay, handleTimeUpdate])

  if (!embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-[16px] bg-gray-900">
        {posterUrl && (
          <Image src={posterUrl} alt={title} fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[14px] text-white/70">Video not available</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative aspect-video overflow-hidden rounded-[16px] bg-gray-900">
        {posterUrl && !hasPlayed && (
          <Image src={posterUrl} alt={title} fill sizes="100vw" className="object-cover" priority />
        )}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          data-last-state={JSON.stringify({ state: 0, time: positionInSeconds ?? 0 })}
        />
        <Badge
          variant="default"
          className="absolute left-4 top-4 border-0 bg-black/70 text-white"
        >
          NOW PLAYING
        </Badge>
        {duration && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[12px] font-medium text-white">
            {moduleLessonLabel}
          </div>
        )}
      </div>
      {duration && (
        <div className="mt-2 flex items-center gap-2 text-[13px]" style={{ color: "#94A3B8" }}>
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{formatTimestamp(positionInSeconds ?? 0)} / {formatTimestamp(duration)}</span>
        </div>
      )}
    </div>
  )
}
